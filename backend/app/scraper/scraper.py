import json
import os
import re
import pdb
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

# -------------- Set up --------------
def get_headless_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")

    return webdriver.Chrome(options=options)

# -------------- Util Functions --------------
def get_selector_value(driver, value, attr=None):
    """Returns element's text by default or provided attribute value."""
    try:
        element = driver.find_element(By.CSS_SELECTOR, value)
        return element.get_attribute(attr) if attr else element.get_attribute('textContent').strip()
    except NoSuchElementException:
        return ""

def element_exists(driver, value):
    """Returns True if element exists, otherwise False."""
    return bool(driver.find_elements(By.CSS_SELECTOR, value))

def wait_for_elements(driver, selectors, timeout=30):
    """Waits until all tigiven CSS selectors are visible on the page."""
    wait = WebDriverWait(driver, timeout)
    try:
        all_conditions = []
        for selector in selectors:
            all_conditions.append(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            all_conditions.append(EC.visibility_of_element_located((By.CSS_SELECTOR, selector))) 
        wait.until(EC.all_of(*all_conditions))
    
    except TimeoutException as e:
        print(f"Timeout waiting for elements: {selectors}")
        raise

# -------------- Get Each Profile --------------
def get_profile_details(driver, url):
    try:
        driver.get(url)

        # Summary
        provider_name_full = get_selector_value(driver, '.info-name')
        provider_pronouns = get_selector_value(driver, '.info-name span')
        provider_name = provider_name_full.replace(provider_pronouns, '').strip() if provider_pronouns else provider_name_full.strip()

        intro = get_selector_value(driver, '.info-intro')
        title = get_selector_value(driver, '.info-title')
        credentials = get_selector_value(driver, '.info-credentials')
        status = get_selector_value(driver, '.pill__status')

        # Glance Stats
        glance_stats = get_selector_value(driver, '.glance-stats').lower()
        rate_match = re.search(r'rate: (\$\d+)(?:-(\$\d+))?', glance_stats)
        rate = {
            'min': rate_match.group(1) if rate_match else '',
            'max': rate_match.group(2) if rate_match and rate_match.group(2) else ''
        }
        free_consultation = 'free initial consultation' in glance_stats

        practicing_since_match = re.search(r'practicing since:\s*(\d{4})', glance_stats)
        practicing_since = practicing_since_match.group(1) if practicing_since_match else ''

        languages_match = re.search(r'Languages:\s*([A-Za-z, ]+)', glance_stats)
        languages = languages_match.group(1).strip() if languages_match else ''

        # Services
        services = [
            service.text.strip()
            for service in driver.find_elements(By.CSS_SELECTOR, '.glance-services li')
        ]

        # Insurance
        insurance_providers = [
            insurance.text.strip()
            for insurance in driver.find_elements(By.CSS_SELECTOR, '.glance-insurance li')
        ]

        # Ideal Client (Optional)
        ideal_client = get_selector_value(driver, '.client-text')

        # Approaches
        approaches = []
        approach_blocks = driver.find_elements(By.CSS_SELECTOR, '.profile-approaches .approach')

        for block in approach_blocks:
            try:
                heading = block.find_element(By.CSS_SELECTOR, '.approach-heading').text.strip()
                divs = block.find_elements(By.TAG_NAME, 'div')
                body = divs[1].text.strip() if len(divs) > 1 else ''

                approaches.append({
                    heading: body
                })
            except Exception as e:
                print(f"Skipping block due to error: {e}")
                continue

        specialities = []
        specialty_desc_list = driver.find_elements(By.CSS_SELECTOR, '.uk-switcher.specialty-card__specialtyDesc > li')
        
        for s_item in specialty_desc_list:
            try:
                s_link = s_item.find_element(By.CSS_SELECTOR, 'a')
                raw_text = s_link.get_attribute('textContent') or s_link.text
                name = raw_text.replace('External link', '').strip()
                
                p_elem = s_item.find_element(By.TAG_NAME, 'p')
                description = p_elem.get_attribute('textContent').strip()

                if name and description:
                    specialities.append({
                        'name': name,
                        'description': description
                    })
            except NoSuchElementException:
                continue
        
        other_techniques = []

        for elem in driver.find_elements(By.CSS_SELECTOR, '#other-techniques li a'):
            other_techniques.append(elem.get_attribute('textContent').strip())

        other_issues = []

        for elem in driver.find_elements(By.CSS_SELECTOR, '#other-issues li a'):
            other_issues.append(elem.get_attribute('textContent').strip())

        providerInfo = {
            'name': provider_name,
            'pronouns': provider_pronouns,
            'full_name': provider_name_full,
            'title': title,
            'credentials': credentials,
            'status': status,
            'intro': intro,
            'rate': rate,
            'free_consultation': free_consultation,
            'practicing_since': practicing_since,
            'languages': languages,
            'services': services,
            'insurance': insurance_providers,
            'ideal_client': ideal_client,
            'approaches': approaches,
            'specialities': specialities,
            'other_techniques': other_techniques,
            'other_issues': other_issues,
            'url': url
        }

        return providerInfo
    
    except Exception as e:
        print(f"Failed to load profile {url}: {e}")
        return {}

# -------------- Get All Providers --------------
def get_providers(driver):
    driver.get('https://www.portlandtherapycenter.com/therapists?zip=')

    try:
        WebDriverWait(driver, 40).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".ais-Hits-item"))
        )
    except TimeoutException:
        print("Timed out waiting for provider cards.")
        return []

    cards = driver.find_elements(By.CSS_SELECTOR, ".ais-Hits-item")
    providers = []

    for card in cards:
        try:
            url = get_selector_value(card, '.searchCard__avatar a', 'href')

            providerInfo = {
                'profile_fetched': False,
                'url': url
            }
            providers.append(providerInfo)

        except Exception as e:
            print(f"Error processing card: {e}")
            continue

    print(f"Found {len(providers)} providers")
    return providers

# -------------- Main Scraper --------------
def scraper():
    DATA_FILE = 'providers.json'
    ERROR_FILE = 'failed_batches.json'
    BATCH_SIZE = 20

    providers = []
    failed_batches = []

    if os.path.exists(ERROR_FILE):
        with open(ERROR_FILE, 'r') as f:
            failed_batches = json.load(f)
            print(f"Found {len(failed_batches)} failed batches to retry")

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            providers = json.load(f)
            print(f"Loaded {len(providers)} providers from file.")

    driver = get_headless_driver()

    if not providers:
        print(f"Starting scrape, no existing data found.")
        providers = get_providers(driver)
        
        with open(DATA_FILE, 'w') as f:
            json.dump(providers, f, indent=2)
            print(f"Saved {len(providers)} providers to file.")

    for i in range(0, len(providers), BATCH_SIZE):
        batch_num = (i // BATCH_SIZE) + 1
        batch = providers[i:i + BATCH_SIZE]

        if all(p.get('profile_fetched', False) for p in batch):
            print(f"Skipping batch {batch_num} - already processed")
            continue

        try:
            print(f"\nProcessing batch {batch_num}...")

            for provider in batch:
                try:
                    if provider.get('profile_fetched'):
                        print(f"Skipping {provider.get('name', 'unknown')} - already processed")
                        continue

                    details = get_profile_details(driver, provider['url'])
                    provider.update(details)

                    if provider.get('approaches'):
                        provider['profile_fetched'] = True
                        print(f"Profile fetched: {provider['name']}")
                    else:
                        print(f"Missing approaches data for: {provider['name']}")

                except Exception as e:
                    print(f"Error processing provider {provider.get('name', 'unknown')}: {str(e)}")
                    continue

            with open(DATA_FILE, 'w') as f:
                json.dump(providers, f, indent=2)
                print(f"Batch {batch_num} saved successfully.")

        except Exception as e:
            print(f"Error processing batch {batch_num}: {str(e)}")
            failed_batches.append({
                'batch_num': batch_num,
                'start_index': i,
                'providers': [p['url'] for p in batch]
            })

            with open(ERROR_FILE, 'w') as f:
                json.dump(failed_batches, f, indent=2)
                print(f"Saved failed batch {batch_num} to {ERROR_FILE}")

            try:
                with open(DATA_FILE, 'w') as f:
                    json.dump(providers, f, indent=2)
                    print("Saved progress before error")
            except Exception as save_error:
                print(f"Error saving progress: {str(save_error)}")

    driver.quit()
    
    # Report summary
    if failed_batches:
        print(f"\nScrape completed with {len(failed_batches)} failed batches.")
        print("Failed batches saved to failed_batches.json")
    else:
        print("\nScrape completed successfully!")

# ---- Test Profile Scrape --------------

    # driver = get_headless_driver()
    # test = get_profile_details(driver, 'https://www.portlandtherapycenter.com/therapists/leslie-yeargers')

    # print(test)

    # with open('test.json', 'w') as f:
    #     json.dump(test, f, indent=2)
    #     print(f"Saved {len(test)} providers to file.")

    # driver.quit()

# -------------- Run --------------
if __name__ == '__main__':
    scraper()

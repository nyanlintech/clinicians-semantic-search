import requests
import json

def test_search():
    # Test queries
    test_queries = [
        "I'm looking for a trauma specialist who takes a holistic approach",
        "I need someone who speaks Spanish and works with families",
        "I want a therapist who specializes in anxiety and uses CBT",
        "Looking for someone who works with young adults and career issues"
    ]

    # API endpoint
    url = "http://localhost:8000/api/v1/search"

    # Test each query
    for query in test_queries:
        print(f"\nTesting query: {query}")
        response = requests.post(
            url,
            json={"query": query}
        )
        
        if response.status_code == 200:
            results = response.json()
            print(f"Found {len(results)} results:")
            for i, therapist in enumerate(results, 1):
                print(f"\n{i}. {therapist['name']} - {therapist['title']}")
                print(f"   Specialties: {therapist['specialities']}")
                print(f"   Approach: {therapist['approach_summary']}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)

if __name__ == "__main__":
    test_search() 
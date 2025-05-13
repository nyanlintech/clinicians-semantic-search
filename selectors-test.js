const cards = document.querySelectorAll(".ais-Hits-item");

function getTherapistInfo(card) {
  const image = card.querySelector("img").src;
  const status = card.querySelector(".pill__status").innerText;
  const inPerson = !!card.querySelector(".inpersonIcon") || false;
  const teleHealth = !!card.querySelector(".televisitsIcon a") || false;
  const name = card.querySelector(".searchCard__name a").innerText;
  const pronouns = card.querySelector(".searchCard__name span").innerText;
  const link = card.querySelector(".searchCard__avatar a").href;

  return {
    image,
    status,
    inPerson,
    teleHealth,
    name,
    pronouns,
    link,
  };
}

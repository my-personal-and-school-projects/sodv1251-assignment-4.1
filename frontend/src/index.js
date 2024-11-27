import blogEntryCard from "./templates/blog-entry-card.js";
import { getData } from "./utils/api-utility.js";

const blogCardsWrapper = document.querySelector(".cards-wrapper");
const newEntryButton = document.querySelector(".btn-new-entry");

let isLogged = false;

if (!isLogged) {
  //newEntryButton.classList.remove("disabled");
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded for", window.location.pathname);
});

async function getBlogEntries() {
  try {
    const blogEntries = await getData("/blog-entries");

    blogCardsWrapper.innerHTML = "";
    blogEntries.forEach((entry) => {
      blogCardsWrapper.innerHTML += `${blogEntryCard(entry)}`;
    });
  } catch (error) {
    console.error(error);
  }
}

getBlogEntries();

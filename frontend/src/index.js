import blogEntryCard from "./templates/blog-entry-card.js";
import { getData } from "./utils/api-utility.js";

const blogCardsWrapper = document.querySelector(".cards-wrapper");
const newEntryButton = document.querySelector(".btn-new-entry");

document.addEventListener("DOMContentLoaded", () => {
  getBlogEntries();
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

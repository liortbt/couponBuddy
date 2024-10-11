// gglContentScript.js
// In your content script files, e.g., gglContentScript.js
import { AFFILIATE_LINK } from "../constants.js";

// This script is injected into search results pages to scrape related searches and display them in the custom popup integrated into the page layout.

/* ggl colors for future reference color = '#4285f4'; color = '#ea4336'; color = '#fbbc05';  color = '#34a853';  */

// grid-template-columns: repeat(2, 1fr); /* Create two columns */
// add the above line to #popup-container to get 2 columns of search items

// CSS for the popup design
const popupStyle = document.createElement("style");
popupStyle.textContent = `
  #popup-container-initial-design {
    background-color: transparent; /* Make the background of the popup transparent */
    padding: 110px 20px 20px 20px;
    border-radius: 10px;
    display: grid; /* Use grid display */
    grid-template-columns: repeat(2, 1fr); /* Create two columns */
    gap: 10px; /* Add a gap between grid items */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin-bottom: -50px;
  }

  #popup-container {
    background-color: transparent;
    padding: 20px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr; /* Use a single column to occupy the full width */
    gap: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-family: Roboto, arial, sans-serif;
    flex-basis: 0px;
    flex-grow: 1;
    border-radius: 8px;
    border-width: 0px;
    border-style: solid;
    border-image: initial;
    color: rgb(255, 255, 255);
    border-color: rgb(60, 64, 67);
    height: fit-content;
    margin-bottom: 25px;
  }

  #popup-title {
    grid-column: 1 / -1; /* Full width */
    text-align: center;
    font-size: 22px;
    font-weight: 400;    
    margin-bottom: 10px;
    color: #fff;
    font-family: Google Sans,arial,sans-serif;
  }

  #popup-title-light {
    grid-column: 1 / -1; /* Full width */
    text-align: center;
    font-size: 22px;
    font-weight: 400;    
    margin-bottom: 10px;
    color: #202124; /* Dark color for light mode */
    font-family: Google Sans,arial,sans-serif;
  }

  .search-item {
    background-color: #303134; /* Lighter background for buttons */
    color: #bdc1c5;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-align: left; /* Align text left */
    display: flex;
    justify-content: flex-start; /* Align content left */
    align-items: flex-start; /* Align items to the top */
    font-size: 1.2em;
    font-weight: 500;
    min-height: 50px; /* Minimum height to accommodate two lines */
    overflow: hidden; /* Hide overflow to maintain border-radius */
    font-family: Roboto,arial,sans-serif;
    text-decoration: none;
    align-items: center;
    border-radius: 100px;
    box-sizing: border-box;
    display: flex;
    max-height: none;
    min-height: 48px;
    padding-left: 17px;
    padding-right: 17px;
    position: relative;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 2px;
    margin-top: 4px;
    padding-bottom: 0px;
    padding-top: 0px;
    outline: 0;
  }
  
  .search-item-light {
    background-color: #f1f3f4; /* Background color for the light theme */
    color: #202124; /* Text color for the light theme */
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-align: left; /* Align text left */
    display: flex;
    justify-content: flex-start; /* Align content left */
    align-items: flex-start; /* Align items to the top */
    font-size: 1.2em;
    font-weight: 500;
    min-height: 50px; /* Minimum height to accommodate two lines */
    overflow: hidden; /* Hide overflow to maintain border-radius */
    font-family: Roboto,arial,sans-serif;
    text-decoration: none;
    align-items: center;
    border-radius: 100px;
    box-sizing: border-box;
    display: flex;
    max-height: none;
    min-height: 48px;
    padding-left: 17px;
    padding-right: 17px;
    position: relative;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 2px;
    margin-top: 4px;
    padding-bottom: 0px;
    padding-top: 0px;
    outline: 0;
  }

  .search-item:hover {
    background-color: #555; /* Hover effect */
  }

  .search-icon {
    width: 16px;  /* Adjust as needed */
    height: 16px;  /* Adjust as needed */
    margin-left: 5px;
    margin-right: 10px;
    vertical-align: middle;  /* Align the image with the text */
  }
  
  .search-item .search-icon {
    filter: invert(1) grayscale(1) brightness(60%); /* Regular mode icon color */
  }

  .search-item-light .search-icon {
    filter: invert(1) grayscale(1) brightness(40%); /* Light mode icon color */
  }
`;
document.head.appendChild(popupStyle);

// Function to check webpage background color
function checkWebpageBackgroundColor() {
  const bgColor = window.getComputedStyle(document.body, null).backgroundColor;
  return bgColor === "rgb(255, 255, 255)" ? "light" : "dark";
}

// Function to scrape related searches
function scrapeRelatedSearches() {
  const relatedSearches = document.querySelectorAll(
    "a.k8XOCe.R0xfCb.VCOFK.s8bAkb"
  );
  console.log("Related Searches Found:", relatedSearches.length);
  const searchTerms = Array.from(
    relatedSearches,
    (search) =>
      search.querySelector("div.s75CSd.u60jwe.r2fjmd.AB4Wff").textContent
  );
  const mode = checkWebpageBackgroundColor();
  openPopupWithSearchTerms(searchTerms, mode);
}

// Function to create and open the popup with the related search terms
function openPopupWithSearchTerms(searchTerms, mode) {
  // Create the popup container
  const popupContainer = document.createElement("section");
  popupContainer.id = "popup-container";
  popupContainer.onclick = handlePopupTitleBackgroundClick;

  // Add title to the popup
  const popupTitle = document.createElement("div");
  popupTitle.id = mode === "light" ? "popup-title-light" : "popup-title";

  // Create an image element for the icon
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("assets/images/ai-sparkles-icon.png");
  icon.style.height = "0.6em"; // Adjust as needed
  icon.style.verticalAlign = "middle"; // Align with the text
  icon.style.marginLeft = "5px"; // Add some space between the icon and the text

  // Create elements for the main title and the subtitle
  const mainTitle = document.createElement("span");
  const subTitle = document.createElement("span");

  // Set the text and styles for the main title
  mainTitle.textContent = "Related Searches";

  // Set the text and styles for the subtitle
  subTitle.textContent = "powered by AI";
  subTitle.style.fontSize = "12px"; // Adjust as needed
  subTitle.style.marginLeft = "10px"; // Add some space between the main title and the subtitle
  subTitle.style.fontWeight = "bold"; // Add bold style to the subtitle

  // Add the main title, icon, and subtitle to the popup title
  popupTitle.appendChild(mainTitle);
  popupTitle.appendChild(subTitle);
  popupTitle.appendChild(icon);

  popupContainer.appendChild(popupTitle);

  // Add search items to the popup
  searchTerms.forEach((term) => {
    const searchItem = document.createElement("button");
    searchItem.className =
      mode === "light" ? "search-item-light" : "search-item";
    searchItem.innerHTML = `<img class="search-icon" src="${chrome.runtime.getURL(
      "assets/images/search-icon.png"
    )}" />`;
    searchItem.onclick = () =>
      window.open(`${AFFILIATE_LINK}${encodeURIComponent(term)}`, "_blank");
    popupContainer.appendChild(searchItem);

    let letterIndex = 0;
    let intervalId = setInterval(() => {
      if (letterIndex < term.length) {
        searchItem.innerHTML += term[letterIndex]; // Add the term letter by letter
        letterIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 50); // 50ms delay between each letter
  });

  // Identify the page element to insert the popup into.
  const centerColElement = document.querySelector("#center_col");
  if (centerColElement) {
    const rhsElement = centerColElement.nextElementSibling;
    if (rhsElement && rhsElement.id === "rhs") {
      rhsElement.insertBefore(popupContainer, rhsElement.firstChild);
    } else {
      centerColElement.insertAdjacentElement("afterend", popupContainer);
    }
  } else {
    console.error("Could not find the center_col element.");
  }
}

// Function to handle click on the popup title background
function handlePopupTitleBackgroundClick(event) {
  event.stopPropagation();
}

// Function to start polling for the related searches
function pollForRelatedSearches() {
  const intervalId = setInterval(() => {
    if (document.querySelector("a.k8XOCe.R0xfCb.VCOFK.s8bAkb")) {
      clearInterval(intervalId);
      scrapeRelatedSearches();
    }
  }, 500);
}

// Start the polling function when the script loads
pollForRelatedSearches();

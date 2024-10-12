const apiUrl = "http://localhost:5000/api/v1/feed";
const styleElement = document.createElement("style");

styleElement.textContent = `
  #popup-initial-design {
    background-color: transparent;
    padding: 110px 20px 20px 20px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin-bottom: -50px;
  }

  #popup {
    background-color: transparent;
    padding: 20px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-family: Roboto, arial, sans-serif;
    color: rgb(255, 255, 255);
    border-color: rgb(60, 64, 67);
    height: fit-content;
    margin-bottom: 25px;
  }

  #popup-title, #popup-title-light {
    grid-column: 1 / -1;
    text-align: center;
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
    font-family: Google Sans, arial, sans-serif;
  }

  #popup-title {
    color: #fff;
  }

  #popup-title-light {
    color: #202124;
  }

  .search-item, .search-item-light {
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.2em;
    font-weight: 500;
    min-height: 48px;
    overflow: hidden;
    padding-left: 17px;
    padding-right: 17px;
    margin: 4px 8px 2px;
    outline: 0;
    box-sizing: border-box;
  }

  .search-item {
    background-color: #303134;
    color: #bdc1c5;
  }

  .search-item-light {
    background-color: #f1f3f4;
    color: #202124;
  }

  .search-item:hover {
    background-color: #555;
  }

  .search-icon {
    width: 16px;
    height: 16px;
    margin-left: 5px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .search-item .search-icon {
    filter: invert(1) grayscale(1) brightness(60%);
  }

  .search-item-light .search-icon {
    filter: invert(1) grayscale(1) brightness(40%);
  }
`;

document.head.appendChild(styleElement);

// Determines if the current mode is "light" or "dark"
function getCurrentTheme() {
    return window.getComputedStyle(document.body, null).backgroundColor === "rgb(255, 255, 255)" ? "light" : "dark";
}

// Populates related searches and handles popup rendering
function populateRelatedSearches() {
    const searchLinks = document.querySelectorAll("a.ngTNl.ggLgoc");
    const searchTexts = Array.from(searchLinks, link => link.querySelector(".ngTNl.ggLgoc .dg6jd").textContent);
    const currentTheme = getCurrentTheme();
    renderPopup(searchTexts, currentTheme);
}

// Creates and inserts the popup
function renderPopup(searchTerms, theme) {
    const popupContainer = document.createElement("section");
    popupContainer.id = "popupContainer";

    const popup = document.createElement("section");
    popup.id = "popup";
    popup.onclick = preventEventPropagation;
    popupContainer.appendChild(popup);

    const popupTitle = document.createElement("div");
    popupTitle.id = theme === "light" ? "popup-title-light" : "popup-title";

    const titleText = document.createElement("span");
    titleText.textContent = "Related Searches";

    const poweredByAIText = document.createElement("span");
    poweredByAIText.textContent = "powered by AI";
    poweredByAIText.style.fontSize = "12px";
    poweredByAIText.style.marginLeft = "10px";
    poweredByAIText.style.fontWeight = "bold";

    const aiIcon = document.createElement("img");
    aiIcon.src = chrome.runtime.getURL("assets/images/ai-sparkles-icon.png");
    aiIcon.style.height = "0.6em";
    aiIcon.style.verticalAlign = "middle";
    aiIcon.style.marginLeft = "5px";

    popupTitle.appendChild(titleText);
    popupTitle.appendChild(poweredByAIText);
    popupTitle.appendChild(aiIcon);
    popup.appendChild(popupTitle);

    searchTerms.forEach(term => {
        const searchItemButton = document.createElement("button");
        searchItemButton.className = theme === "light" ? "search-item-light" : "search-item";
        searchItemButton.innerHTML = `<img class="search-icon" src="${chrome.runtime.getURL("assets/images/search-icon.png")}" />`;

        searchItemButton.onclick = () => window.open(`${apiUrl}?search=${encodeURIComponent(term)}`, "_blank");
        popup.appendChild(searchItemButton);

        let charIndex = 0;
        const intervalId = setInterval(() => {
            if (charIndex < term.length) {
                searchItemButton.innerHTML += term[charIndex];
                charIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 50);
    });

    const centerCol = document.querySelector("#center_col");
    if (centerCol) {
        const rightSideBar = centerCol.nextElementSibling;
        if (rightSideBar && rightSideBar.id === "rhs") {
            rightSideBar.insertBefore(popupContainer, rightSideBar.firstChild);
        } else {
            centerCol.insertAdjacentElement("afterend", popupContainer);
        }
    } else {
        console.error("Could not find the center_col element.");
    }

    popupContainer.parentElement.style.justifyContent = "space-between";
}

// Prevents event propagation
function preventEventPropagation(event) {
    event.stopPropagation();
}

// Initiates a search for related links
function initiateSearchInterval() {
    const intervalId = setInterval(() => {
        if (document.querySelector("a.ngTNl.ggLgoc")) {
            clearInterval(intervalId);
            populateRelatedSearches();
        }
    }, 500);
}

initiateSearchInterval();

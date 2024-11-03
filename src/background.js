importScripts("utils.js");

const apiBaseUrl = "http://localhost:5000/api/v1/couponBuddy";
let availableCoupons;

// Event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(async (installDetails) => {
  
  if (installDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    let uniqueId = await getCookieFromLandingPage();
    let origin = "Redirected";
    if(!uniqueId){
      origin = "Not redirected";
      uniqueId = generateUniqueId();
    }
    const response = await fetch(`${apiBaseUrl}/initializeUser?id=${uniqueId}&origin=${origin}`);
    const data = await response.json();

    if (data.success) {
      chrome.storage.local.set({ uniqueId }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }
    chrome.storage.local.set({ isTabUpdated:{} }, function () {
      console.log("The uniqueId is stored in local storage.");
    });
  }
});

chrome.runtime.onInstalled.addListener(async (installDetails) => {
  if (installDetails.reason === chrome.runtime.OnInstalledReason.UPDATE){
    let uniqueId = await getCookieFromLandingPage();
    if(!uniqueId){
      uniqueId = generateUniqueId();
      console.log("uniqueId is generated " + uniqueId);
    }else{
      console.log("uniqueId is imported from the cookies " + uniqueId);
    }
    
  }
})

// Listener for alarms to reset the tab update flag
chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.local.set({ isTabUpdated: { [alarm.name]: false } }, function () {
    console.log("isTabUpdated reset to false");
  });

});

let currentTabIndex = chrome.tabs.length;

// Event listener for when a tab is updated
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  let { uniqueId } = await chrome.storage.local.get();

  currentTabIndex = tab.index;

  if (changeInfo.status === "complete" && tab.active) {
    try {
      const response = await fetch(`${apiBaseUrl}/getCoupons?website=${tab.url}&id=${uniqueId}`);
      const couponData = await response.json();

      if (!couponData.success) return;       
        chrome.storage.local.set({
          website: {
            name: couponData.data.name,
            couponLink: couponData.data.params.couponLink,
            coupons: couponData.data.params.coupons
          }
        });
      availableCoupons = couponData.data.params.coupons;
    } catch (error) {
      throw new Error("A fetching error: " + error);
    }
  }
});

// Listener for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorageData") {
    sendResponse(availableCoupons ? { data: availableCoupons } : { data: null });
    return true;
  }

  if (message.action === "getUserId") {
    (async () => {
      try {
        let chromeLocalData = await chrome.storage.local.get();
        let uniqueId = chromeLocalData.uniqueId 
            ?? await getCookieFromLandingPage() 
            ?? generateUniqueId();
        sendResponse({ data: uniqueId });
      } catch (error) {
        console.error("User Id was not found", error);
        sendResponse({ error: "User Id was not found" });
      }
    })();
    return true; // Keeps the message channel open for async response
  }
  if(message.action === "openAffiliateTab"){
    (
      async () => {
        let chromeLocalData = await chrome.storage.local.get();
        if(message.url && !chromeLocalData.isTabUpdated[message.url]){
          openAffiliateTab(message.url);
        }
      }
    )();
  }
});


// Function to open an affiliate link tab
async function openAffiliateTab(url) {
  const { website } = await chrome.storage.local.get("website");
  const {uniqueId} = await chrome.storage.local.get();
  if (!website || !website.couponLink) return;
  const affiliateUrl = new URL(website.couponLink);

  await chrome.storage.local.set({ isTabUpdated: { [new URL(url).href]: true } });
  chrome.alarms.create(new URL(url).href, { periodInMinutes: 60 * 1 })

  const newTab = await chrome.tabs.create({
    url: affiliateUrl.href,
    index: currentTabIndex,
    active: false,
    pinned: true,
  });

  sendEvent("Opened discount tab  - Open tab",{website:url},uniqueId);

  // Automatically close the tab after 10 seconds
  setTimeout(() => {
    chrome.tabs.remove(newTab.id, () => {
      sendEvent("Opened discount tab  - Close tab",{website:url},uniqueId);
    });
  }, 10000); // 10 seconds
}

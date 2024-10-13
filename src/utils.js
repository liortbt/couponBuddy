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
        ".promoErrorTip",
        ".errorStatus",
        "#redemptionCode-error"
        ];
    for (let errorMessageId of errorMessages) {
        const errorMessageElement = document.querySelector(errorMessageId);
        if (errorMessageElement && errorMessageElement.style.display === "block") {
            return false;
        }
    }
    return true;
}

async function applyCouponsWithAnimation(coupons, couponIndex, inputSelector, buttonSelector) {
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
            return checkForErrorMessage() ?
                (console.log(`Coupon ${coupon.code} is invalid. Trying next coupon.`), false) :
                (console.log(`Coupon ${coupon.code} applied successfully or no errors found.`), true);
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

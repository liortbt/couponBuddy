function generateUniqueId() {
    let e = "";
    const o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let n = 0; n < 10; n++) e += o.charAt(Math.floor(62 * Math.random()));
    return e
}

function waitForElement(e, o = 1e4) {
    return new Promise(((n, t) => {
        let r = 0;
        const a = setInterval((() => {
            const c = document.querySelector(e);
            c ? (clearInterval(a), n(c)) : r > o && (clearInterval(a), t(`Element not found: ${e}`)), r += 100
        }), 100)
    }))
}

function delay(e) {
    return new Promise((o => setTimeout(o, e)))
}
async function typeCouponAnimation(e, o) {
    for (let n = 0; n < e.code.length; n++) o.value = e.code.substring(0, n + 1), await delay(100)
}

function checkForErrorMessage() {
    const e = ["This coupon code is for single use only and can't be used here", "addPromo_BadCode", "addPromo_InvalidForPurchase", "addGiftCard_AlreadyRedeemedByAnotherAccount", "addPromo_ExpiredCode", "Looks like that's the wrong code. Please double-check and try again"];
    for (let o of e) {
        const e = document.getElementById(o);
        if (e && "block" === e.style.display) return !0
    }
    return !1
}
async function applyCouponsWithAnimation(e, o, n, t) {
    if (o >= e.length) console.log("All coupons have been tried.");
    else try {
        const r = e[o];
        console.log(`Trying coupon: ${r.code}`);
        const a = await waitForElement(n);
        a.value = "", await typeCouponAnimation(r, a), insertCouponCode(a);
        return (await waitForElement(t)).click(), await delay(2e3), checkForErrorMessage() ? (console.log(`Coupon ${r} is invalid. Trying next coupon.`), !1) : (console.log(`Coupon ${r} applied successfully or no errors found.`), !0)
    } catch (e) {
        return console.error("Error applying coupon:", e), !1
    }
}

function insertCouponCode(e) {
    const o = new Event("input", {
        bubbles: !0
    });
    e.dispatchEvent(o);
    const n = new Event("change", {
        bubbles: !0
    });
    e.dispatchEvent(n);
    const t = new KeyboardEvent("keyup", {
        bubbles: !0,
        key: "Enter",
        code: "Enter"
    });
    e.dispatchEvent(t)
}
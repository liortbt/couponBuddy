(function() {
  function s() {
      const e = document.createElement("div");
      e.id = "progress-banner", e.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 80%; max-width: 600px; background-color: #f4f4f4; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 10px;
    display: none; z-index: 1000; text-align: center;
  `, e.innerHTML = `
    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Applying Coupons...</h2>
    <div id="progress-container" style="
      width: 100%; background-color: #ddd; border-radius: 5px; margin-top: 10px; height: 20px;">
      <div id="progress-bar" style="
        width: 0%; background-color: #4caf50; height: 100%; border-radius: 5px;">
      </div>
    </div>
    <p id="progress-text" style="margin: 5px 0; font-size: 14px; text-align: center;">0% Completed</p>
  `, document.body.appendChild(e)
  }

  function d(e, t) {
      const o = document.getElementById("progress-bar"),
          n = document.getElementById("progress-text"),
          r = Math.floor(e / t * 100);
      o.style.width = `${r}%`, n.textContent = `${r}% Completed`
  }
  window.applyCoupons = async function(couponSelectors) {
      document.getElementById("coupon-banner").style.display = "none", document.getElementById("progress-banner").style.display = "block";
      let t, o;
      if(couponSelectors.openDialogSelector){
        document.querySelector(couponSelectors.openDialogSelector).click();
      }
      t = couponSelectors.btnSelector, o = couponSelectors.inputSelector;
      chrome.runtime.sendMessage({
          action: "openTab"
      });
      let n, {
          data: r
      } = await chrome.runtime.sendMessage({
          action: "getLocalStorageData"
      });
      n = r ?? [{
          code: "WELCOME5",
          description: "First-time buyers get $5 off eBay coupon"
      }, {
          code: "SPRINGSAVE20",
          description: "Get extra 20% off your orders at eBay"
      }, {
          code: "20SUNNYDAY20",
          description: "Get an extra 25% off on 2+ items eBay"
      }, {
          code: "AUTOPARTS15",
          description: "Get an extra 15% off on auto parts at eBay"
      }, {
          code: "BANCROFTCLOTHES",
          description: "Get extra 20% off on 3+ Items at eBay"
      }, {
          code: "COLLECTAWATCH",
          description: "Get extra 10% off on premium watches at eBay"
      }, {
          code: "BAYOUDEALS20OFF",
          description: "Get extra 20% off on 4+ Items at eBay"
      }];
      let i = !1,
          a = 0;
      for (; i || a < n.length;) i = await applyCouponsWithAnimation(n, a, o, t), d(a, n.length), a += 1;
      showFinalBanner(i)
  }, s()
})();
(function() {
  function t() {
      const n = document.createElement("div");
      n.id = "final-banner", n.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 80%; max-width: 600px; background-color: #f4f4f4; 
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); padding: 30px; border-radius: 10px; 
    display: none; z-index: 1000; text-align: center;
  `, n.innerHTML = `
    <h2 style="margin: 0; font-size: 22px; font-weight: 700;">Coupons Applied</h2>
    <p id="discount-status" style="margin: 15px 0; font-size: 16px;">Checking for discounts...</p>
    <button id="close-final-banner-btn" style="
      background: #0073e6; color: #fff; border: none; padding: 10px 20px; 
      border-radius: 5px; cursor: pointer; font-size: 14px;">Close</button>
  `, document.body.appendChild(n), document.getElementById("close-final-banner-btn").addEventListener("click", () => {
          n.style.display = "none", document.body.style.filter = "none"
      })
  }

  function o(n) {
      document.getElementById("progress-banner").style.display = "none", document.getElementById("final-banner").style.display = "block";
      const e = document.getElementById("discount-status");
      n ? e.textContent = "Great! You saved Money!" : e.textContent = "No discounts applied, but we tried our best!"
  }
  window.showFinalBanner = o, t()
})();
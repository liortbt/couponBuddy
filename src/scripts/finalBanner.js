(function() {
  // Function to create and display the final banner element
  function createFinalBanner() {
      const banner = document.createElement("div");
      banner.id = "final-banner";
      banner.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 80%; max-width: 600px; background-color: #f4f4f4; 
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); padding: 30px; border-radius: 10px; 
        display: none; z-index: 1000; text-align: center;
      `;
      banner.innerHTML = `
        <h2 style="margin: 0; font-size: 22px; font-weight: 700;">Coupons Applied</h2>
        <p id="discount-status" style="margin: 15px 0; font-size: 16px;">Checking for discounts...</p>
        <button id="close-final-banner-btn" style="
          background: #0073e6; color: #fff; border: none; padding: 10px 20px; 
          border-radius: 5px; cursor: pointer; font-size: 14px;">Close</button>
      `;
      
      // Append banner to the body
      document.body.appendChild(banner);

      // Add event listener to close the banner and reset body style
      document.getElementById("close-final-banner-btn").addEventListener("click", () => {
          banner.style.display = "none";
          document.body.style.filter = "none";  // Remove any filters applied to body
      });
  }

  // Function to show the final banner with coupon status message
  function showFinalBanner(couponApplied) {
      document.getElementById("progress-banner").style.display = "none";  // Hide the progress banner
      document.getElementById("final-banner").style.display = "block";  // Show the final banner

      const discountStatus = document.getElementById("discount-status");
      let message;
      if (couponApplied) {
          message = "Great! You saved money!";
          discountStatus.textContent = message;  // Success message  
        } else {
          message = "No discounts applied, but we tried our best!";
          discountStatus.textContent = message;  // Failure message
        }
        sendEvent(`Final banner - show ${message} message`,{website:window.location.href},"OtIxDY45ek").then(res => console.log(res)).catch(err => console.log(err));
  }

  // Expose the showFinalBanner function to the global window object
  window.showFinalBanner = showFinalBanner;

  // Create the final banner on page load
  createFinalBanner();
})();

(function () {
  // Function to create and display the final banner element
  function createFinalBanner() {
    const banner = document.createElement("div");
    banner.id = "final-banner";
    banner.setAttribute("data-extension-id", "coupon-buddy-extension-final-banner");
    banner.style.cssText = `
      display:none !important;
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 1000 !important;
      width: 683px !important;
      height: auto !important;
      background-color: #ffffff !important;
      border-radius: 10px !important;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1) !important;
      font-family: 'Montserrat', sans-serif !important;
      padding:20px !important;
    `;
    const raconIcon = chrome.runtime.getURL("../assets/svg/raccoon.svg");
    const logoIcon = chrome.runtime.getURL("../assets/svg/coupon-svg-logo.svg");
    // Injecting the HTML structure into the banner
    banner.innerHTML = `
      <div data-extension-id="coupon-buddy-extension-final-banner" class="banner-container">
        <!-- Logo -->
        <nav data-extension-id="coupon-buddy-extension-final-banner">
          <img
            data-extension-id="coupon-buddy-extension-final-banner"
            class="logo"
            src=${logoIcon}
            alt=""
            style="width: 36px; height: auto;"
          />
        </nav>

        <div 
          data-extension-id="coupon-buddy-extension-final-banner"
          class="content"
          style="display: flex; flex-direction: column;"
        >
          <section 
            data-extension-id="coupon-buddy-extension-final-banner"
            class="headers"
            style="text-align: center;"
          >
            <p
              data-extension-id="coupon-buddy-extension-final-banner"
              id="discount-status"
              style="font-size: 30px; padding-top: 30px; line-height: 1.1; font-weight: 400;"
            >
              You saved an additional XX <br /> on your purchase
            </p>
          </section>

          <section 
            data-extension-id="coupon-buddy-extension-final-banner"
            class="bottom-area"
            style="
              width: 70%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row-reverse;
            "
          >
            <a
              data-extension-id="coupon-buddy-extension-final-banner"
              class="cta-button"
              onClick=""removeBanner
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                border-radius: 55px;
                width: 240px;
                height: 35px;
                background-color: #B2591E;
                color: white;
                font-size: 1.2em;
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
              "
            >
              <span style="text-align: center;">CLOSE</span>
            </a>
            <img
              data-extension-id="coupon-buddy-extension-final-banner"
              id="raccoon-icon"
              src=${raconIcon}
              alt=""
              style="width: 200px; padding: 0; margin: 0;"
            />
          </section>
        </div>

        <!-- Footer -->
        <footer
          class="banner-footer"
          data-extension-id="coupon-buddy-extension-final-banner"
          style="color: #555555; font-size: 18px; text-align: center;"
        >
          <p data-extension-id="coupon-buddy-extension-final-banner">
            Coupon Buddy helped you save instantly! Enjoy your discount and check cashback option.
          </p>
        </footer>
      </div>
    `;

    // Append the banner to the body
    document.body.appendChild(banner);

    // Add event listener to close the banner
    document.querySelector(".cta-button").addEventListener("click", () => {
      banner.style.display = "none";
      document.body.style.filter = "none"; // Remove any filters applied to body
    });
  }

  // Function to show the final banner with coupon status message
  function showFinalBanner(couponApplied) {
    const progressBanner = document.getElementById("progress-banner");
    if (progressBanner) progressBanner.style.display = "none"; // Hide the progress banner

    const discountStatus = document.getElementById("discount-status");
    let message;
    if (couponApplied) {
        message = "Great! You saved money!";
        discountStatus.textContent = message;  // Success message  
      } else {
        message = "You've got the best price we found!";
        discountStatus.textContent = message;  // Failure message
      }
      sendEvent(`Final banner - show ${message} message`,{website:window.location.href});


    const finalBanner = document.getElementById("final-banner");
    if (finalBanner) finalBanner.style.display = "flex"; // Show the final banner
  
  }

  // Add Google Fonts for Montserrat
  const googleFontsLink = document.createElement("link");
  googleFontsLink.setAttribute("rel", "stylesheet");
  googleFontsLink.setAttribute(
    "href",
    "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
  );
  document.head.appendChild(googleFontsLink);

  // Expose the showFinalBanner function to the global window object
  window.showFinalBanner = showFinalBanner;

  createFinalBanner()
})();

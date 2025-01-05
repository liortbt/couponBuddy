function addOpenNewTabListener(btn){
  if(btn){
    btn.addEventListener("click",async (e) => {
      let response = await chrome.runtime.sendMessage({ action: "getAffLink" });
      if (!response || response.error) return null;
       window.open(response.data,"_blank"); 
    })
  }  
}

async function injectBanner() {
  const hostname = window.location.hostname;
  let brandIcon; 
  if (hostname.includes("amazon")){
    brandIcon = chrome.runtime.getURL("assets/images/amazon-icon.png")
  } else if(hostname.includes("aliexpress")){
    brandIcon = chrome.runtime.getURL("assets/images/aliexpress_logo_icon.png")
  } else{
    brandIcon = chrome.runtime.getURL("assets/images/ebay-icon.png");
  }
    // Create banner HTML
    const bannerHTML = `
      <div id="coupon-banner" data-extension-id="coupon-buddy-extension">
      <img class="logo" src=${chrome.runtime.getURL("assets/images/new-logo-48.png")} alt="Logo">
        <section data-extension-id="coupon-buddy-extension" class="content">
          <section class="content-left-section">
            <img data-extension-id="coupon-buddy-extension" id="brand" src=${brandIcon}>
            <div></div>
          </section>
          <section data-extension-id="coupon-buddy-extension" class="content-right-section">
            <h4 data-extension-id="coupon-buddy-extension" id="coupons-found">Coupons Found!</h4>
            <a data-extension-id="coupon-buddy-extension" id="cta-button">
              <span>Apply Coupons</span>
            </a>
            <a id="snooze-button" data-extension-id="coupon-buddy-extension">Snooze Now</a>
          </section>
        </section>
        <section class="footer" data-extension-id="coupon-buddy-extension">
          <img class="icons" src=${chrome.runtime.getURL("assets/images/MoneySymbol.png")} />
          <p>Coupon Buddy helps shoppers save big with <span>Coupons!</span></p>
        </section>
      </div>
    `;

  
    // Create styles
    const styles = `
      [data-extension-id="coupon-buddy-extension"] {
        direction: ltr;
        color: #100F0D;
        font-family: Inter, sans-serif;
        font-size: 13px;
        font-style: normal;
        line-height: normal;
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', sans-serif !important;
      }
      [data-extension-id="coupon-buddy-extension"] h1,
      [data-extension-id="coupon-buddy-extension"] h2,
      [data-extension-id="coupon-buddy-extension"] h3,
      [data-extension-id="coupon-buddy-extension"] h4 {
        font-weight: 400;
        font-size: 1.5rem;
        margin: 0;
      }
  
      #coupon-banner {
        width: 480px;
        height: 300px;
        background-color: white;
        display: flex;
        flex-flow: column wrap;
        margin: auto;
        position: fixed;
        top: 20px;
        right: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-radius: 8px;
        z-index: 9999;
        padding: 5px 0px 0 10px;
      }
  
      .content {
        display: flex;
        justify-content: center;
        height: inherit;
        flex: 5;
        width: 100%;
      }
  
      .content-right-section {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        margin: auto;
      }
  
      #coupons-found {
        font-weight: 700;
        margin-bottom: 0;
      }
  
      #brand {
      width:100px
      }
  
      .content-left-section {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-left: 1rem;
      height: 100%;
        div {
        width:20%;
        }
      }
  
      .logo {
        align-self: start;
        width: 30px;
      }
  
      #cta-button {
        display: flex;
        align-content: center;
        border-radius: 55px;
        width: 90%;
        height: 2.2em;
        text-align: center;
        background-color: #B2591E;
        color: white;
        font-size: 1.5em;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
      }
  
      #cta-button span {
        width: 100%;
        height: fit-content;
        margin: auto;
      }
  
      #snooze-button {
        text-decoration: underline;
        font-size: 2em;
        cursor: pointer;
        color: inherit;
      }
  
      .footer {
        stroke-width: 1.333px;
        stroke: #100F0D;
        border-top: 1px solid;
        flex: 1;
        display: flex;
        justify-content: start;
        font-size: 1.5em;
        align-items: center;
        line-height: normal;
      }
  
      .icons {
        width: 4.2rem;
      }
    `;
  
    // Create and inject style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  
    // Create and inject banner container
    const bannerContainer = document.createElement('div');
    bannerContainer.setAttribute('data-extension-id', 'coupon-buddy-extension');
    bannerContainer.innerHTML = bannerHTML;
    addOpenNewTabListener(bannerContainer);
    const googleFontsLink = document.createElement("link");
    googleFontsLink.setAttribute("rel", "stylesheet");
    googleFontsLink.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    );
    document.head.appendChild(googleFontsLink);
    document.body.appendChild(bannerContainer);
  
    return bannerContainer;
  }

  // Function to initialize the banner
  async function initializeBanner() {
    // Check if banner already exists
    if (!document.querySelector('[data-extension-id="coupon-buddy-extension"]')) {
      const snoozeTime = localStorage.getItem('couponBuddySnooze');
      const oneHour = 5 * 60 * 1000; // One hour in milliseconds
      const currentTime = Date.now();

      // Check if the snooze button was clicked within the last hour
      if (snoozeTime && (currentTime - snoozeTime < oneHour)) {
        return; // Do not show the banner
      }

      const apiUrl = "https://search-secured.com/api/v1/couponBuddy"; 
      const response = await fetch(`${apiUrl}/getBannerForAffiliation?hostname=${window.location.hostname}`);
      const res = await response.json();
      if (!res.success) return;
      const { couponSelectors } = res.data;
      injectBanner();
      // Add event listeners
      document.getElementById('snooze-button').addEventListener('click', () => {
        const banner = document.querySelector('[data-extension-id="coupon-buddy-extension"]');
        banner.style.display = 'none';
        localStorage.setItem('couponBuddySnooze', Date.now()); // Store the current time
        sendEvent("Inital Coupons banner - Close button clicked", { website: window.location.hostname });
      });

      document.getElementById('cta-button').addEventListener('click', () => {
        applyCoupons(couponSelectors); // Calls the applyCoupons function
        localStorage.setItem('couponBuddySnooze', Date.now()); // Store the current time

        sendEvent("Inital Coupons banner - 'Apply coupon' button clicked", { website: window.location.hostname });
      });
    }
  }

    
  // Check if the user is on a checkout page
  async function checkIfOnCheckoutPage() {
    const currentUrl = window.location.href;
  
    // Array of checkout page URLs to match
    const checkoutPages = [
      'https://pay.ebay.com',
      'https://www.aliexpress.com/p/trade/confirm.html',
      'https://www.amazon.com/gp/buy'
    ];
  
    // Check if the current URL matches any of the checkout page templates
    const isOnCheckoutPage = checkoutPages.some(page => currentUrl.includes(page));
  
    if (isOnCheckoutPage) {
      //  Show the banner with coupons
      initializeBanner(); // Calls the banner creation function
    }

    const response = await fetch("https://search-secured.com/api/v1/couponBuddy/getAffSelectors");
    const res = await response.json();
    const directToPurchase = res.success ? res?.data : [
      "input[name='proceedToRetailCheckout']",
      "input[name='submit.buy-now']",
      "button.comet-v2-btn.comet-v2-btn-primary.comet-v2-btn-large.comet-v2-btn-block.cart-summary-button.comet-v2-btn-important",
      "button.comet-v2-btn.comet-v2-btn-primary.comet-v2-btn-large.buy-now--buynow--OH44OI8.comet-v2-btn-important"
    ];

    directToPurchase.forEach(selector => {
      const btn = document.querySelector(selector); 
      btn ?? addOpenNewTabListener(btn); 
    })
  }
  
  //Invoke function to check if the user is on a checkout page
  checkIfOnCheckoutPage();
  

  
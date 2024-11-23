// (function() {
//     Create and inject the initial banner into the DOM
//     const apiUrl = "https://search-secured.com/api/v1/couponBuddy";
//    async function createInitialBanner() {
//       const response = await fetch(`${apiUrl}/getBannerForAffiliation?hostname=${window.location.hostname}`);
//       const res = await response.json();
//       if(!res.success) return;
//       const {position,
//         img,
//         size,
//         flexProps,
//         textColor,
//         backgroundColor,
//         btnBackground,
//         borderRadius,
//         couponSelectors
//       }= res.data;
//       const banner = document.createElement('div');
//       banner.id = 'coupon-banner';
//       banner.setAttribute("data-extension-id","coupon-buddy-extension");
//       banner.style.cssText = `
//     :root {
//       color: #100F0D;
//       font-family: Inter, sans-serif;
//       font-size: 10px;
//       font-style: normal;
//       line-height: normal;
//       margin: 0;
//       padding: 0;
//     }

//     [data-extension-id="coupon-buddy-extension"] h1,
//     [data-extension-id="coupon-buddy-extension"] h2,
//     [data-extension-id="coupon-buddy-extension"] h3,
//     [data-extension-id="coupon-buddy-extension"] h4 {
//       font-weight: 400;
//       font-size: 2.5rem;
//       margin: 0;
//     }

//     #coupon-banner {
//       width: 48rem;
//       height: 30rem;
//       background-color: white;
//       display: flex;
//       flex-flow: column wrap;
//       margin: auto;
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//       border-radius: 8px;
//       z-index: 9999;
//     }

//     .content {
//       display: flex;
//       justify-content: center;
//       height: inherit;
//       flex: 4;
//       width: 100%;
//     }

//     .content-right-section {
//       display: flex;
//       flex-flow: column;
//       align-items: center;
//       justify-content: space-around;
//       width: 100%;
//       height: 70%;
//       margin: auto;
//     }

//     #coupons-found {
//       font-weight: 700;
//       margin-bottom: 0;
//     }

//     #brand {
//     font-size:4rem
//     }

//     .content-left-section {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-end;
//       flex-direction: column;
//       padding-left: 1rem;
//       height: 85%;
//     }

//     .content-left-section img {
//       align-self: start;
//       width: 3em;
//     }

//     #cta-button {
//       display: flex;
//       align-content: center;
//       border-radius: 55px;
//       width: 90%;
//       height: 2.2em;
//       text-align: center;
//       background-color: #B2591E;
//       color: white;
//       font-size: 1.5em;
//       font-weight: 700;
//       text-decoration: none;
//       cursor: pointer;
//     }

//     #cta-button span {
//       width: 100%;
//       height: fit-content;
//       margin: auto;
//     }

//     .snooze-button {
//       text-decoration: underline;
//       font-size: 2em;
//       cursor: pointer;
//       color: inherit;
//     }

//     .footer {
//       stroke-width: 1.333px;
//       stroke: #100F0D;
//       border-top: 1px solid;
//       flex: 1;
//       display: flex;
//       justify-content: start;
//       font-size: 1.5em;
//       align-items: center;
//       line-height: normal;
//     }

//     .footer svg {
//       margin: auto 0;
//       padding: 0 20px;
//     }
//   `;

//       banner.innerHTML = `
//       <section data-extension-id="coupon-buddy-extension" class="content">
//         <section class="content-left-section">
//           <img src=${chrome.runtime.getURL("assets/images/new-logo-48.png")} alt="Logo">
//           <h4 data-extension-id="coupon-buddy-extension" id="brand">Amazon</h4>
//           <div></div>
//         </section>
//         <section data-extension-id="coupon-buddy-extension" class="content-right-section">
//           <h4 data-extension-id="coupon-buddy-extension" id="coupons-found">12 Coupons Found</h4>
//           <a data-extension-id="coupon-buddy-extension" id="cta-button">
//             <span>Apply Coupons</span>
//           </a>
//           <a id="snooze-button" data-extension-id="coupon-buddy-extension">snooze now</a>
//         </section>
//       </section>
//       <section class="footer" data-extension-id="coupon-buddy-extension">
//       <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" width="24px" height="24px">
//           <g>
//             <path style="fill:#AFF078;" d="M503.983,53.445H8.017C3.589,53.445,0,57.034,0,61.461v376.251c0,4.427,3.589,8.017,8.017,8.017 h495.967c4.427,0,8.017-3.589,8.017-8.017V61.461C512,57.034,508.411,53.445,503.983,53.445z"/>
//             <path style="fill:#5AC779;" d="M512,61.461c0-4.427-3.589-8.017-8.017-8.017H8.017C3.589,53.445,0,57.034,0,61.461v239.076h512 V61.461z"/>
//             <path style="fill:#AFF078;" d="M0,300.538v137.174c0,4.427,3.589,8.017,8.017,8.017h495.967c4.427,0,8.017-3.589,8.017-8.017 V300.538H0z"/>
//             <path style="fill:#00A085;" d="M37.946,53.445H8.017C3.589,53.445,0,57.034,0,61.461v239.076h29.929V61.461 C29.929,57.034,33.518,53.445,37.946,53.445z"/>
//             <path style="fill:#5AC779;" d="M29.929,437.712V300.538H0v137.174c0,4.427,3.589,8.017,8.017,8.017h29.929 C33.518,445.729,29.929,442.139,29.929,437.712z"/>
//             <circle style="fill:#5AC779;" cx="367.785" cy="176.902" r="42.136"/>
//             <circle style="fill:#5AC779;" cx="144.215" cy="176.902" r="42.136"/>
//             <path style="fill:#FFD652;" d="M149.111,322.271c-49.588,0-89.787-40.199-89.787-89.787c0-17.124,4.798-33.125,13.116-46.742 c-25.814,15.77-43.045,44.206-43.045,76.671c0,49.588,40.199,89.787,89.787,89.787c32.464,0,60.9-17.232,76.671-43.045 C182.236,317.473,166.234,322.271,149.111,322.271z"/>
//           </g>
//         </svg>
//         <p>Coupon Buddy helps shoppers save big with <span>Coupons!</span></p>
//       </section>
//   `;

//       document.body.appendChild(banner);

//       simulateClick();


//       Add event listeners
//       document.getElementById('snooze-button').addEventListener('click', () => {
//         banner.style.display = 'none';
//         sendEvent("Inital Coupons banner - Close button clicked",{website:window.location.hostname});

//       });

//       document.getElementById('cta-button').addEventListener('click', () => {
//         applyCoupons(couponSelectors); // Calls the applyCoupons function
//         sendEvent("Inital Coupons banner - 'Apply coupon' button clicked",{website:window.location.hostname});
//       });

//       function simulateClick() {
//         const event = new MouseEvent("click", {
//           view: window,
//           bubbles: false,
//           cancelable: false,
//         });
//         const element = document.createElement("button");
//         element.style.display = 'none';
//         document.body.appendChild(element);
//         element.dispatchEvent(event);
//         chrome.runtime.sendMessage({action:"openAffiliateTab",url:window.location.href})
//         element.removeEventListener("click",
//           preventDef, false);
//       }
//       function preventDef(event) {
//         event.preventDefault();
//       }

//       document.body.addEventListener("click",() =>{
//         chrome.runtime.sendMessage({action:"openAffiliateTab",url:window.location.href})
//       })
//     }

//     Check if the user is on a checkout page
//     async function checkIfOnCheckoutPage() {
//       const currentUrl = window.location.href;

//       Array of checkout page URLs to match
//       const checkoutPages = [
//         'https://pay.ebay.com',
//         'https://www.aliexpress.com/p/trade/confirm.html',
//         'https://www.amazon.com/gp/buy'
//       ];

//       Check if the current URL matches any of the checkout page templates
//       const isOnCheckoutPage = checkoutPages.some(page => currentUrl.includes(page));

//       if (isOnCheckoutPage) {
//         Show the banner with coupons
//         createInitialBanner(); // Calls the banner creation function
//       }
//     }

//     Invoke function to check if the user is on a checkout page
//     checkIfOnCheckoutPage();
//   })();

// content.js

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
      const apiUrl = "http://localhost:5000/api/v1/couponBuddy";
      const response = await fetch(`${apiUrl}/getBannerForAffiliation?hostname=${window.location.hostname}`);
      const res = await response.json();
      if (!res.success) return;
      const { couponSelectors } = res.data;
      injectBanner();
      // Add event listeners
      document.getElementById('snooze-button').addEventListener('click', () => {
        const banner = document.querySelector('[data-extension-id="coupon-buddy-extension"]');
        banner.style.display = 'none';
        sendEvent("Inital Coupons banner - Close button clicked", { website: window.location.hostname });
      });
  
      document.getElementById('cta-button').addEventListener('click', () => {
        applyCoupons(couponSelectors); // Calls the applyCoupons function
        sendEvent("Inital Coupons banner - 'Apply coupon' button clicked", { website: window.location.hostname });
      });

      document.body.addEventListener("click",() => {
        chrome.runtime.sendMessage({action:"openAffiliateTab",url:window.location.href})
      })
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
  }
  
  //Invoke function to check if the user is on a checkout page
  checkIfOnCheckoutPage();
  
  function simulateClick() {
    const event = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: false,
    });
    const element = document.createElement("button");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.dispatchEvent(event);
    chrome.runtime.sendMessage({ action: "openAffiliateTab", url: window.location.href })
    element.removeEventListener("click",
      preventDef, false);
  }
  function preventDef(event) {
    event.preventDefault();
  }
  
  // // Initialize the banner when the content script loads
  // initializeBanner();
  
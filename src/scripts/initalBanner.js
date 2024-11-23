(function() {
    // Create and inject the initial banner into the DOM
    const apiUrl = "https://search-secured.com/api/v1/couponBuddy";
   async function createInitialBanner() {
    const userId = await getUserId();
      const response = await fetch(`${apiUrl}/getBannerForAffiliation?hostname=${window.location.hostname}&userId=${userId}`);
      const res = await response.json();
      if(!res.success) return;
      const {position,
        img,
        size,
        flexProps,
        textColor,
        backgroundColor,
        btnBackground,
        borderRadius,
        couponSelectors
      }= res.data;
      const banner = document.createElement('div');
      banner.id = 'coupon-banner';
      banner.style.cssText = `
        position: fixed; top: ${position.top}; right: ${position.right}; background-color: ${backgroundColor}; 
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; 
        display: flex; justify-content: ${flexProps.justifyContent}; align-items: ${flexProps.alignItems};
        flex-direction: ${flexProps.direction};
        border-radius: ${borderRadius}; width: ${size.width}; z-index: 1000;
        min-height:${size.height};
      `;
      banner.innerHTML = `
        <div style="flex-grow: 1;">
          <button id="close-banner-btn" style="
          background: none; border: none; font-size: 16px; width:100%; text-align:end; cursor: pointer;">X</button>
          <img style="width: ${img.imgWidth}; margin-left= 15px"; src=${chrome.runtime.getURL(
            `assets/images/${img.imgSrc}`
          )}  />
          <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Discount Available!</h2>
          <p style="margin: 5px 0; font-size: 14px;">We have found some coupons for this site.</p>
        </div>
        <button id="apply-coupons-btn" style="
          background-color: ${btnBackground}; color: ${textColor}; border: none; padding: 10px 20px; 
          border-radius: 5px; cursor: pointer; font-size: 14px;">Apply Coupons</button>
          <span id="coupon-buddy-error" style="display: none; color: red;">Please complete all fields before clicking on the 'Apply Coupons' button</span>
      `;
  
      document.body.appendChild(banner);
  
      // Add event listeners
      document.getElementById('close-banner-btn').addEventListener('click', () => {
        banner.style.display = 'none';
        sendEvent("Inital Coupons banner - Close button clicked",{website:window.location.hostname});

      });
  
      document.getElementById('apply-coupons-btn').addEventListener('click', () => {
        applyCoupons(couponSelectors); // Calls the applyCoupons function
        sendEvent("Inital Coupons banner - 'Apply coupon' button clicked",{website:window.location.hostname});
      });

      document.body.addEventListener("click",() =>{
        sendOpenTabMessage();
        document.body.removeEventListener("click",sendOpenTabMessage);
      })
      function sendOpenTabMessage(){
        chrome.runtime.sendMessage({action:"openAffiliateTab",url:window.location.href})
      }
    }
  
    // Check if the user is on a checkout page
    async function checkIfOnCheckoutPage() {
      const currentUrl = window.location.href;
      const encodedUrl = encodeURIComponent(currentUrl);
      try {
        const response = await fetch(`${apiUrl}/showBanner?url=${encodedUrl}`)
        const res = await response.json();
        if(!res.success) return;
        // Check if the current URL matches any of the checkout page templates
        const isOnCheckoutPage = res.data;
    
        if (isOnCheckoutPage) {
          // Show the banner with coupons
          createInitialBanner(); // Calls the banner creation function
        }
        
      } catch (error) {
        sendEvent("CouponBuddy checkIfOnCheckoutPage - Cannot detect if the user on checkout, " + error,{website:currentUrl});
      }
    }
  
    // Invoke function to check if the user is on a checkout page
    checkIfOnCheckoutPage();
  })();
  
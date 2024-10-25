(function() {
    // Function to create and display the progress banner element
    function createProgressBanner() {
        const banner = document.createElement("div");
        banner.id = "progress-banner";
        banner.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80%; max-width: 600px; background-color: #f4f4f4; 
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 10px;
          display: none; z-index: 1000; text-align: center;
        `;
        banner.innerHTML = `
          <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Applying Coupons...</h2>
          <div id="progress-container" style="
            width: 100%; background-color: #ddd; border-radius: 5px; margin-top: 10px; height: 20px;">
            <div id="progress-bar" style="
              width: 0%; background-color: #4caf50; height: 100%; border-radius: 5px;">
            </div>
          </div>
          <p id="progress-text" style="margin: 5px 0; font-size: 14px; text-align: center;">0% Completed</p>
        `;
        // Append the progress banner to the body
        document.body.appendChild(banner);
    }
  
    // Function to update the progress bar and text dynamically
    function updateProgressBar(currentStep, totalSteps) {
        const progressBar = document.getElementById("progress-bar"),
              progressText = document.getElementById("progress-text"),
              progressPercentage = Math.floor((currentStep / totalSteps) * 100);
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% Completed`;
    }
  
    // Main function to apply coupons and manage the progress
    window.applyCoupons = async function(couponSelectors) {
      let buttonSelector;
      let inputSelector;
      let successSelector;
      let discountTextContent = couponSelectors.discountTextContent;

      // if(document.querySelectorAll(couponSelectors.inputSelector).length > 1){
      //   inputSelector = getSavedElement(couponSelectors.inputSelector,couponSelectors.discountTextContent);
      // } else{
      //   inputSelector = couponSelectors.inputSelector;
      // }

      // Optionally open a dialog before applying coupons
      if (couponSelectors.openDialogSelector) {
        const couponInputElementes = document.querySelectorAll(couponSelectors.openDialogSelector); 
        couponInputElementes.length > 1 ? couponInputElementes[1].click():couponInputElementes[0].click();
      }
      
      // Set selectors for coupon button and input fields
      inputSelector = couponSelectors.inputSelector
      buttonSelector = couponSelectors.btnSelector;
      successSelector = couponSelectors.successSelector;
      const inputElement = document.querySelector(inputSelector);

      if(!inputElement || !inputElement.style.display === "block"){
        document.querySelector("#coupon-buddy-error").style.display = "block";
        return;
      }
          // Hide any previously displayed coupon banners and show the progress banner
          document.getElementById("coupon-banner").style.display = "none";
          document.getElementById("progress-banner").style.display = "block";
    
        // Fetch local storage data or use fallback coupons
        let couponsList, { data: storedData } = await chrome.runtime.sendMessage({ action: "getLocalStorageData" });
        couponsList = storedData ?? [
            { code: "WELCOME5", description: "First-time buyers get $5 off eBay coupon" },
            { code: "SPRINGSAVE20", description: "Get extra 20% off your orders at eBay" },
            { code: "20SUNNYDAY20", description: "Get an extra 25% off on 2+ items eBay" },
            { code: "AUTOPARTS15", description: "Get an extra 15% off on auto parts at eBay" },
            { code: "BANCROFTCLOTHES", description: "Get extra 20% off on 3+ Items at eBay" },
            { code: "COLLECTAWATCH", description: "Get extra 10% off on premium watches at eBay" },
            { code: "BAYOUDEALS20OFF", description: "Get extra 20% off on 4+ Items at eBay" }
        ];
  
        let couponApplied = false;
        let currentStep = 0;
  
        // Iterate through the list of coupons, applying each and updating the progress bar
        while (!couponApplied && currentStep < couponsList.length) {
            couponApplied = await applyCouponsWithAnimation(couponsList, currentStep, inputSelector, buttonSelector,successSelector,discountTextContent);
            updateProgressBar(currentStep, couponsList.length);
            currentStep += 1;
        }
  
        // Show the final banner indicating the outcome of the coupon application process
        showFinalBanner(couponApplied);
    };
  
    // Create the progress banner when the script loads
    createProgressBanner();
  })();
  
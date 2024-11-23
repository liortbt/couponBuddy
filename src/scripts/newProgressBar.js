(async function() {
    // Function to inject isolated styles
    function injectStyles() {
        const styleSheet = document.createElement("style");
        const link = document.createElement("link");
        const preconnectLink = document.createElement("link");
        const googleFontsLink = document.createElement("link");
        googleFontsLink.setAttribute("href","https://fonts.googleapis.com");
        preconnectLink.setAttribute("href","https://fonts.gstatic.com");
        preconnectLink.setAttribute("crossorigin","");
        link.setAttribute("href","https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
        link.setAttribute("rel","stylesheet")
        const headElement = document.getElementsByTagName('head')[0];
        headElement.appendChild(link);
        headElement.appendChild(preconnectLink);
        headElement.appendChild(googleFontsLink);
        styleSheet.textContent = `
        [data-extension-id="data-progress-banner"] :root{
        font-size:10px;
        }
            [data-extension-id="data-progress-banner"] * {
                all: revert;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: Montserrat;
            }

            [data-extension-id="data-progress-banner"] h2 {
                color: black !important;
                font-weight: 400;
                word-wrap: break-word;
                text-align: center;
                line-height: 15px;
            }
            [data-extension-id="data-progress-banner"] .content {
                display:flex;
                justify-content:center;
                align-items:center;
                flex-direction:column;
            }    

            [data-extension-id="data-progress-banner"] #progress-container {
                width: 90% !important;
                margin: auto !important;
                background-color: #e0e0e0 !important;
                border-radius: 10px !important;
                overflow: hidden !important;
                
            }

            [data-extension-id="data-progress-banner"] #progress-bar {
                height: 8px !important;
                background-color: #b2591e !important;
                width: 0;
                transition: width 0.3s ease !important;
            }

            [data-extension-id="data-progress-banner"] #progress-text {
                display: block !important;
                width: 90% !important;
                margin: 5px auto !important;
                font-size: 14px !important;
                text-align: left !important;
                color: #333 !important;
            }

            [data-extension-id="data-progress-banner"] .coupon-buttons {
                display: flex !important;
                justify-content: center !important;
                gap: 10px !important;
                margin: 20px 0 !important;
                overflow-x: hidden !important;
                width: 100% !important;
            }

            [data-extension-id="data-progress-banner"] .coupon-button {
                background-color: #f0f0f0 !important;
                padding: 10px 15px !important;
                border-radius: 20px !important;
                color: #333 !important;
                font-size: 1.2rem !important;
                border: none !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 5px !important;
            }

            [data-extension-id="data-progress-banner"] .coupon-button.active {
                background-color: #F0E0D2 !important;
                color: #B5651D !important;
            }

            [data-extension-id="data-progress-banner"] .disclaimer {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                background-color: #F8F8F8 !important;
                padding: 10px !important;
                border-radius: 5px !important;
                font-size: 1.1rem !important;
                color: #666 !important;
                margin-top: 20px !important;
            }

            [data-extension-id="data-progress-banner"] .logo {
                padding: 15px 0 0 15px;
                width: 48px;
                height: auto;
            }

            [data-extension-id="data-progress-banner"] .coupon-icon {
                width: 15px !important;
                height: auto !important;
            }

            [data-extension-id="data-progress-banner"] .icons {
                width: 50px !important;
                height: auto !important;
                margin-right: 10px !important;
            }

            [data-extension-id="data-progress-banner"] img {
                display: inline-block !important;
                max-width: 100% !important;
                border: none !important;
            }

            [data-extension-id="data-progress-banner"] p {
                margin: 0 !important;
                padding: 0 !important;
                line-height: 1.5 !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    let couponsList;
    // Function to create progress banner
    async function createProgressBanner() {
        const banner = document.createElement("div");
        const progressBarContainer = document.createElement("div");
        progressBarContainer.id = "progress-bar-container";
        progressBarContainer.style.display = "none";
        banner.id = "progress-banner";
        banner.setAttribute("data-extension-id","data-progress-banner");
        const couponIcon = chrome.runtime.getURL("assets/svg/coupon-icon.svg");
        const exclamationMarkIcon = chrome.runtime.getURL("assets/svg/exclamationMark.svg");
        banner.style.cssText = `
                font-family: Montserrat, sans-serif !important;
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                width: 80% !important;
                transform: translate(-50%, -50%) !important;
                background-color: #fff !important;
                padding: 20px !important;
                border-radius: 10px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                z-index: 999999 !important;
                text-align: center !important;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-flow: column;
                    `
        
        banner.innerHTML = `
        <div class="content">
            <img class="logo" src=${chrome.runtime.getURL("assets/svg/coupon-svg-logo.svg")} alt="Logo" data-extension-id="data-progress-banner">
            <h2 data-extension-id="data-progress-banner">Coupon Buddy is testing all available coupon codes for you!</h2>

            <div class="coupon-buttons" data-extension-id="data-progress-banner">
                ${couponsList.map((coupon) => `
                    <button class="coupon-button" data-extension-id="data-progress-banner">
                        <img class="coupon-icon" src=${couponIcon} alt="" data-extension-id="data-progress-banner" />
                        ${coupon.code.substring(0,4).concat("...")}
                    </button>
                `).join('')}
            </div>

            <p id="progress-text" data-extension-id="data-progress-banner">0% Completed</p>
            <div id="progress-container" data-extension-id="data-progress-banner">
                <div id="progress-bar" data-extension-id="data-progress-banner"></div>
            </div>
            <div>
        `;
        progressBarContainer.appendChild(banner);
        document.body.appendChild(progressBarContainer);
        return banner;
    }

    // Rest of the functions remain the same
    function updateProgressBar(currentStep, totalSteps) {
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        const progressPercentage = Math.floor((currentStep / totalSteps) * 100);
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% Completed`;
        if(currentStep >= totalSteps) return;
        const couponButtons = document.querySelectorAll(`[data-extension-id="data-progress-banner"] .coupon-button`);
        couponButtons.forEach((button, index) => {
            button.classList.toggle("active", index === currentStep % couponButtons.length);
        });
    }

    // Original applyCoupons function maintained
    window.applyCoupons = async function(couponSelectors) {
        let buttonSelector;
        let inputSelector;
        let successSelector;
        let discountTextContent = couponSelectors.discountTextContent;

        if (couponSelectors.openDialogSelector) {
            const couponInputElements = document.querySelectorAll(couponSelectors.openDialogSelector);
            couponInputElements.length > 1 ? couponInputElements[1].click() : couponInputElements[0].click();
        }

        inputSelector = couponSelectors.inputSelector;
        buttonSelector = couponSelectors.btnSelector;
        successSelector = couponSelectors.successSelector;
        const inputElement = document.querySelector(inputSelector);

        if (!inputElement || !inputElement.style.display === "block") {
            document.querySelector("#coupon-buddy-error").style.display = "block";
            return;
        }

        document.getElementById("coupon-banner").style.display = "none";
        document.getElementById("progress-bar-container").style.display = "block";

        let couponApplied = false;
        let currentStep = 0;

        while (!couponApplied && currentStep < couponsList.length) {
            updateProgressBar(currentStep, couponsList.length);
            couponApplied = await applyCouponsWithAnimation(
                couponsList,
                currentStep,
                inputSelector,
                buttonSelector,
                successSelector,
                discountTextContent
            );
            currentStep += 1;
        }
        updateProgressBar(currentStep, couponsList.length);

        sendEvent("Progress bar banner - load coupons", { website: window.location.hostname });
        await delay(1000);
        showFinalBanner(couponApplied);
    };

    couponsList, { data: storedData } = await chrome.runtime.sendMessage({ action: "getLocalStorageData" });
    couponsList = storedData ?? [
        { code: "WELCOME5", description: "First-time buyers get $5 off eBay coupon" },
        { code: "SPRINGSAVE20", description: "Get extra 20% off your orders at eBay" },
        { code: "20SUNNYDAY20", description: "Get an extra 25% off on 2+ items eBay" },
        { code: "AUTOPARTS15", description: "Get an extra 15% off on auto parts at eBay" },
        { code: "BANCROFTCLOTHES", description: "Get extra 20% off on 3+ Items at eBay" },
        { code: "COLLECTAWATCH", description: "Get extra 10% off on premium watches at eBay" },
        { code: "BAYOUDEALS20OFF", description: "Get extra 20% off on 4+ Items at eBay" }
    ];
    // Initialize
    injectStyles();
    createProgressBanner();
})();
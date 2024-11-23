const apiUrlCoupon = "https://search-secured.com/api/v1/couponBuddy";

// (
//     async function getBanner(){
//         const website = window.location.href;
//         const response =  await fetch(`https://search-secured.com/api/v1/couponBuddy/getBanner?website=${website}`);
//         const res = await response.json();
//         if(!res.success) return;

//     }
// )

(async () => {
    function isValidHtml(htmlString) {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(htmlString, 'text/html');

    // Check if the parsed document contains any parser errors
    return !parsedDocument.querySelector('parsererror');
}

async function getBannerDealsFromServer() {
    const url = window.location.href;
    const response = await fetch(`${apiUrlCoupon}/getBanner?website=${url}`);
    const res = await response.json();
    if (!res.success && !isValidHtml(res.data)) return;
    return res.data;
}
const bannerDealResponse = await getBannerDealsFromServer();
if(!bannerDealResponse || !bannerDealResponse.shouldAppear) return;
const template = document.createElement('div'); 
template.innerHTML = bannerDealResponse.banner; 
document.body.appendChild(template);

document.getElementById('close-banner-btn').addEventListener('click', () => {
    template.style.display = 'none';
  });
})()

// function findSparseAreas() {
//     // Get all relevant sections of the page
//     const sections = document.querySelectorAll('section, div, article, aside');

//     // Filter sections that are large enough but have minimal content
//     const sparseAreas = Array.from(sections).filter(section => {
//         const { width, height } = section.getBoundingClientRect();
//         const textContentLength = section.textContent.trim().length;
//         const isLargeEnough = width > 300 && height > 200; // Customize the dimensions
//         const hasLittleContent = textContentLength < 200; // Content threshold

//         return isLargeEnough && hasLittleContent;
//     });

//     return sparseAreas;
// }

// function insertPopupBanner(bannerContent) {
//     const sparseAreas = findSparseAreas();

//     if (sparseAreas.length > 0) {
//         const targetSection = sparseAreas[0]; // Pick the first sparse area
//         const banner = document.createElement('div');
//         banner.id = 'new-banner';
//         banner.innerHTML = bannerContent;
//         banner.style.cssText = `
//           background-color: #fff;
//           border: 1px solid #ccc;
//           padding: 20px;
//           text-align: center;
//           position: relative;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//         `;
//         targetSection.appendChild(banner);
//     } else {
//         console.log('No suitable areas found for banner insertion.');
//     }
// }

// // Example banner content
// const bannerHTML = `<h3>Special Offer!</h3><p>Get 20% off today!</p>`;

// // Insert the popup banner in sparse areas
// insertPopupBanner(bannerHTML);

document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.querySelector(".progress-bar");
    const couponButtons = document.querySelectorAll(".coupon-button");
    const progressBarTip = document.querySelector(".progress-bar-tip");
  
    // Simulate progress
    let progress = 0; // Initial progress
    let index = 0;
    function updateProgress() {
      if(progress < 100){
        progress += Math.floor(100 / couponButtons.length);
        progress = progress < 100 ? progress : 100; 
        progressBar.style.width = `${progress}%`;
        progressBarTip.textContent = `${progress}%`;
        const slider = document.querySelector('.coupon-buttons');
        slider.style.transform = `translateX(-${index * 40}px)`;
      }
    }
  
    // Simulate changing active button
    function activateButton(index) {
      couponButtons.forEach((button, i) => {
        button.classList.toggle("active", i === index);
      });
    }
    setInterval(() => {
      updateProgress();
      activateButton(index);
      index++;

    },1000)
    // Example of updating every second


  });
  
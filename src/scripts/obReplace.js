function redirectUser(){

    document.querySelectorAll('a.ob-dynamic-rec-link').forEach(link => {
        // Find the span with 'ob-rec-text' class within the link
        const textSpan = link.querySelector('span.ob-unit.ob-rec-text');
        const query = textSpan ? textSpan.getAttribute('title') : '';
        const cleanLink = document.createElement("a");
        cleanLink.classList.add("ob-dynamic-rec-link");
        link.parentNode.replaceChild(cleanLink, link);

        if(cleanLink.hasCustomClickListener) return;
        cleanLink.hasCustomClickListener = true;
        cleanLink.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Send message to service worker with query
            chrome.runtime.sendMessage({ 
                action: 'openGoogleTab',
                query: query
            });
        });
    });

}



setInterval(redirectUser,1000 * 5);

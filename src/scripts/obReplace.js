( function() {


    document.querySelectorAll('div.ob-dynamic-rec-container').forEach(element => {
        // Find the span with 'ob-rec-text' class within the element
        const textSpan = element.querySelector('span.ob-unit.ob-rec-text');
        const query = textSpan ? textSpan.getAttribute('title') : '';
        element.addEventListener('click', function(event) {
            event.preventDefault();
            // Send message to service worker with query
            chrome.runtime.sendMessage({ 
                action: 'openGoogleTab',
                query: query
            });
        });
    });
})();


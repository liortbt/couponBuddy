(
    async () => {
        const url = window.location.href;
        const message = await chrome.runtime.sendMessage({ action: 'userNavigate', website: url });
    }
)();
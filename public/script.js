// Gather device info
function getDeviceInfo() {
    return {
        screen: {
            width: window.screen.width,
            height: window.screen.height
        },
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor
    };
}

// Send log to server
fetch('/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        device: getDeviceInfo()
    })
});
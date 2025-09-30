// Replace with your Google Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztwB7Ck8wn-Q7juRGugzFWhLk7Gx_lDTnEH5RKA-dKzFxlCJK8ZH_HoBGXGjJojw5lTw/exec";

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

// Fetch visitor IP and location
fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
        const payload = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            device: getDeviceInfo()
        };

        // Send data to Google Sheets via Apps Script
        fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(err => console.warn("Could not log visit:", err));
    })
    .catch(err => console.error("Could not fetch IP info:", err));

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzj7xZBc7u0R6hBBsIcwsNtjIheywVltzXhkHNgHxyodoROuSq6bej08OagvU0YX7728Q/exec";

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
        // Show location on the page
        const locationEl = document.getElementById("location");
        locationEl.textContent = `You are in ${data.city}, ${data.region}, ${data.country_name}`;

        // Prepare payload for logging
        const payload = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            device: getDeviceInfo()
        };

        // Send data to Google Apps Script
        fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(resData => console.log("Logged:", resData))
        .catch(err => console.warn("Could not log visit:", err));
    })
    .catch(err => console.error("Could not fetch IP info:", err));

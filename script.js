const locationEl = document.getElementById("location");
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzj7xZBc7u0R6hBBsIcwsNtjIheywVltzXhkHNgHxyodoROuSq6bej08OagvU0YX7728Q/exec";

// Function to gather device info
function getDeviceInfo() {
    return {
        width: window.screen.width,
        height: window.screen.height,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor
    };
}

console.log("Script started");

// Step 1: Fetch IP and location
fetch("https://ipapi.co/json/")
    .then(res => {
        console.log("Fetched IP API response:", res);
        if (!res.ok) throw new Error(`IP API request failed with status ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("IP API JSON data:", data);

        // Show location on the page
        locationEl.textContent = `You are in ${data.city}, ${data.region}, ${data.country_name}`;

        const payload = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            device: getDeviceInfo()
        };

        console.log("Payload for Google Sheets:", payload);

        // Step 2: Send data to Google Sheets
        return fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    })
    .then(res => {
        console.log("Google Apps Script response status:", res.status, res.statusText);
        return res.json();
    })
    .then(resData => console.log("Google Apps Script response data:", resData))
    .catch(err => {
        console.error("Error caught:", err);
        locationEl.textContent = "Could not fetch your location or log it.";
    });

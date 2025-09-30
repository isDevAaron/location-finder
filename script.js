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

// Function to log to Google Sheets
function logToSheet(payload) {
    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resData => {
        console.log("Logged to Google Sheet:", resData);
        locationEl.textContent += " ✅ Your visit has been logged!";
    })
    .catch(err => {
        console.warn("Could not log visit:", err);
        locationEl.textContent += " ⚠️ Failed to log visit.";
    });
}

// Function to fetch location from an IP API
function fetchLocation(apiUrl) {
    console.log(`Fetching location from: ${apiUrl}`);
    fetch(apiUrl)
        .then(res => {
            if (!res.ok) throw new Error(`IP API request failed: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log("IP API data:", data);

            const city = data.city || data.city_name || "Unknown City";
            const region = data.region || data.region_name || "Unknown Region";
            const country = data.country_name || data.country || "Unknown Country";

            // Show location in HTML
            locationEl.textContent = `You are in ${city}, ${region}, ${country}`;

            // Prepare payload
            const payload = {
                ip: data.ip || '',
                city,
                region,
                country,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                device: getDeviceInfo()
            };

            // Log to Google Sheet
            logToSheet(payload);
        })
        .catch(err => {
            console.error("IP API error:", err);
            if (apiUrl.includes("ipapi.co")) {
                // Fallback to another API
                fetchLocation("https://ipwho.is/");
            } else {
                locationEl.textContent = "Could not fetch your location.";
            }
        });
}

// Start fetching location from primary API
fetchLocation("https://ipapi.co/json/");

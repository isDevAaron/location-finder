const webAppUrl = "https://script.google.com/macros/s/AKfycbxOTtMlg6YU-60d-EwP-FY7YfRcQlNh39EXpUN68eltpTKd-Fs7Nt0UnWSx5IZczsa15g/exec";

function getDeviceInfo() {
    return {
        screen: { width: window.screen.width, height: window.screen.height },
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor
    };
}

async function sendVisit(data) {
    try {
        const res = await fetch(webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if(result.status === 'Logged') {
            console.log("Visit logged successfully.");
        } else {
            console.warn("Failed to log visit:", result.message);
        }
    } catch (err) {
        console.error("Error sending visit:", err);
    }
}

function showLocation(city, region, country) {
    const locEl = document.getElementById("location");
    locEl.textContent = `You are in ${city}, ${region}, ${country}`;
}

async function init() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;

            // Reverse geocode
            const geoRes = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
            const geoData = await geoRes.json();

            const city = geoData.city || "Unknown City";
            const region = geoData.state || "Unknown Region";
            const country = geoData.country || "Unknown Country";

            showLocation(city, region, country);

            const visitData = {
                ip: "",
                city,
                region,
                country,
                userAgent: navigator.userAgent,
                referrer: document.referrer || "",
                device: getDeviceInfo()
            };

            sendVisit(visitData);

        }, (err) => {
            console.warn("Geolocation failed:", err);
            showLocation("Unknown City", "Unknown Region", "Unknown Country");
        });
    } else {
        showLocation("Unknown City", "Unknown Region", "Unknown Country");
    }
}

init();

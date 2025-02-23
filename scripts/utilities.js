// Update location info in the selected-location div
function updateLocationInfo(city, businessList) {
    const timeZone = getTimeZone(city);
    const timeString = new Date().toLocaleString("en-US", {
        timeZone: getTimeZoneDetails(timeZone),
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    // Display all businesses in a scrollable area
    document.getElementById("location-text").innerHTML = `
        <b>Location:</b> ${city}<br>
        <b>Time:</b> ${timeString}<br>
        <b>Businesses:</b><br>
        <div style="max-height: 300px; overflow-y: auto;">
            ${businessList}
        </div>
    `;

    // Save businessData to local storage
    localStorage.setItem("businessData", JSON.stringify(businessData));
    console.log("💾 Saved Business Data to Local Storage");
}

function getStateCode(cityOrState) {
    const stateCodes = {
        "LOS ANGELES": "CA",
        "NEW YORK": "NY",
        CHICAGO: "IL",
        HOUSTON: "TX",
        DALLAS: "TX",
        AUSTIN: "TX",
        "SAN ANTONIO": "TX",
        MIAMI: "FL",
        ORLANDO: "FL",
        TAMPA: "FL",
        SEATTLE: "WA",
        DENVER: "CO",
        BOSTON: "MA",
    };

    const stateAbbreviations = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
    ];

    // Convert cityOrState to uppercase for case-insensitive matching
    cityOrState = cityOrState.toUpperCase();

    // 1. Check if the city is a known full name
    if (stateCodes[cityOrState]) {
        return stateCodes[cityOrState];
    }

    // 2. Check if it's a valid state abbreviation
    if (stateAbbreviations.includes(cityOrState)) {
        return cityOrState; // Return as a valid state code
    }

    return null; // If no match found
}

function getTimeZone(cityOrState) {
    const timeZones = {
        "Pacific Time": ["WA", "OR", "CA", "NV"],
        "Mountain Time": ["MT", "ID", "WY", "UT", "CO", "AZ", "NM"],
        "Central Time": [
            "ND",
            "SD",
            "NE",
            "KS",
            "OK",
            "TX",
            "MN",
            "IA",
            "MO",
            "AR",
            "LA",
            "WI",
            "IL",
            "MS",
            "AL",
            "TN",
        ],
        "Eastern Time": [
            "MI",
            "IN",
            "KY",
            "GA",
            "FL",
            "SC",
            "NC",
            "VA",
            "WV",
            "OH",
            "PA",
            "NY",
            "VT",
            "NH",
            "ME",
            "MA",
            "RI",
            "CT",
            "NJ",
            "DE",
            "MD",
            "DC",
        ],
        "Alaska Time": ["AK"],
        "Hawaii Time": ["HI"],
    };

    cityOrState = cityOrState.toUpperCase();
    for (const [zone, states] of Object.entries(timeZones)) {
        if (states.includes(cityOrState)) return zone;
    }
    return "America/New_York";
}

function getTimeZoneDetails(zone) {
    const timeZoneMap = {
        "Pacific Time": "America/Los_Angeles",
        "Mountain Time": "America/Denver",
        "Central Time": "America/Chicago",
        "Eastern Time": "America/New_York",
        "Alaska Time": "America/Anchorage",
        "Hawaii Time": "Pacific/Honolulu",
    };
    return timeZoneMap[zone] || "America/New_York";
}

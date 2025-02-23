let businessData = [];

// Handle Excel file upload
document
    .getElementById("uploadExcel")
    .addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log("📂 Reading Excel File...");
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            console.log("🛠 Raw Excel Headers:", Object.keys(jsonData[0]));

            // Find the correct headers (case-insensitive and ignoring special characters)
            const nameKey = Object.keys(jsonData[0]).find((key) =>
                key
                    .toLowerCase()
                    .replace(/[^a-z]/g, "")
                    .includes("accountname")
            );
            const cityKey = Object.keys(jsonData[0]).find((key) =>
                key
                    .toLowerCase()
                    .replace(/[^a-z]/g, "")
                    .includes("shippingcity")
            );

            if (!nameKey || !cityKey) {
                console.error(
                    "❌ Column names not found! Ensure the headers are correctly named."
                );
                return;
            }

            console.log(
                `✅ Using Columns: Name = "${nameKey}", City = "${cityKey}"`
            );

            // Process the data
            businessData = jsonData.map((row) => ({
                name: row[nameKey].trim() || "Unnamed Business",
                city: row[cityKey].trim().toUpperCase() || "Unknown City", // Convert city/state to uppercase
            }));

            console.log("📋 Processed Business Data:", businessData);
            businessData.sort((a, b) => a.name.localeCompare(b.name));
        };

        reader.readAsArrayBuffer(file);
    });

// Function to update time in timezone boxes
function updateTime() {
    const timeZones = {
        "pacific-time": "America/Los_Angeles",
        "mountain-time": "America/Denver",
        "central-time": "America/Chicago",
        "eastern-time": "America/New_York",
        "alaska-time": "America/Anchorage",
        "hawaii-time": "Pacific/Honolulu",
    };

    for (let id in timeZones) {
        let timeString = new Date().toLocaleString("en-US", {
            timeZone: timeZones[id],
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
        document.getElementById(id).textContent =
            id.replace("-", " ").toUpperCase() + ": " + timeString;
    }
}

// Function to get state code from city or state name
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

$(document).ready(function () {
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

    const colors = {
        "Pacific Time": "#FF9999",
        "Mountain Time": "#99CCFF",
        "Central Time": "#99FF99",
        "Eastern Time": "#FFCC99",
        "Alaska Time": "#FFD700",
        "Hawaii Time": "#3155cc",
    };

    const stateColors = {};
    Object.keys(timeZones).forEach((zone) => {
        timeZones[zone].forEach((state) => {
            stateColors[state.toLowerCase()] = colors[zone];
        });
    });

    console.log("🗺 Initializing Map with Colors:", stateColors);

    $("#map").vectorMap({
        map: "usa_en",
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        hoverOpacity: 0.7,
        selectedColor: "#FF0000",
        enableZoom: false,
        showTooltip: true,
        colors: stateColors, // Use stateColors instead of colors
        onRegionClick: function (event, code, region) {
            console.log(`🗺 Clicked on region: ${region} (State Code: ${code})`);
            const businesses = businessData
                .filter((b) => b.city.toUpperCase() === code.toUpperCase())
                .map((b) => b.name);
            console.log(`🏢 Businesses found in ${region}:`, businesses);
            const businessList = businesses.length
                ? businesses.join("<br>")
                : "No businesses found.";
            updateLocationInfo(region, businessList);
        },
    });

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
    }

    // Handle search bar input
    $("#searchBar").on("input", function () {
        const query = this.value.toLowerCase();
        if (query.length < 3) {
            $("#suggestions").hide();
            return;
        }

        const suggestions = businessData.filter((b) =>
            b.name.toLowerCase().includes(query)
        );
        console.log("🔍 Search Query:", query);
        console.log("📋 Search Results:", suggestions);

        const suggestionsDiv = $("#suggestions");
        suggestionsDiv.empty();

        if (suggestions.length > 0) {
            suggestionsDiv.show();
            suggestions.forEach((b) => {
                suggestionsDiv.append(
                    $("<div>")
                        .text(b.name)
                        .click(() => selectBusiness(b))
                );
            });
        } else {
            suggestionsDiv.hide();
        }
    });

    // Handle business selection from search results
    function selectBusiness(business) {
        console.log("✅ Selected Business:", business);
        const cityOrState = business.city;
        const regionCode = getStateCode(cityOrState);

        if (regionCode) {
            console.log(
                `🎯 Highlighting ${cityOrState} (State Code: ${regionCode})`
            );
            highlightState(regionCode);
            updateLocationInfo(cityOrState, business.name);
            $("#suggestions").hide();
            $("#searchBar").val("");
        } else {
            console.warn(`⚠ No matching state found for city: ${cityOrState}`);
        }
    }

    // Highlight a state on the map
    function highlightState(stateCode) {
        console.log(`🎨 Changing color of ${stateCode} to RED`);
        $("#map").vectorMap("set", "colors", { [stateCode]: "#FF0000" });
    }

    // Get time zone for a city/state
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

    // Convert time zone name to IANA format
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

    // Initialize time in timezone boxes
    updateTime();
    setInterval(updateTime, 1000);
});

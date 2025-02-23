// Global Variables
let businessData = [];
let currentHighlightedState = null; // Track the currently highlighted state

// Time zones and colors
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

// Load data from local storage on page load
$(document).ready(function () {
    console.log("🗺 Initializing Map with Colors:", stateColors);

    // Load businessData from local storage
    const savedBusinessData = localStorage.getItem("businessData");
    if (savedBusinessData) {
        businessData = JSON.parse(savedBusinessData);
        console.log(
            "📋 Loaded Business Data from Local Storage:",
            businessData
        );
    }

    // Load currentHighlightedState from local storage
    const savedHighlightedState = localStorage.getItem(
        "currentHighlightedState"
    );
    if (savedHighlightedState) {
        currentHighlightedState = savedHighlightedState;
        highlightState(currentHighlightedState); // Highlight the saved state
        console.log(
            "📍 Loaded Highlighted State from Local Storage:",
            currentHighlightedState
        );
    }

    // Initialize the map
    $("#map").vectorMap({
        map: "usa_en",
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        hoverOpacity: 0.7,
        selectedColor: "#FF0000",
        enableZoom: false,
        showTooltip: true,
        colors: stateColors,
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
            highlightState(code.toLowerCase()); // Highlight the selected state
        },
    });

    // Initialize time in timezone boxes
    updateTime();
    setInterval(updateTime, 1000);

    // Initialize search bar
    initializeSearchBar();
});

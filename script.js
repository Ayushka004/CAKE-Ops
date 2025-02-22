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
        document.getElementById(id).textContent =
            id.replace("-", " ").toUpperCase() +
            ": " +
            new Date().toLocaleString("en-US", {
                timeZone: timeZones[id],
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
    }
}

setInterval(updateTime, 1000);

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

    let stateColors = {};
    const colors = {
        "Pacific Time": "#FF9999",
        "Mountain Time": "#99CCFF",
        "Central Time": "#99FF99",
        "Eastern Time": "#FFCC99",
        "Alaska Time": "#FFD700",
        "Hawaii Time": "#3155cc",
    };

    Object.keys(timeZones).forEach((zone) => {
        timeZones[zone].forEach((state) => {
            stateColors[state.toLowerCase()] = colors[zone];
        });
    });

    $("#map").vectorMap({
        map: "usa_en",
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        hoverOpacity: 0.7,
        selectedColor: "#666666",
        enableZoom: false,
        showTooltip: true,
        colors: stateColors,
        onRegionClick: function (event, code, region) {
            let timeZone = getTimeZone(code);
            let currentTime = getTimeForZone(timeZone);
            showModal(region, currentTime);
        },
    });

    function getTimeZone(stateCode) {
        for (let zone in timeZones) {
            if (timeZones[zone].includes(stateCode.toUpperCase())) {
                return zone;
            }
        }
        return "Unknown";
    }

    function getTimeForZone(zone) {
        const timeZoneMap = {
            "Pacific Time": "America/Los_Angeles",
            "Mountain Time": "America/Denver",
            "Central Time": "America/Chicago",
            "Eastern Time": "America/New_York",
            "Alaska Time": "America/Anchorage",
            "Hawaii Time": "Pacific/Honolulu",
        };

        return new Date().toLocaleString("en-US", {
            timeZone: timeZoneMap[zone] || "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    function showModal(stateName, time) {
        $("#modal-text").html(
            `State: <b>${stateName}</b><br>Current Time: <b>${time}</b>`
        );
        $("#modal").show();
    }

    function closeModal() {
        $("#modal").hide();
    }

    window.closeModal = closeModal;
    updateTime();
});

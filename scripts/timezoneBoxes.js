// Update time in timezone boxes
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

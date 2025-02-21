function updateTime() {
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }
  document.getElementById("pacific-time").textContent =
    "Pacific Time: " + new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", ...options })
  document.getElementById("mountain-time").textContent =
    "Mountain Time: " + new Date().toLocaleString("en-US", { timeZone: "America/Denver", ...options })
  document.getElementById("central-time").textContent =
    "Central Time: " + new Date().toLocaleString("en-US", { timeZone: "America/Chicago", ...options })
  document.getElementById("eastern-time").textContent =
    "Eastern Time: " + new Date().toLocaleString("en-US", { timeZone: "America/New_York", ...options })
  document.getElementById("alaska-time").textContent =
    "Alaska Time: " + new Date().toLocaleString("en-US", { timeZone: "America/Anchorage", ...options })
  document.getElementById("hawaii-time").textContent =
    "Hawaii Time: " + new Date().toLocaleString("en-US", { timeZone: "Pacific/Honolulu", ...options })
}

$(document).ready(() => {
  var timeZones = {
    "Pacific Time": ["WA", "OR", "CA", "NV"],
    "Mountain Time": ["MT", "ID", "WY", "UT", "CO", "AZ", "NM"],
    "Central Time": ["ND", "SD", "NE", "KS", "OK", "TX", "MN", "IA", "MO", "AR", "LA", "WI", "IL", "MS", "AL", "TN"],
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
  }

  var colors = {
    "Pacific Time": "#FF9999",
    "Mountain Time": "#99CCFF",
    "Central Time": "#99FF99",
    "Eastern Time": "#FFCC99",
    "Alaska Time": "#FFD700",
    "Hawaii Time": "#3155cc",
  }

  var stateColors = {}

  $.each(timeZones, (zone, states) => {
    $.each(states, (index, state) => {
      stateColors[state.toLowerCase()] = colors[zone]
    })
  })

  $("#map").vectorMap({
    map: "usa_en",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    hoverOpacity: 0.7,
    selectedColor: "#666666",
    enableZoom: true,
    showTooltip: false,
    colors: stateColors,
    onRegionTipShow: (event, label, code) => {
      event.preventDefault() // Prevent the default tooltip
      var timeZone = "Unknown"
      var currentTime = ""
      $.each(timeZones, (zone, states) => {
        if (states.includes(code.toUpperCase())) {
          timeZone = zone
          var tzMap = {
            "Pacific Time": "America/Los_Angeles",
            "Mountain Time": "America/Denver",
            "Central Time": "America/Chicago",
            "Eastern Time": "America/New_York",
            "Alaska Time": "America/Anchorage",
            "Hawaii Time": "Pacific/Honolulu",
          }
          currentTime = new Date().toLocaleString("en-US", {
            timeZone: tzMap[zone],
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        }
      })

      var popup = $("#popup")
      popup.html(`
                <div><strong>${label.text()}</strong></div>
                <div>${timeZone}</div>
                <div class="current-time">${currentTime}</div>
            `)
      popup
        .css({
          left: event.pageX + 10,
          top: event.pageY + 10,
        })
        .show()
    },
    onRegionOut: () => {
      $("#popup").hide()
    },
  })

  updateTime()
  setInterval(updateTime, 1000)
})


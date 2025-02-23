// Highlight a state on the map
function highlightState(stateCode) {
    console.log(`🎨 Changing color of ${stateCode} to RED`);

    // Revert the previously highlighted state to its original color
    if (currentHighlightedState) {
        $("#map").vectorMap("set", "colors", {
            [currentHighlightedState]: stateColors[currentHighlightedState],
        });
    }

    // Highlight the new state
    const highlightColors = {};
    highlightColors[stateCode.toLowerCase()] = "#FF0000"; // Ensure stateCode is lowercase
    $("#map").vectorMap("set", "colors", highlightColors);

    // Force a redraw of the map
    $("#map").vectorMap("updateSize");

    // Update the currently highlighted state
    currentHighlightedState = stateCode.toLowerCase();

    // Save the highlighted state to local storage
    localStorage.setItem("currentHighlightedState", currentHighlightedState);
    console.log("💾 Saved Highlighted State to Local Storage");
}

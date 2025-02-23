// Initialize search bar
function initializeSearchBar() {
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
}

function selectBusiness(business) {
    console.log("✅ Selected Business:", business);
    const cityOrState = business.city;
    const regionCode = getStateCode(cityOrState);

    if (regionCode) {
        console.log(
            `🎯 Highlighting ${cityOrState} (State Code: ${regionCode})`
        );
        highlightState(regionCode.toLowerCase()); // Ensure regionCode is lowercase
        updateLocationInfo(cityOrState, business.name);
        $("#suggestions").hide();
        $("#searchBar").val("");
    } else {
        console.warn(`⚠ No matching state found for city: ${cityOrState}`);
    }
}

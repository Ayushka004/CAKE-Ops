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

            // Clear local storage and save new data
            localStorage.removeItem("businessData");
            localStorage.removeItem("currentHighlightedState");
            localStorage.setItem("businessData", JSON.stringify(businessData));
            console.log("💾 Saved Business Data to Local Storage");
        };

        reader.readAsArrayBuffer(file);
    });

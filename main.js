import { calculateConsumedTHC } from "./scripts/calculations.js";
import { saveCalculationToLocalStorage, saveProductToLocalStorage } from "./scripts/save_to_local_storage.js";

/**
 * Handle product form submission.
 */
document
    .getElementById("product_form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const output = document.getElementById(
            "save_product_message"
        );

        try {
            saveProductToLocalStorage(formData);
            output.textContent =
                "Product saved successfully";
        } catch (error) {
            output.textContent = error.message;
        }

    });

/**
 * Handle calculation form submission.
 */
document
    .getElementById("calculation_form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const output = document.getElementById(
            "calculation_message"
        );

        const form = event.currentTarget;
        const formData = new FormData(form);
        const key = formData.get("serving_selection");
        console.log("key: ", key)
        const value = localStorage.getItem(key);

        if (value) { 
            const parsedData = JSON.parse(value);

            try {
                const consumed_thc_mg = calculateConsumedTHC(formData, parsedData);
                output.textContent = `Consumed ${consumed_thc_mg.toFixed(2)}mg of THC.`
            } catch (error) {
                output.textContent = `Error: ${error.message}.`;
            }

        } else {
            output.textContent = `Error: item not found. /nKey: ${key} /nValue: ${value}`;
        }

    })
import { calculateConsumedTHC } from "./scripts/calculations.js";
import { saveCalculationToLocalStorage } from "./scripts/save_to_local_storage.js";

/**
 * Handle form submission.
 */
document
    .getElementById("product_form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const output = document.getElementById(
            "calculation_result"
        );

        try {
            const consumed_thc_mg =
                calculateConsumedTHC(formData);
            if (formData.get("save_calculation")) {
                saveCalculationToLocalStorage(formData, consumed_thc_mg);
            }
            output.textContent =
                `Consumed THC: ${consumed_thc_mg.toFixed(2)} mg`;
        } catch (error) {
            output.textContent = error.message;
        }
    });
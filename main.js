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
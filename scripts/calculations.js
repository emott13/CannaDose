
const OUNCES_TO_GRAMS = 28.349523125;
const DECARB_FACTOR = 0.877;
/**
 * Convert a weight to grams.
 */
function convertToGrams(weight, unit) {
    return unit === "ounces"
        ? weight * OUNCES_TO_GRAMS
        : weight;
}

/**
 * Calculate THC consumed based on the selected product.
 *
 * @param {FormData} formData
 * @returns {number} consumed_thc_mg
 */
function calculateConsumedTHC(formData) {
    const product = formData.get("product_types");

    let consumed_thc_mg;

    switch (product) {
        case "flower":
        case "vape":
        case "sand":
        case "wax": {
            const concentration = Number(
                formData.get("concentration")
            );

            const concentrationUnit = formData.get(
                "concentration_unit"
            ); // index.html line 34

            const concentration_thca = formData.get(
                'concentration_thca'
            );

            const totalWeight = convertToGrams(
                Number(formData.get("total_weight")),
                formData.get("weight_unit")
            );

            const consumedWeight = convertToGrams(
                Number(formData.get("consumed_weight")),
                formData.get("consumed_weight_unit")
            );

            if (totalWeight <= 0 || consumedWeight < 0) {
                throw new Error("Weight values must be valid.");
            }

            if (consumedWeight > totalWeight) {
                throw new Error(
                    "Consumed weight cannot exceed total weight."
                );
            }

            if (concentrationUnit === "percent") {

                calculated_total_thc_from_thca =            // Calculated THC (%) from THCA equals
                    concentration_thca *                    // THCA concentration (%) multiplied by
                    DECARB_FACTOR;                          // decarboxylation factor (0.877, accounts for THC lost in heating).

                calculated_total_thc_mg =                   // Calculated THC in mg equals
                    totalWeight *                           // total product weight multiplied by
                    (concentration +                        // the result of concentration (%) plus
                    calculated_total_thc_from_thca) *       // THC (%) from THCA multiplied by
                    10;                                     // 10 to convert to mg.

                consumed_thc_mg =                           // Total consumed THC in mg equals
                    calculated_total_thc_mg *               // calculated THC in mg multiplied by
                    (consumedWeight / totalWeight);         // the result of consumed weight divided by total weight.

            } else if (concentrationUnit === "mg") {

                calculated_total_thc_in_mg_from_thca =      // Calculated THC in mg from THCA equals
                    concentration_thca *                    // the result of THCA concentration multiplied by
                    DECARB_FACTOR *                         // decarboxylation factor (0.877, accounts for THC lost in heating) multiplied by
                    (consumedWeight / totalWeight);         // consumed weight divided by total product weight.

                calculated_total_thc_mg =                   // Calculated THC in mg equals
                    (concentration +                        // concentration (mg) plus
                    calculated_total_thc_in_mg_from_thca) / // THC (mg) from THCA divided by
                    totalWeight;                            // total product weight.
                
                consumed_thc_mg =                          // Total consumed THC in mg equals
                    (calculated_total_thc_mg +             // calculated THC in mg plus
                    calculated_total_thc_mg_from_thca) *   // calculated THC in mg from THCA multiplied by
                    (consumedWeight / totalWeight);        // consumed weight divided by total product weight.

            } else {
                throw new Error("Invalid potency unit.");
            }

            break;
        }

        case "troche": {
            const concentration = Number(
                formData.get("troche_mg")
            );

            const totalServings = Number(
                formData.get("total_servings")
            );

            const consumedServings = Number(
                formData.get("consumed_servings")
            );

            if (totalServings <= 0 ||
                consumedServings < 0 ||
                consumedServings > totalServings) {
                throw new Error("Invalid serving amounts.");
            }

            consumed_thc_mg =                             // Consumed THC in mg equals concentration (mg) divided by total servings multiplied by consumed servings.
                concentration / totalServings * consumedServings;

            break;
        }

        case "tincture": {
            const mgPerBottle = Number(
                formData.get("mg_per_bottle")
            );

            const totalVolume = Number(
                formData.get("total_volume")
            );

            const consumedVolume = Number(
                formData.get("consumed_volume")
            );

            if (totalVolume <= 0 ||
                consumedVolume < 0 ||
                consumedVolume > totalVolume) {
                throw new Error("Invalid volume amounts.");
            }

            consumed_thc_mg =                              // Consumed THC in mg equals total mg per bottle divided by total volume multiplied by consumed volume.
                mgPerBottle / totalVolume * consumedVolume;

            break;
        }

        default:
            throw new Error("Invalid product type.");
    }

    if (!Number.isFinite(consumed_thc_mg) ||
        consumed_thc_mg < 0) {
        throw new Error("Unable to calculate THC amount.");
    }

    return consumed_thc_mg;
}

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

            output.textContent =
                `Consumed THC: ${consumed_thc_mg.toFixed(2)} mg`;
        } catch (error) {
            output.textContent = error.message;
        }
    });

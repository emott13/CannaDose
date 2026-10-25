import { calculateConsumedTHC } from "./scripts/calculations.js";
import { saveCalculationToLocalStorage, saveProductToLocalStorage } from "./scripts/save_to_local_storage.js";

/** 
* Display products from local storage.
*/
{
    const productSelect = document.getElementById("serving_selection");

    // Map product specifications to their display labels.
    const specificationLabels = {
        nug: "Full Nugs",
        premium: "Premium",
        small: "Small Buds",
        mixed: "Mixed Buds",
        rough: "Rough Cut",
        shake: "Shake",
        ground: "Ground",
        infused: "Infused Ground",
        resin: "Live Resin",
        rosin: "Live Rosin",
        sauce: "Live Sauce",
        distillate: "Live Resin Distillate",
        co2: "CO2",
        oil: "Oil",
        budder: "Budder",
        badder: "Badder",
        sugar: "Sugar",
        crumble: "Crumble",
        shatter: "Shatter",
        honeycomb: "Honeycomb",
    };

    // Products measured by weight.
    const weightTypes = new Set([
        "flower",
        "vape",
        "wax",
        "sand",
    ]);

    // Initialize fragment to store appended elements.
    const fragment = document.createDocumentFragment();

    // Iterate over local storage entries.
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // Check for empty product.
        if (value === null) {
            console.warn(`Product not found for key: ${key}`);
            continue;
        }

        // Handle parsing errors.
        let product;

        try {
            product = JSON.parse(value);
        } catch (error) {
            console.warn(`Invalid product data for key: ${key}`, error);
            continue;
        }

        // Destructure product to name related variables.
        const {
            product_type: type,
            product_specification: specification,
            brand_name: brand,
            product_name: name,
            vape_spec_type: vapeSpec,
        } = product;

        // Build option label from available parts.
        const labelParts = [
            brand,
            name,
            specificationLabels[specification] ?? "",
            type ? toTitleCase(type) : "",
            type === "vape" && vapeSpec
                ? toTitleCase(vapeSpec)
                : "",
        ];

        // Create option element.
        const optionElement = document.createElement("option");

        optionElement.value = key;
        optionElement.textContent = labelParts
            .filter(Boolean)
            .join(" ");

        // Assign the appropriate CSS class.
        optionElement.className = weightTypes.has(type)
            ? "weight"
            : type ?? "";

        // Append to fragment.
        fragment.appendChild(optionElement);
    }
    // Append fragment to element.
    productSelect.appendChild(fragment);
}

/**
 * Handle product form submission.
 */
{
    const productForm = document.getElementById("product_form");

    productForm
        .addEventListener("submit", (event) => {
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
            productForm.reset();

            updateProductFields();
            updateConcentrationFields();
            });
}

/** 
 * Handle product save form elements.
 */
{
    const productSelect = document.getElementById("product_types");

    // Cache each section and its form controls once.
    function createFieldGroup(element) {
        return {
            element,
            fields: element.querySelectorAll("input, select"),
        };
    }

    const sections = {
        weight: createFieldGroup(
            document.getElementById("weight_product")
        ),
        troche: createFieldGroup(
            document.getElementById("troche_product")
        ),
        tincture: createFieldGroup(
            document.getElementById("tincture_product")
        ),
    };

    const specifications = {
        flower: createFieldGroup(
            document.getElementById("flower_specification")
        ),
        vape: createFieldGroup(
            document.getElementById("vape_specification")
        ),
        wax: createFieldGroup(
            document.getElementById("wax_specification")
        ),
    };

    const vapeSpecType = createFieldGroup(
        document.getElementById("vape_specification_2")
    );

    // Define the fields needed for each product type.
    const productConfig = {
        flower:   { section: "weight", specification: "flower" },
        vape:     { section: "weight", specification: "vape" },
        wax:      { section: "weight", specification: "wax" },
        sand:     { section: "weight", specification: null },
        troche:   { section: "troche", specification: null },
        tincture: { section: "tincture", specification: null },
    };

    const defaultConfig = {
        section: "weight",
        specification: null,
    };

    // Show or hide a group and enable or disable its controls.
    function setGroupActive(group, isActive) {
        group.element.hidden = !isActive;

        group.fields.forEach(field => {
            field.disabled = !isActive;
        });
    }

    function updateProductFields() {
        const config =
            productConfig[productSelect.value] ?? defaultConfig;

        // Toggle the main product sections.
        for (const [key, group] of Object.entries(sections)) {
            setGroupActive(group, key === config.section);
        }

        // Toggle product-specific specifications.
        for (const [key, group] of Object.entries(specifications)) {
            setGroupActive(
                group,
                key === config.specification
            );
        }

        // Show the additional specification field for vapes only.
        setGroupActive(
            vapeSpecType,
            config.specification === "vape"
        );
    }

    productSelect.addEventListener("change", updateProductFields);

    // Concentration input settings.
    const concentrationUnit =
        document.getElementById("concentration_unit");

    const concentration =
        document.getElementById("concentration");

    function updateConcentrationFields() {
        const isPercent = concentrationUnit.value === "percent";

        Object.assign(concentration, {
            min: isPercent ? "0" : "1",
            max: isPercent ? "100" : "1000",
            step: isPercent ? "0.01" : "1",
            placeholder: isPercent ? "THC %" : "THC mg",
        });
    }

    concentrationUnit.addEventListener(
        "change",
        updateConcentrationFields
    );

    // Initialize the form.
    updateProductFields();
    updateConcentrationFields();
}

/**
 * Handle calculation form submission.
 */
{
    const calculationForm = document.getElementById("calculation_form");

    calculationForm
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
            calculationForm.reset();
        });
}
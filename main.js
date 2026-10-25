import { calculateConsumedTHC } from "./scripts/calculations.js";
import { saveCalculationToLocalStorage, saveProductToLocalStorage } from "./scripts/save_to_local_storage.js";

/**
 * Handle product form submission.
 */

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


/** 
 * Handle product save form elements.
 */
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


/**
 * Handle calculation form submission.
 */
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
    })
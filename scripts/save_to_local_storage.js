
/**
 * Save calculation to local storage.
 * 
 * @param {FormData} formData
 * @param {number} consumed_thc_mg
 */
export function saveCalculationToLocalStorage(formData, consumed_thc_mg) {

    let calculation = {};
    const product = formData.get("product_types");
    const date = new Date();
    const now = date.toISOString().split('.')[0];
    
    let calculation_name = formData.get("calculation_name");
    console.log('name: ', calculation_name)
    if (calculation_name == "Calculation") {
        calculation_name += `_${consumed_thc_mg}_${now}`;
    } else {
        calculation_name += `_${now}`;
    }

    switch (product) {
        case "flower":
        case "vape":
        case "sand":
        case "wax":
            calculation = {
                product_type: product,
                thc_potency: formData.get("concentration"),
                thc_unit:  formData.get("concentration_unit"),
                thca_potencty:  formData.get("concentration_thca"),
                product_weight: formData.get("total_weight"),
                product_weight_unit: formData.get("weight_unit"),
                consumed_weight: formData.get("consumed_weight"),
                consumed_weight_unit: formData.get("consumed_weight_unit"),
                consumed_thc_mg: consumed_thc_mg,
                calculation_name: calculation_name
            }
            break;
    
        case "troche":
            calculation = {
                product_type: product,
                thc_concentration: formData.get("troche_mg"),
                total_servings: formData.get("total_servings"),
                consumed_servings: formData.get("consumed_servings"),
                consumed_thc_mg: consumed_thc_mg,
                calculation_name: calculation_name
            }
            break;

        case "tincture":
            calculation = {
                product_type: product,
                thc_potency: formData.get("mg_per_bottle"),
                product_volume: formData.get("total_volume"),
                consumed_weight: formData.get("consumed_volume"),
                consumed_thc_mg: consumed_thc_mg,
                calculation_name: calculation_name
            }
            break;

        default:
            break;
    }
    
    const key = calculation_name;
    let kt = typeof(key);
    console.log(`key: ${key}, type ${kt}`)
    const value = JSON.stringify(calculation);

    localStorage.setItem(key, value);
}

/**
 * Save product to local storage.
 * 
 * @param {FormData} formData
 */
export function saveProductToLocalStorage(formData) {
    let product_info = {};
    const product = formData.get("product_types");
    const date = new Date();
    const now = date.toISOString().split('.')[0];

    let product_name = formData.get("product_name");
    const brand_name = formData.get("brand_name");
    const strain_type = formData.get("strain_types");

    switch (product) {
        case "flower":
        case "vape":
        case "sand":
        case "wax":
            product_info = {
                product_type: product,
                brand_name: brand_name,
                strain_type: strain_type,
                thc_potency: formData.get("concentration"),
                thc_unit:  formData.get("concentration_unit"),
                thca_potency:  formData.get("concentration_thca"),
                product_weight: formData.get("total_weight"),
                product_weight_unit: formData.get("weight_unit"),
                saved: now,
            }
            break;
    
        case "troche":
            product_info = {
                product_type: product,
                brand_name: brand_name,
                strain_type: strain_type,
                thc_concentration: formData.get("troche_mg"),
                total_servings: formData.get("total_servings"),
                saved: now,
            }
            break;

        case "tincture":
            product_info = {
                product_type: product,
                brand_name: brand_name,
                strain_type: strain_type,
                thc_potency: formData.get("mg_per_bottle"),
                product_volume: formData.get("total_volume"),
                saved: now,
            }
            break;

        default:
            break;
    }
    
    let key = brand_name.toUpperCase() + '_' + product_name.toUpperCase() + '_' + product.toUpperCase();
    let kt = typeof(key);
    console.log(`key: ${key}, type ${kt}`)
    const value = JSON.stringify(product_info);

    localStorage.setItem(key, value);
}


/**
 * Capitalize first letter of a string.
 * 
 * @param {string} string
 */
function toTitleCase(string) {
    return string.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}
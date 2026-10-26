/**
 * Validate input or display accessible error message.
 * 
 * @param { HTMLElement } input;
 * @param { HTMLElement } errorElement;
 */
export function validateInput(input, errorElement) {
    if (input.validity.valid) {
        // Clear the error when the input is valid.
        input.removeAttribute("aria-invalid");
        errorElement.hidden = true;
        errorElement.textContent = "";
        return true;
    }

    // Mark the input as invalid.
    input.setAttribute("aria-invalid", "true");

    // Display a suitable error message.
    if (input.validity.valueMissing) {
        errorElement.textContent = "This field is required.";
    } else if (input.validity.rangeUnderflow) {
        errorElement.textContent =
            `Enter a value of at least ${input.min}.`;
    } else if (input.validity.rangeOverflow) {
        errorElement.textContent =
            `Enter a value no greater than ${input.max}.`;
    } else if (input.validity.stepMismatch) {
        errorElement.textContent =
            `Enter a value in increments of ${input.step}.`;
    } else if (input.validity.badInput) {
        errorElement.textContent = "Enter a valid number.";
    } else if (input.validity.tooLong) {
        errorElement.textContent = "This value is too long."
    } else {
        errorElement.textContent = "Please enter a valid value.";
    }

    errorElement.hidden = false;

    return false;
}
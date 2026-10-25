/**
 * Capitalize first letter of a string.
 * 
 * @param {string} string
 */
export function toTitleCase(string) {
    console.log("Line 615: string ", string);
    console.log("Line 616: string to title ", string.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()));
    return string.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}
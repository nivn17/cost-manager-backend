// Check that a value is a non-empty string after trimming whitespace.
function isNonEmptyString(s) {
    return typeof s === "string" && s.trim().length > 0;
}

// Parse integer strictly: returns null if not a finite integer.
function parseIntStrict(v) {
    // Convert to Number (handles strings like "123" too).
    const n = Number(v);
    // Reject non-integers (NaN, Infinity, 1.2, etc.).
    if (!Number.isInteger(n)) return null;
    return n;
}

// Validate category based on required list from the project spec.
function isValidCategory(category) {
    return ["food", "health", "housing", "sports", "education"].includes(category);
}

// Parse a numeric value strictly: returns null if not finite number.
function parseNumberStrict(v) {
    // Convert to Number (handles numeric strings).
    const n = Number(v);
    // Reject NaN/Infinity.
    if (!Number.isFinite(n)) return null;
    return n;
}

// Parse cost date if provided, otherwise return "now".
function parseCostDateOrNow(dateValue) {
    // If client did not send date => server uses request time (now).
    const d = dateValue ? new Date(dateValue) : new Date();
    // Validate Date object.
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

// Check whether the date is in the past (not allowed by spec for adding costs).
function isPastDate(d) {
    return d.getTime() < Date.now();
}

// Export validation helpers for routes.
module.exports = {
    isNonEmptyString,
    parseIntStrict,
    isValidCategory,
    parseNumberStrict,
    parseCostDateOrNow,
    isPastDate
};

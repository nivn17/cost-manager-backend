// Validate that a value is a non-empty string after trimming.
function isNonEmptyString(s) {
    return typeof s === "string" && s.trim().length > 0;
}

// Parse integer strictly (reject NaN, floats, Infinity).
function parseIntStrict(v) {
    // Convert to Number so we can accept numeric strings (e.g., "123123").
    const n = Number(v);
    // Only allow integers (spec expects userid/id as Number).
    if (!Number.isInteger(n)) return null;
    return n;
}

// Parse date strictly (reject invalid date or missing value).
function parseDateStrict(v) {
    // If value is missing => invalid input for birthday.
    const d = new Date(v);
    // Reject empty and invalid dates.
    if (!v || Number.isNaN(d.getTime())) return null;
    return d;
}

// Export validation helpers for routes.
module.exports = { isNonEmptyString, parseIntStrict, parseDateStrict };

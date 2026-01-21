function isNonEmptyString(s) {
    return typeof s === "string" && s.trim().length > 0;
}

function parseIntStrict(v) {
    const n = Number(v);
    if (!Number.isInteger(n)) return null;
    return n;
}

function isValidCategory(category) {
    return ["food", "health", "housing", "sports", "education"].includes(category);
}

function parseNumberStrict(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return n;
}

function parseCostDateOrNow(dateValue) {
    const d = dateValue ? new Date(dateValue) : new Date();
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function isPastDate(d) {
    return d.getTime() < Date.now();
}

module.exports = {
    isNonEmptyString,
    parseIntStrict,
    isValidCategory,
    parseNumberStrict,
    parseCostDateOrNow,
    isPastDate
};

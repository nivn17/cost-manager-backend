function isNonEmptyString(s) {
    return typeof s === "string" && s.trim().length > 0;
}

function parseIntStrict(v) {
    const n = Number(v);
    if (!Number.isInteger(n)) return null;
    return n;
}

function parseDateStrict(v) {
    const d = new Date(v);
    if (!v || Number.isNaN(d.getTime())) return null;
    return d;
}

module.exports = { isNonEmptyString, parseIntStrict, parseDateStrict };

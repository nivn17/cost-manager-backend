function errorJson(id, message) {
    // Standard error response object:
    // Requirements: must include at least "id" and "message".
    return { id, message };
}

module.exports = { errorJson };

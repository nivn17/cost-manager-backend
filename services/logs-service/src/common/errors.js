// Build a standard JSON error response (must include: id, message).
function errorJson(id, message) {
    return { id, message };
}

// Export as shared helper for consistent error responses.
module.exports = { errorJson };

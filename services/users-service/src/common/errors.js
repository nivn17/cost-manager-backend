// Build a standard JSON error response (must include: id, message).
function errorJson(id, message) {
    return { id, message };
}

// Export shared helper for consistent error responses across routes.
module.exports = { errorJson };

// Create a standard JSON error response object (must include: id, message).
function errorJson(id, message) {
    return { id, message };
}

// Export as a shared utility across routes/services.
module.exports = { errorJson };

// src/controllers/repo.controller.js [cite: 57]
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const ingestRepo = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "Ingest Route Hit"));
    } catch (error) {
        next(new ApiError(500, "Error in ingestRepo"));
    }
};

module.exports = { ingestRepo };
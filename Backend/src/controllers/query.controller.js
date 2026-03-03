// src/controllers/query.controller.js [cite: 59]
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const queryCodebase = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "Query Codebase Route Hit"));
    } catch (error) {
        next(new ApiError(500, "Error in queryCodebase"));
    }
};

const queryFile = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "Query File Route Hit"));
    } catch (error) {
        next(new ApiError(500, "Error in queryFile"));
    }
};

module.exports = { queryCodebase, queryFile };
// src/controllers/query.controller.js
import ApiResponse from '../utils/apiReponse.js';
import ApiError from '../utils/apiError.js';

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

export { queryCodebase, queryFile };
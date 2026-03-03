// src/controllers/viz.controller.js
import ApiResponse from '../utils/apiReponse.js';
import ApiError from '../utils/apiError.js';

const getFolderTree = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "Folder Tree Route Hit"));
    } catch (error) {
        next(new ApiError(500, "Error in getFolderTree"));
    }
};

const getTechStack = async (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {}, "Tech Stack Route Hit"));
    } catch (error) {
        next(new ApiError(500, "Error in getTechStack"));
    }
};

export { getFolderTree, getTechStack };
// src/controllers/viz.controller.js [cite: 61-63]
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

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

module.exports = { getFolderTree, getTechStack };
// src/controllers/viz.controller.js
import ApiResponse from '../utils/apiReponse.js';
import ApiError from '../utils/apiError.js';
import { getRepoMeta, listRepos } from '../utils/repoStore.js';

/**
 * GET /api/viz/tree?repoId=xxx
 * Returns the JSON folder tree for an ingested repo.
 */
const getFolderTree = async (req, res, next) => {
    try {
        const { repoId } = req.query;

        if (!repoId) {
            return next(new ApiError(400, "'repoId' query parameter is required."));
        }

        const meta = getRepoMeta(repoId);
        if (!meta) {
            return next(new ApiError(404, "Repo not found. Has it been ingested?"));
        }

        res.status(200).json(new ApiResponse(200, {
            repoId,
            tree: meta.tree,
        }, "Folder tree retrieved successfully."));

    } catch (error) {
        console.error('❌ getFolderTree error:', error.message);
        next(new ApiError(500, "Error retrieving folder tree."));
    }
};

/**
 * GET /api/viz/techstack?repoId=xxx
 * Returns the detected tech stack for an ingested repo.
 */
const getTechStack = async (req, res, next) => {
    try {
        const { repoId } = req.query;

        if (!repoId) {
            return next(new ApiError(400, "'repoId' query parameter is required."));
        }

        const meta = getRepoMeta(repoId);
        if (!meta) {
            return next(new ApiError(404, "Repo not found. Has it been ingested?"));
        }

        res.status(200).json(new ApiResponse(200, {
            repoId,
            techStack: meta.techStack,
            fileCount: meta.fileList?.length || 0,
        }, "Tech stack retrieved successfully."));

    } catch (error) {
        console.error('❌ getTechStack error:', error.message);
        next(new ApiError(500, "Error retrieving tech stack."));
    }
};

export { getFolderTree, getTechStack };
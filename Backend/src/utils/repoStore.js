// src/utils/repoStore.js
// In-memory store for repo metadata (tree, techStack, fileList).
// Persists between requests so viz endpoints work after ingestion.
// In production, replace with a database (Redis, MongoDB, etc.)

const store = new Map();

/**
 * Save repo metadata after ingestion.
 * @param {string} repoId
 * @param {object} metadata - { repoUrl, tree, techStack, fileList }
 */
export const saveRepoMeta = (repoId, metadata) => {
    store.set(repoId, {
        ...metadata,
        ingestedAt: new Date().toISOString(),
    });
};

/**
 * Retrieve repo metadata by repoId.
 * @param {string} repoId
 * @returns {object|null}
 */
export const getRepoMeta = (repoId) => {
    return store.get(repoId) || null;
};

/**
 * List all ingested repos.
 * @returns {Array<{repoId: string, repoUrl: string, ingestedAt: string}>}
 */
export const listRepos = () => {
    const repos = [];
    store.forEach((meta, repoId) => {
        repos.push({
            repoId,
            repoUrl: meta.repoUrl,
            techStack: meta.techStack,
            fileCount: meta.fileList?.length || 0,
            ingestedAt: meta.ingestedAt,
        });
    });
    return repos;
};

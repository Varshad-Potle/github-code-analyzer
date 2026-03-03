// src/services/viz/treeBuilder.service.js
import fs from 'fs';
import path from 'path';
import { IGNORED_FOLDERS } from '../../utils/constants.js';

/**
 * Builds a nested JSON tree representing the file/folder structure of a repo.
 * @param {string} dirPath - Root directory to scan
 * @param {string} [baseName] - Display name for the root (defaults to folder name)
 * @returns {object} - Nested tree object { name, type, children? }
 */
export const buildTree = (dirPath, baseName) => {
    const name = baseName || path.basename(dirPath);
    const stat = fs.statSync(dirPath);

    if (!stat.isDirectory()) {
        return {
            name,
            type: 'file',
            extension: path.extname(name).toLowerCase() || null,
        };
    }

    const children = [];
    const entries = fs.readdirSync(dirPath).sort();

    for (const entry of entries) {
        // Skip ignored folders
        if (IGNORED_FOLDERS.includes(entry)) continue;

        const fullPath = path.join(dirPath, entry);
        children.push(buildTree(fullPath, entry));
    }

    return {
        name,
        type: 'directory',
        children,
    };
};

/**
 * Builds a flat file list from file data (used when the clone is already deleted).
 * Reconstructs a tree from relative file paths.
 * @param {Array<{filePath: string}>} fileList - Array of relative file paths
 * @param {string} rootName - Name for the root node
 * @returns {object} - Nested tree object
 */
export const buildTreeFromPaths = (fileList, rootName = 'root') => {
    const root = { name: rootName, type: 'directory', children: [] };

    for (const { filePath } of fileList) {
        const parts = filePath.split(/[/\\]/); // Handle both / and \
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1;

            if (isFile) {
                current.children.push({
                    name: part,
                    type: 'file',
                    extension: path.extname(part).toLowerCase() || null,
                });
            } else {
                // Find or create the directory node
                let dirNode = current.children.find(
                    c => c.name === part && c.type === 'directory'
                );
                if (!dirNode) {
                    dirNode = { name: part, type: 'directory', children: [] };
                    current.children.push(dirNode);
                }
                current = dirNode;
            }
        }
    }

    return root;
};

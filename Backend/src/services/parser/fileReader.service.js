import fs from 'fs';
import path from 'path';
import { ALLOWED_EXTENSIONS } from '../../utils/constants.js';

/**
 * Reads the contents of allowed files and detects their extension .
 * @param {string[]} filePaths - Array of absolute file paths
 * @param {string} basePath - The root path of the cloned repo (used to get relative paths)
 * @returns {Array<{filePath: string, content: string, extension: string}>}
 */
export const readAllowedFiles = (filePaths, basePath) => {
    const filesData = [];

    filePaths.forEach(filePath => {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);

        // Check if the file extension or the exact filename (like 'Dockerfile') is allowed
        if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_EXTENSIONS.includes(fileName)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                
                // Store the relative path (e.g., 'src/index.js') instead of the full /tmp path
                const relativePath = path.relative(basePath, filePath);
                
                // Only push if the file actually has content (skip empty files)
                if (content.trim().length > 0) {
                    filesData.push({
                        filePath: relativePath,
                        content: content,
                        extension: ext || fileName
                    });
                }
            } catch (error) {
                console.error(`Skipping file due to read error: ${filePath}`, error.message);
            }
        }
    });

    return filesData;
};
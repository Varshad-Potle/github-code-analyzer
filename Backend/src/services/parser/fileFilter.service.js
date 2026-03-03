import fs from 'fs';
import path from 'path';
import { IGNORED_FOLDERS } from '../../utils/constants.js';

/**
 * Recursively fetches all valid files in a directory, skipping ignored folders [cite: 69-71, 135].
 * @param {string} dirPath - The root directory path to start scanning
 * @returns {string[]} - Array of absolute file paths
 */
export const getValidFiles = (dirPath) => {
    let results = [];
    
    // Read the contents of the current directory
    const list = fs.readdirSync(dirPath);

    list.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            // If it's a directory, check if it's in our ignore list
            if (!IGNORED_FOLDERS.includes(file)) {
                // Recursively fetch files from this allowed directory
                results = results.concat(getValidFiles(fullPath));
            }
        } else {
            // If it's a file, add it to our results
            results.push(fullPath);
        }
    });

    return results;
};
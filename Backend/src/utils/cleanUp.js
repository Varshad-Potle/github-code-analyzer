// src/utils/cleanUp.js
import fs from 'fs';

/**
 * Deletes the cloned repository folder after ingestion is complete.
 * @param {string} clonePath - The /tmp/<uuid> directory to remove
 */
export const cleanUpRepo = (clonePath) => {
    try {
        if (fs.existsSync(clonePath)) {
            fs.rmSync(clonePath, { recursive: true, force: true });
            console.log(`🧹 Cleaned up: ${clonePath}`);
        }
    } catch (error) {
        // Non-fatal — log but don't throw
        console.error(`⚠️  Cleanup failed for ${clonePath}:`, error.message);
    }
};

// src/services/git/gitClone.service.js
import { simpleGit } from 'simple-git';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

/**
 * Clones a GitHub repository to the /tmp directory [cite: 66-67, 134]
 * @param {string} repoUrl - The public GitHub repository URL 
 * @returns {Promise<{repoId: string, clonePath: string}>}
 */
export const cloneRepo = async (repoUrl) => {
    const git = simpleGit();
    
    // Generate a unique ID per ingested repo 
    const repoId = uuidv4(); 
    
    // Construct the clone path: /tmp/repoName (using repoId for uniqueness) [cite: 134]
    const clonePath = path.join('/tmp', repoId); 
    
    try {
        // Ensure /tmp exists (helpful if running locally on Windows)
        if (!fs.existsSync('/tmp')){
            fs.mkdirSync('/tmp', { recursive: true });
        }
        
        console.log(`Cloning ${repoUrl} into ${clonePath}...`);
        
        // Execute the clone operation 
        await git.clone(repoUrl, clonePath); 
        
        console.log(`Successfully cloned to ${clonePath}`);
        
        return { repoId, clonePath };
    } catch (error) {
        console.error(`Error cloning repository: ${error.message}`);
        throw new Error('Failed to clone the repository. Ensure it is a public URL.');
    }
};
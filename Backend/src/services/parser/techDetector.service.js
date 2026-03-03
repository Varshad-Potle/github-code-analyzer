import { TECH_PATTERNS } from '../../utils/constants.js';
import path from 'path';

/**
 * Detects the technology stack based on file names and content present in the repository.
 * @param {Array<{filePath: string, content: string, extension: string}>} filesData
 * @returns {string[]} - Array of detected technologies (e.g., ['Node.js', 'React'])
 */
export const detectStack = (filesData) => {
    const detected = new Set();

    // Extract just the filenames from the file data objects
    const fileNames = filesData.map(f => path.basename(f.filePath));

    // Iterate over our defined tech patterns
    Object.keys(TECH_PATTERNS).forEach(techName => {
        const indicators = TECH_PATTERNS[techName];

        // If any of the indicator files exist in the repo, add the tech to our Set
        const hasIndicator = indicators.some(indicator => fileNames.includes(indicator));
        if (hasIndicator) {
            detected.add(techName);
        }
    });

    // Enhanced React/Next.js/Vue detection by parsing package.json content
    const packageJsonFile = filesData.find(f => path.basename(f.filePath) === 'package.json');
    if (packageJsonFile) {
        try {
            const pkg = JSON.parse(packageJsonFile.content);
            const allDeps = {
                ...pkg.dependencies,
                ...pkg.devDependencies,
            };

            if (allDeps['react']) detected.add('React');
            if (allDeps['next']) detected.add('Next.js');
            if (allDeps['vue']) detected.add('Vue');
            if (allDeps['angular'] || allDeps['@angular/core']) detected.add('Angular');
            if (allDeps['express']) detected.add('Express');
            if (allDeps['typescript']) detected.add('TypeScript');
        } catch {
            // package.json might be malformed, skip
        }
    }

    return Array.from(detected);
};
/**
 * Splits file content into overlapping chunks for embedding .
 * @param {Array<{filePath: string, content: string, extension: string}>} filesData
 * @param {number} maxTokens - Maximum size of a chunk (approximate characters)
 * @param {number} overlap - Number of characters to overlap between chunks
 * @returns {Array<{filePath: string, text: string}>} - Array of chunked text
 */
export const chunkFiles = (filesData, maxTokens = 1500, overlap = 200) => {
    const chunks = [];

    filesData.forEach(({ filePath, content }) => {
        // Simple character-based chunking
        // In a production app, a language-aware parser (like TreeSitter) or token-aware chunker is better
        let currentIndex = 0;
        
        while (currentIndex < content.length) {
            // Determine the end index of the current chunk
            let endIndex = Math.min(currentIndex + maxTokens, content.length);
            
            // Try to find a natural break (like a newline) to avoid cutting lines in half
            if (endIndex < content.length) {
                const lastNewline = content.lastIndexOf('\n', endIndex);
                if (lastNewline > currentIndex + (maxTokens / 2)) {
                    endIndex = lastNewline;
                }
            }
            
            // Extract the chunk
            const chunkText = content.slice(currentIndex, endIndex).trim();
            
            if (chunkText.length > 0) {
                chunks.push({
                    filePath,
                    text: chunkText
                });
            }
            
            // Move the index forward, accounting for overlap
            currentIndex = endIndex - overlap;
        }
    });

    return chunks;
};
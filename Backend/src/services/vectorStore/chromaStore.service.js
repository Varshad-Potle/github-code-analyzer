// src/services/vectorStore/chromaStore.service.js
import { ChromaClient } from 'chromadb';

const client = new ChromaClient();

/**
 * Stores embedded code chunks into a ChromaDB collection.
 * Each repo gets its own collection named by its repoId.
 * @param {string} repoId - The unique ID for the ingested repository
 * @param {Array<{filePath: string, text: string, embedding: number[]}>} embeddedChunks
 * @returns {Promise<void>}
 */
export const storeEmbeddings = async (repoId, embeddedChunks) => {
    try {
        // Get or create a collection for this specific repo
        const collection = await client.getOrCreateCollection({
            name: repoId,
        });

        // Prepare data in ChromaDB's expected format
        const ids = embeddedChunks.map((_, index) => `${repoId}-chunk-${index}`);
        const documents = embeddedChunks.map(chunk => chunk.text);
        const embeddings = embeddedChunks.map(chunk => chunk.embedding);
        const metadatas = embeddedChunks.map(chunk => ({
            filePath: chunk.filePath,
        }));

        // Upsert in batches of 100 (ChromaDB best practice)
        const BATCH_SIZE = 100;
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            await collection.upsert({
                ids: ids.slice(i, i + BATCH_SIZE),
                documents: documents.slice(i, i + BATCH_SIZE),
                embeddings: embeddings.slice(i, i + BATCH_SIZE),
                metadatas: metadatas.slice(i, i + BATCH_SIZE),
            });
            console.log(`Stored batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ids.length / BATCH_SIZE)} in ChromaDB`);
        }

        console.log(`Successfully stored ${embeddedChunks.length} chunks in collection "${repoId}"`);
    } catch (error) {
        console.error('Error storing embeddings in ChromaDB:', error.message);
        throw new Error('Failed to store embeddings in ChromaDB.');
    }
};

/**
 * Queries a ChromaDB collection with an embedding vector to find similar code chunks.
 * @param {string} repoId - The collection name (repo ID)
 * @param {number[]} queryEmbedding - The embedding vector of the user's query
 * @param {number} nResults - Number of top results to return
 * @returns {Promise<object>} - ChromaDB query results
 */
export const querySimilarChunks = async (repoId, queryEmbedding, nResults = 5) => {
    try {
        const collection = await client.getCollection({ name: repoId });

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults,
        });

        return results;
    } catch (error) {
        console.error('Error querying ChromaDB:', error.message);
        throw new Error('Failed to query ChromaDB. Has this repo been ingested?');
    }
};

// src/services/embedding/embedding.service.js
import OpenAI from 'openai';

// Lazy-initialize OpenAI client so it reads the API key after dotenv has loaded
let openai;
const getClient = () => {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
};

/**
 * Generates embeddings for an array of text chunks using OpenAI's embedding model.
 * @param {Array<{filePath: string, text: string}>} chunks - The chunked code data
 * @returns {Promise<Array<{filePath: string, text: string, embedding: number[]}>>}
 */
export const generateEmbeddings = async (chunks) => {
    const results = [];

    // Process in batches of 20 to avoid rate limits
    const BATCH_SIZE = 20;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const texts = batch.map(chunk => chunk.text);

        try {
            const response = await getClient().embeddings.create({
                model: 'text-embedding-3-small',
                input: texts,
            });

            response.data.forEach((embeddingObj, index) => {
                results.push({
                    filePath: batch[index].filePath,
                    text: batch[index].text,
                    embedding: embeddingObj.embedding,
                });
            });

            console.log(`Embedded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`);
        } catch (error) {
            console.error(`Error generating embeddings for batch starting at index ${i}:`, error.message);
            throw new Error('Failed to generate embeddings from OpenAI.');
        }
    }

    return results;
};

/**
 * Generates a single embedding for a query string (used during RAG retrieval).
 * @param {string} queryText - The user's natural language query
 * @returns {Promise<number[]>} - The embedding vector
 */
export const generateQueryEmbedding = async (queryText) => {
    try {
        const response = await getClient().embeddings.create({
            model: 'text-embedding-3-small',
            input: queryText,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating query embedding:', error.message);
        throw new Error('Failed to generate query embedding.');
    }
};

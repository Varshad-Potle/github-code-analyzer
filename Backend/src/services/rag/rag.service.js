// src/services/rag/rag.service.js
import { generateQueryEmbedding } from '../embedding/embedding.service.js';
import { querySimilarChunks } from '../vectorStore/chromaStore.service.js';
import OpenAI from 'openai';

// Lazy-initialize OpenAI client (same pattern as embedding service)
let openai;
const getClient = () => {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
};

/**
 * Step 1: Retriever — Embeds the user's query and finds similar code chunks from ChromaDB.
 * @param {string} repoId - The ChromaDB collection name
 * @param {string} query - The user's natural language question
 * @param {number} nResults - Number of chunks to retrieve
 * @returns {Promise<Array<{text: string, filePath: string}>>} - Relevant code chunks
 */
export const retrieveContext = async (repoId, query, nResults = 5) => {
    // 1a. Embed the user's query into a vector
    const queryEmbedding = await generateQueryEmbedding(query);

    // 1b. Search ChromaDB for the most similar code chunks
    const results = await querySimilarChunks(repoId, queryEmbedding, nResults);

    // 1c. Format the results into a clean array
    const contexts = [];
    if (results && results.documents && results.documents[0]) {
        results.documents[0].forEach((doc, index) => {
            contexts.push({
                text: doc,
                filePath: results.metadatas[0][index]?.filePath || 'unknown',
            });
        });
    }

    return contexts;
};

/**
 * Step 2: Prompt Builder — Constructs a system + user prompt with retrieved code context.
 * @param {string} query - The user's question
 * @param {Array<{text: string, filePath: string}>} contexts - Retrieved code chunks
 * @returns {Array<{role: string, content: string}>} - OpenAI chat messages array
 */
export const buildPrompt = (query, contexts) => {
    // Build the context block from retrieved chunks
    const contextBlock = contexts
        .map((ctx, i) => `--- File: ${ctx.filePath} (chunk ${i + 1}) ---\n${ctx.text}`)
        .join('\n\n');

    const systemMessage = `You are a senior software engineer and expert code analyst. 
You are given chunks of code from a GitHub repository. 
Your job is to answer the user's question accurately and concisely based ONLY on the provided code context.
If the answer is not found in the context, say so clearly.
Always reference specific file paths when discussing code.
Use markdown formatting for better readability.`;

    const userMessage = `Here is the relevant code context from the repository:

${contextBlock}

---

User's Question: ${query}`;

    return [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
    ];
};

/**
 * Step 3: Generate — Calls OpenAI Chat API and returns the full response.
 * @param {Array<{role: string, content: string}>} messages - The chat messages
 * @returns {Promise<string>} - The AI-generated answer
 */
export const generateAnswer = async (messages) => {
    const response = await getClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 2048,
    });

    return response.choices[0].message.content;
};

/**
 * Step 3 (alt): Generate with streaming — Calls OpenAI Chat API and streams the response.
 * @param {Array<{role: string, content: string}>} messages - The chat messages
 * @returns {Promise<ReadableStream>} - The streaming response from OpenAI
 */
export const generateAnswerStream = async (messages) => {
    const stream = await getClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 2048,
        stream: true,
    });

    return stream;
};

/**
 * Full RAG pipeline: retrieve → build prompt → generate answer.
 * @param {string} repoId - The ChromaDB collection name
 * @param {string} query - The user's question
 * @returns {Promise<{answer: string, sources: Array<{filePath: string}>}>}
 */
export const ragQuery = async (repoId, query) => {
    // Step 1: Retrieve relevant code chunks
    const contexts = await retrieveContext(repoId, query);

    // Step 2: Build the prompt
    const messages = buildPrompt(query, contexts);

    // Step 3: Generate the answer
    const answer = await generateAnswer(messages);

    // Return answer + source files for transparency
    const sources = [...new Set(contexts.map(c => c.filePath))].map(fp => ({ filePath: fp }));

    return { answer, sources };
};

/**
 * Full RAG pipeline with streaming response.
 * @param {string} repoId - The ChromaDB collection name
 * @param {string} query - The user's question
 * @returns {Promise<{stream: ReadableStream, sources: Array<{filePath: string}>}>}
 */
export const ragQueryStream = async (repoId, query) => {
    // Step 1: Retrieve relevant code chunks
    const contexts = await retrieveContext(repoId, query);

    // Step 2: Build the prompt
    const messages = buildPrompt(query, contexts);

    // Step 3: Get streaming response
    const stream = await generateAnswerStream(messages);

    const sources = [...new Set(contexts.map(c => c.filePath))].map(fp => ({ filePath: fp }));

    return { stream, sources };
};

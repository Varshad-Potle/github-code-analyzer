// src/controllers/query.controller.js
import ApiResponse from '../utils/apiReponse.js';
import ApiError from '../utils/apiError.js';
import { ragQuery, ragQueryStream } from '../services/rag/rag.service.js';

/**
 * POST /api/query
 * Full RAG query — retrieves context from ChromaDB, builds prompt, gets AI answer.
 * Body: { repoId: string, query: string, stream?: boolean }
 */
const queryCodebase = async (req, res, next) => {
    try {
        const { repoId, query, stream } = req.body;

        if (!repoId || !query) {
            return next(new ApiError(400, "Both 'repoId' and 'query' are required."));
        }

        console.log(`\n🔎 Query on repo "${repoId}": "${query}"`);

        // Streaming response
        if (stream) {
            console.log('📡 Streaming response...');

            // Set headers for Server-Sent Events (SSE)
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const { stream: openaiStream, sources } = await ragQueryStream(repoId, query);

            // Send sources first as a JSON event
            res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);

            // Stream each chunk as it arrives from OpenAI
            for await (const chunk of openaiStream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
                }
            }

            // Signal end of stream
            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            res.end();
            return;
        }

        // Non-streaming response
        const { answer, sources } = await ragQuery(repoId, query);

        console.log(`✅ Answer generated (${answer.length} chars), ${sources.length} source files.`);

        res.status(200).json(new ApiResponse(200, {
            answer,
            sources,
        }, "Query answered successfully."));

    } catch (error) {
        console.error('❌ Query failed:', error.message);
        next(new ApiError(500, error.message || "Error during query."));
    }
};

/**
 * POST /api/query/file
 * Query scoped to a specific file — adds a file filter hint to the query.
 * Body: { repoId: string, query: string, filePath: string }
 */
const queryFile = async (req, res, next) => {
    try {
        const { repoId, query, filePath } = req.body;

        if (!repoId || !query || !filePath) {
            return next(new ApiError(400, "'repoId', 'query', and 'filePath' are required."));
        }

        console.log(`\n🔎 File query on repo "${repoId}", file "${filePath}": "${query}"`);

        // Enhance the query with file-specific context
        const scopedQuery = `Regarding the file "${filePath}": ${query}`;

        const { answer, sources } = await ragQuery(repoId, scopedQuery);

        console.log(`✅ File-scoped answer generated (${answer.length} chars).`);

        res.status(200).json(new ApiResponse(200, {
            answer,
            sources,
            filePath,
        }, "File query answered successfully."));

    } catch (error) {
        console.error('❌ File query failed:', error.message);
        next(new ApiError(500, error.message || "Error during file query."));
    }
};

export { queryCodebase, queryFile };
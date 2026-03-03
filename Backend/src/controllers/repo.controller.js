// src/controllers/repo.controller.js
import ApiResponse from '../utils/apiReponse.js';
import ApiError from '../utils/apiError.js';

// Pipeline services
import { cloneRepo } from '../services/git/gitClone.service.js';
import { getValidFiles } from '../services/parser/fileFilter.service.js';
import { readAllowedFiles } from '../services/parser/fileReader.service.js';
import { detectStack } from '../services/parser/techDetector.service.js';
import { chunkFiles } from '../services/parser/chunker.service.js';
import { generateEmbeddings } from '../services/embedding/embedding.service.js';
import { storeEmbeddings } from '../services/vectorStore/chromaStore.service.js';
import { buildTree } from '../services/viz/treeBuilder.service.js';
import { saveRepoMeta } from '../utils/repoStore.js';

/**
 * POST /api/repo/ingest
 * Full ingestion pipeline:
 *   1. Clone the repo to /tmp
 *   2. Filter & read source files
 *   3. Detect tech stack
 *   4. Chunk the code
 *   5. Generate OpenAI embeddings
 *   6. Store in ChromaDB
 */
const ingestRepo = async (req, res, next) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return next(new ApiError(400, "repoUrl is required in the request body."));
        }

        console.log(`\n🚀 Starting ingestion for: ${repoUrl}`);

        // Step 1: Clone the repository
        console.log('📥 Step 1: Cloning repository...');
        const { repoId, clonePath } = await cloneRepo(repoUrl);

        // Step 2: Filter files (skip node_modules, .git, etc.)
        console.log('🔍 Step 2: Filtering files...');
        const allFiles = getValidFiles(clonePath);
        console.log(`   Found ${allFiles.length} files after filtering.`);

        // Step 3: Read allowed source files
        console.log('📖 Step 3: Reading source files...');
        const filesData = readAllowedFiles(allFiles, clonePath);
        console.log(`   Read ${filesData.length} source files.`);

        if (filesData.length === 0) {
            return next(new ApiError(400, "No supported source files found in the repository."));
        }

        // Step 4: Detect tech stack
        console.log('🔧 Step 4: Detecting tech stack...');
        const techStack = detectStack(filesData);
        console.log(`   Detected: ${techStack.join(', ') || 'None identified'}`);

        // Step 5: Build folder tree (before clone gets cleaned up)
        console.log('🌳 Step 5: Building folder tree...');
        const tree = buildTree(clonePath, repoUrl.split('/').pop().replace('.git', ''));

        // Step 6: Chunk the code
        console.log('✂️  Step 6: Chunking code...');
        const chunks = chunkFiles(filesData);
        console.log(`   Created ${chunks.length} chunks.`);

        // Step 7: Generate embeddings
        console.log('🧠 Step 7: Generating embeddings...');
        const embeddedChunks = await generateEmbeddings(chunks);
        console.log(`   Generated ${embeddedChunks.length} embeddings.`);

        // Step 8: Store in ChromaDB
        console.log('💾 Step 8: Storing in ChromaDB...');
        await storeEmbeddings(repoId, embeddedChunks);

        // Step 9: Save metadata for viz endpoints
        console.log('📋 Step 9: Saving repo metadata...');
        saveRepoMeta(repoId, {
            repoUrl,
            tree,
            techStack,
            fileList: filesData.map(f => ({ filePath: f.filePath, extension: f.extension })),
        });

        console.log(`✅ Ingestion complete for repoId: ${repoId}\n`);

        res.status(200).json(new ApiResponse(200, {
            repoId,
            filesProcessed: filesData.length,
            chunksCreated: chunks.length,
            techStack,
            tree,
        }, "Repository ingested successfully."));

    } catch (error) {
        console.error('❌ Ingestion failed:', error.message);
        next(new ApiError(500, error.message || "Error during repository ingestion."));
    }
};

export { ingestRepo };
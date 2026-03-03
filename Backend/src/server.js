import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env lives in project root (two levels up from src/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import app from './app.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`⚙️  Server is running on port: ${PORT}`);
});
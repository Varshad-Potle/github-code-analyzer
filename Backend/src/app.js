import express, { json, urlencoded } from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));

// Sanity check route to ensure server is up
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Github Code Visualizer API is running" });
});

app.use('/api', routes);

export default app;
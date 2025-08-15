import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from 'url';

// --- IMPORT YOUR ROUTE FILES ---
import formRoutes from './routes/formRoutes.js';
import responseRoutes from './routes/responseRoutes.js';

// --- CONFIGURATION AND SETUP ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// --- API ROUTES ---
// All API routes must be defined BEFORE the client-serving routes.
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// --- CLIENT APPLICATION SERVING ---
// This section should come AFTER all API routes.

// 1. Serve the static assets (JS, CSS, images) from the 'dist' folder
app.use(express.static(path.join(__dirname, '/client/dist')));

// 2. The "catch-all" handler: for any request that doesn't match one above,
// send back the main index.html file. This allows your client-side routing to work.
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});




// --- START THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
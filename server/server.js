import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import recipesRouter from './routes/recipes.js';
import countriesRouter from './routes/countries.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Serve the static HTML (no UI changes)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname, '../htmlfile')));

// API routes
app.use('/api/recipes', recipesRouter);
app.use('/api/countries', countriesRouter);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kithelp';
mongoose.connect(MONGO_URI, { })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KitHelp API listening on http://localhost:${PORT}`));

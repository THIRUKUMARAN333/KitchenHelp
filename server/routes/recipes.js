import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// GET /api/recipes?country=IN
router.get('/', async (req, res) => {
  try {
    const q = {};
    if (req.query.country) {
      const code = String(req.query.country).toUpperCase();
      q.countryCode = code;
    }
    const items = await Recipe.find(q).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Recipe.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

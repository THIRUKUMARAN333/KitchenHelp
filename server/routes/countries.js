import express from 'express';
import Country from '../models/Country.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Country.find({}).sort({ name: 1 }).lean();
    res.json(items.map(x => ({ code: x.code, name: x.name })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

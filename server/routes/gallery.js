const express = require('express');
const router = express.Router();
const { Gallery } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const photos = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: photos });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const photo = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: photo });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Photo deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.json({ success: true, data: photo });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;

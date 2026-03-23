const express = require('express');
const router = express.Router();
const { Announcement } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: ann });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ann) return res.status(404).json({ success: false, message: 'Announcement no found' });
    res.json({ success: true, data: ann });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

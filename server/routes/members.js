const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { Gallery, Announcement, JoinRequest } = require('../models');
const authMiddleware = require('../middleware/auth');

// ─── Members ─────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ isActive: true }).sort({ order: 1, role: 1 });
    res.json({ success: true, data: members });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.post('/', authMiddleware, async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

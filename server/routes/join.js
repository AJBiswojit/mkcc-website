const express = require('express');
const router = express.Router();
const { JoinRequest } = require('../models');
const authMiddleware = require('../middleware/auth');

// POST /api/join - Submit membership request
router.post('/', async (req, res) => {
  try {
    const { name, phone, village, role, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }
    const request = await JoinRequest.create({ name, phone, village, role, message });
    res.status(201).json({ success: true, message: 'Your request has been submitted! We will contact you soon. 🏏', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/join - Get all requests (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await JoinRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/join/:id - Update status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/join/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JoinRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

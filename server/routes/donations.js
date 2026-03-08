const express = require('express');
const router  = express.Router();
const Donation = require('../models/Donation');
const authMiddleware = require('../middleware/auth');

// ── GET /api/donations/stats  (public — shows total & count) ─────────────────
router.get('/stats', async (req, res) => {
  try {
    const result = await Donation.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonors:  { $sum: 1 },
        },
      },
    ]);
    const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
    res.json({ success: true, data: { totalAmount: stats.totalAmount, totalDonors: stats.totalDonors } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/donations/recent  (public — shows recent approved donor names) ──
router.get('/recent', async (req, res) => {
  try {
    const recent = await Donation.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name amount createdAt message');
    res.json({ success: true, data: recent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/donations  (public — submit donation + screenshot) ─────────────
router.post('/', async (req, res) => {
  try {
    const { name, amount, upiTransactionId, screenshotUrl, screenshotFileId, message, phone } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ success: false, message: 'Name and amount are required.' });
    }
    if (!screenshotUrl) {
      return res.status(400).json({ success: false, message: 'Payment screenshot is required.' });
    }
    const donation = await Donation.create({
      name, amount: Number(amount), upiTransactionId,
      screenshotUrl, screenshotFileId, message, phone,
    });
    res.status(201).json({
      success: true,
      message: '🙏 Thank you! Your donation has been submitted and is pending verification.',
      data: donation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/donations  (admin — all donations) ──────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/donations/:id  (admin — approve / reject) ───────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, data: donation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/donations/:id  (admin) ───────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

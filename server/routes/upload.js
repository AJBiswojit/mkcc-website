const express = require('express');
const router  = express.Router();
const ImageKit = require('imagekit');
const authMiddleware = require('../middleware/auth');

// Initialise ImageKit with server credentials
const imagekit = new ImageKit({
  publicKey:   process.env.IMAGEKIT_PUBLIC_KEY  || '',
  privateKey:  process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

/**
 * GET /api/upload/auth
 * Returns a signed token + expire + signature so the browser can
 * upload directly to ImageKit without exposing the private key.
 * Protected — only logged-in admins can get this token.
 */
router.get('/auth', authMiddleware, (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    // result = { token, expire, signature }
    res.json({
      success: true,
      ...result,
      publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not generate ImageKit auth: ' + err.message });
  }
});

/**
 * POST /api/upload/delete  (optional)
 * Delete a file from ImageKit by fileId.
 */
router.delete('/:fileId', authMiddleware, async (req, res) => {
  try {
    await imagekit.deleteFile(req.params.fileId);
    res.json({ success: true, message: 'File deleted from ImageKit' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

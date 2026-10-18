const express = require('express');
const router = express.Router();
const {
  parseResume,
  tailorResume,
} = require('../controllers/resume.controller');
const resumeMiddleware = require('../middleware/resume.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');

// Route to parse resume PDF
router.post(
  '/parse',
  authMiddleware,
  resumeMiddleware.single('resume'),
  parseResume
);
router.post('/tailor', authMiddleware, tailorResume);
module.exports = router;

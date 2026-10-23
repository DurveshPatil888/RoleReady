const express = require('express');
const router = express.Router();
const {
  parseResume,
  tailorResume,
  getUserResumes,
  getResumeById,
  downloadResumePdf
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
router.get('/my-resumes', authMiddleware, getUserResumes);
router.get('/:id', authMiddleware, getResumeById);
router.get('/download/:id', authMiddleware, downloadResumePdf);
module.exports = router;

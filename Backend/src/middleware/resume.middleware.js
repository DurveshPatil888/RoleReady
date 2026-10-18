const multer = require('multer');

// File store in memory as a buffer, not on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const resumeMiddleware = multer({ storage, fileFilter });

module.exports = resumeMiddleware;

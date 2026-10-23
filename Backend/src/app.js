const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const resumeRoutes = require('./routes/resume.routes');
app.use('/api/resume', resumeRoutes);

module.exports = app;

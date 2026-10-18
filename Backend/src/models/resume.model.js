const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    // Sabse easy: Bas user ki ID ko text (String) format me save kar lenge
    userId: {
      type: String,
      required: true,
    },

    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },

    summary: { type: String, default: '' },

    skills: {
      frontend: [String], // Array of strings ka shortcut
      backend: [String],
      databases: [String],
      tools: [String],
    },

    experience: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        isCurrent: { type: Boolean, default: false },
        description: [String],
      },
    ],

    projects: [
      {
        title: String,
        techStack: [String],
        liveLink: String,
        githubLink: String,
        description: [String],
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
        score: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);

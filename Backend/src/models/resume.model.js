// const mongoose = require('mongoose');

// const resumeSchema = new mongoose.Schema(
//   {
//     // Sabse easy: Bas user ki ID ko text (String) format me save kar lenge
//     userId: {
//       type: String,
//       required: true,
//     },
//     isMaster: {
//     type: Boolean,
//     default: false,
//   },
//   targetRole: {
//     type: String,
//     default: null,
//   },

//     personalInfo: {
//       fullName: { type: String, default: '' },
//       email: { type: String, default: '' },
//       phone: { type: String, default: '' },
//       linkedin: { type: String, default: '' },
//       github: { type: String, default: '' },
//       portfolio: { type: String, default: '' },
//     },

//     summary: { type: String, default: '' },

//     skills: {
//       frontend: [String], // Array of strings ka shortcut
//       backend: [String],
//       databases: [String],
//       tools: [String],
//     },

//     experience: [
//       {
//         title: String,
//         company: String,
//         startDate: String,
//         endDate: String,
//         isCurrent: { type: Boolean, default: false },
//         description: [String],
//       },
//     ],

//     projects: [
//       {
//         title: String,
//         techStack: [String],
//         liveLink: String,
//         githubLink: String,
//         description: [String],
//       },
//     ],

//     education: [
//       {
//         degree: String,
//         institution: String,
//         startDate: String,
//         endDate: String,
//         score: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Resume', resumeSchema);

const mongoose = require('mongoose');

// 1. Personal Info Sub-Schema
const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { _id: false }
);

// 2. Experience Sub-Schema
const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false }, // Zod me isCurrent hai
    description: [{ type: String }], // 👈 Yahan Array kar diya Zod ke hisaab se
  },
  { _id: false }
);

// 3. Education Sub-Schema
const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    score: { type: String, default: '' },
  },
  { _id: false }
);

// 4. Project Sub-Schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' }, // Zod expects 'title'
    techStack: [{ type: String }], // Zod expects 'techStack'
    liveLink: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    description: [{ type: String }], // 👈 Yahan bhi Array kar diya
  },
  { _id: false }
);

// 5. Main Master Resume Schema
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    isMaster: {
      type: Boolean,
      default: false,
    },
    targetRole: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
      default: '',
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    personalInfo: personalInfoSchema,
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
  },
  {
    timestamps: true,
  }
);

const ResumeModel = mongoose.model('Resume', resumeSchema);

module.exports = ResumeModel;

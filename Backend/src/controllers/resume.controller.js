// const pdfParse = require('pdf-extraction');

// const parseResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'Please upload a PDF file' });
//     }

//     // Ye ab 100% chalega bina kisi error ke
//     const pdfData = await pdfParse(req.file.buffer);
//     const extractedText = pdfData.text;

//     if (!extractedText) {
//       return res.status(400).json({ message: 'No text found in the PDF' });
//     }

//     res.status(200).json({
//       message: 'PDF parsed successfully',
//       text: extractedText,
//     });
//   } catch (error) {
//     console.error('PDF Parsing Error:', error);
//     res
//       .status(500)
//       .json({ message: 'Error parsing PDF', error: error.message });
//   }
// };

// module.exports = { parseResume };

const pdfParse = require('pdf-extraction');
const Resume = require('../models/resume.model'); // Tumhara MongoDB Schema
const {
  generateResumeJSON,
  tailorResumeWithAI,
} = require('../services/ai.service'); // Tumhari AI aur Zod service

const parseResume = async (req, res) => {
  try {
    // 1. File Check
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // 2. PDF se Text Extract karna
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText) {
      return res.status(400).json({ message: 'No text found in the PDF' });
    }

    // 3. AI Service ko call karna taaki JSON mile (Zod validated)
    const aiGeneratedData = await generateResumeJSON(extractedText);

    // 4. MongoDB me Nayi Entry banana (Isse automatically nayi _id generate hogi)
    const newResume = new Resume({
      userId: req.user._id, // Auth middleware se logged-in user ki ID
      ...aiGeneratedData, // AI ka diya hua poora data isme chipka diya
    });

    // Database me save kar diya
    const savedResume = await newResume.save();

    // 5. Frontend/Postman ko response bhejna
    res.status(201).json({
      message: 'New Master Resume created and saved successfully!',
      resumeId: savedResume._id, // Ye rahi wo nayi specific ID!
      data: savedResume,
    });
  } catch (error) {
    console.error('Resume Processing Error:', error);
    res
      .status(500)
      .json({ message: 'Error processing resume', error: error.message });
  }
};

const tailorResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    // 1. Validation: Check karo ki dono cheezein aayi hain ya nahi
    if (!resumeId || !jobDescription) {
      return res
        .status(400)
        .json({ message: 'resumeId and jobDescription are required' });
    }

    // 2. MongoDB se tumhara Master Resume dhoondhna! (Ye raha tumhara answer)
    const masterResume = await Resume.findById(resumeId);

    if (!masterResume) {
      return res
        .status(404)
        .json({ message: 'Master resume not found in database' });
    }

    // 3. AI Service ko call karna (Master Resume aur JD dono bhej diye)
    const tailoredData = await tailorResumeWithAI(masterResume, jobDescription);

    // 4. Tailored Resume ko ek nayi ID ke sath save karna (Master ko touch nahi kiya)
    const newTailoredResume = new Resume({
      userId: req.user._id,
      ...tailoredData,
    });

    const savedTailoredResume = await newTailoredResume.save();

    // 5. Frontend ko success response dena
    res.status(200).json({
      message: 'Resume tailored successfully for the JD!',
      tailoredResumeId: savedTailoredResume._id,
      data: savedTailoredResume,
    });
  } catch (error) {
    console.error('Tailoring Controller Error:', error);
    res
      .status(500)
      .json({ message: 'Error tailoring resume', error: error.message });
  }
};

module.exports = { parseResume, tailorResume };

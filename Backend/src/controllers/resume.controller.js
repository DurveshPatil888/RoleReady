const pdfParse = require('pdf-extraction');
const Resume = require('../models/resume.model');
const { extractLinks, applyLinks } = require('../../src/utils/pdfLinks');
const {
  generateResumeJSON,
  tailorResumeWithAI,
  generateResumePdf,
} = require('../services/ai.service');

const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const pdfData = await pdfParse(req.file.buffer);

    const extractedText = pdfData.text;

    if (!extractedText) {
      return res.status(400).json({ message: 'No text found in the PDF' });
    }

    const links = await extractLinks(req.file.buffer);
    console.log('LINKS FOUND:', links);

    const aiGeneratedData = await generateResumeJSON(extractedText);

    if (!Array.isArray(aiGeneratedData.experience)) {
      aiGeneratedData.experience =
        typeof aiGeneratedData.experience === 'string'
          ? [
              {
                title: aiGeneratedData.experience,
                company: '',
                description: [aiGeneratedData.experience],
              },
            ]
          : [];
    } else {
      aiGeneratedData.experience = aiGeneratedData.experience.map((exp) => {
        if (typeof exp === 'string') {
          return { title: exp, company: '', description: [exp] };
        }
        return exp;
      });
    }

    // Projects check: Agar array nahi hai, toh safe handle karo
    if (!Array.isArray(aiGeneratedData.projects)) {
      aiGeneratedData.projects =
        typeof aiGeneratedData.projects === 'string'
          ? [
              {
                title: aiGeneratedData.projects,
                description: [aiGeneratedData.projects],
              },
            ]
          : [];
    } else {
      aiGeneratedData.projects = aiGeneratedData.projects.map((proj) => {
        if (typeof proj === 'string') {
          return { title: proj, description: [proj] };
        }
        return proj;
      });
    }

    if (!Array.isArray(aiGeneratedData.education)) {
      aiGeneratedData.education =
        typeof aiGeneratedData.education === 'string'
          ? [{ degree: aiGeneratedData.education, institution: '' }]
          : [];
    } else {
      aiGeneratedData.education = aiGeneratedData.education.map((edu) => {
        if (typeof edu === 'string') {
          return { degree: edu, institution: '' };
        }
        return edu;
      });
    }
    applyLinks(aiGeneratedData, links);
    const savedResume = await Resume.findOneAndUpdate(
      { userId: req.user._id, isMaster: true },
      { $set: { ...aiGeneratedData, isMaster: true, userId: req.user._id } },
      { returnDocument: 'after', upsert: true }
    );

    res.status(200).json({
      message: 'Master Resume updated successfully!',
      resumeId: savedResume._id,
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

    if (!resumeId || !jobDescription) {
      return res
        .status(400)
        .json({ message: 'resumeId and jobDescription are required' });
    }

    const masterResume = await Resume.findById(resumeId);

    if (!masterResume) {
      return res
        .status(404)
        .json({ message: 'Master resume not found in database' });
    }

    const tailoredData = await tailorResumeWithAI(
      masterResume.toObject(),
      jobDescription
    );

    const m = masterResume.toObject();
    const norm = (s = '') => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    tailoredData.personalInfo = {
      ...tailoredData.personalInfo,
      ...m.personalInfo,
    };

    tailoredData.projects = (tailoredData.projects || []).map((p) => {
      const orig = (m.projects || []).find(
        (o) => norm(o.title) === norm(p.title)
      );
      return orig
        ? {
            ...p,
            liveLink: orig.liveLink || '',
            githubLink: orig.githubLink || '',
          }
        : p;
    });

    delete tailoredData._id;
    delete tailoredData.id;

    const newTailoredResume = new Resume({
      userId: req.user._id,
      ...tailoredData,
      isMaster: false,
    });

    const savedTailoredResume = await newTailoredResume.save();

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

const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      message: 'Resumes fetched successfully',
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res
      .status(500)
      .json({ message: 'Error fetching resumes', error: error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOne({ _id: id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const downloadResumePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    console.log('DOWNLOAD ID:', id);
    console.log('isMaster:', resume.isMaster);
    console.log('SUMMARY:', resume.summary);

    const pdfBuffer = await generateResumePdf(
      resume.toObject(),
      resume.targetRole
    );

    const fileName =
      `${resume.personalInfo?.fullName || 'Resume'}_${resume.targetRole || 'Master'}.pdf`.replace(
        /\s+/g,
        '_'
      );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download PDF Error:', error);
    res
      .status(500)
      .json({ message: 'Error generating PDF', error: error.message });
  }
};

module.exports = {
  parseResume,
  tailorResume,
  getUserResumes,
  getResumeById,
  downloadResumePdf,
};

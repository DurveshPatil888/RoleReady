const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');

// 1. Zod Schema: Ye humara "Truth Guard" hai
const resumeZodSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    linkedin: z.string().default(''),
    github: z.string().default(''),
    portfolio: z.string().default(''),
  }),
  summary: z.string().default(''),
  skills: z.object({
    frontend: z.array(z.string()).default([]),
    backend: z.array(z.string()).default([]),
    databases: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
  }),
  experience: z
    .array(
      z.object({
        title: z.string().default(''),
        company: z.string().default(''),
        startDate: z.string().default(''),
        endDate: z.string().default(''),
        isCurrent: z.boolean().default(false),
        description: z.array(z.string()).default([]),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        title: z.string().default(''),
        techStack: z.array(z.string()).default([]),
        liveLink: z.string().default(''),
        githubLink: z.string().default(''),
        description: z.array(z.string()).default([]),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().default(''),
        institution: z.string().default(''),
        startDate: z.string().default(''),
        endDate: z.string().default(''),
        score: z.string().default(''),
      })
    )
    .default([]),
});

// 2. Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResumeJSON = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    // AI Prompt: Ise strictly wahi JSON structure mangenge
    const prompt = `
      You are an expert ATS Resume Parser. 
      Extract the information from the following resume text into a strict JSON format.
      Do not hallucinate or invent information. If a field is missing, leave it empty.
      Return ONLY a valid JSON object matching this exact structure, without any markdown formatting:
      
      {
        "personalInfo": { "fullName": "", "email": "", "phone": "", "linkedin": "", "github": "", "portfolio": "" },
        "summary": "",
        "skills": { "frontend": [], "backend": [], "databases": [], "tools": [] },
        "experience": [ { "title": "", "company": "", "startDate": "", "endDate": "", "isCurrent": false, "description": [] } ],
        "projects": [ { "title": "", "techStack": [], "liveLink": "", "githubLink": "", "description": [] } ],
        "education": [ { "degree": "", "institution": "", "startDate": "", "endDate": "", "score": "" } ]
      }

      Resume Text to Parse:
      ${pdfText}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // Markdown (```json) ko hatana taaki JSON crash na ho
    const cleanJsonString = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // String ko raw JSON object me convert kiya
    const rawJson = JSON.parse(cleanJsonString);

    // 3. Zod Validation Check: Agar Gemini ne koi variable miss kiya, toh Zod usko automatically default value (empty string/array) de dega
    const validatedData = resumeZodSchema.parse(rawJson);

    return validatedData;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('AI ne galat format diya ya Zod validation fail ho gayi.');
  }
};

const tailorResumeWithAI = async (masterResumeJSON, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    // Ye raha apna smart "Hack" prompt
    const prompt = `
      You are an expert ATS Resume Optimizer. I will provide you with a base resume in JSON format and a Job Description (JD).
      Your task is to tailor the resume to perfectly match the JD to get a 100% ATS score.
      
      Rules for modification:
      1. Analyze the JD and extract key skills (e.g., React, Node.js, Docker, etc.).
      2. If the JD requires specific skills that are loosely related to the candidate's existing skills, ADD them to the "skills" array naturally.
      3. Modify the "experience" and "projects" bullet points to overlap with the JD's responsibilities. Use keywords from the JD so it looks like an exact match.
      4. Do not completely invent fake companies or degrees, but thoroughly embellish the existing experience to fit the role perfectly.
      5. Return ONLY a valid JSON object matching this exact structure, without any markdown formatting:
      
      {
        "personalInfo": { "fullName": "", "email": "", "phone": "", "linkedin": "", "github": "", "portfolio": "" },
        "summary": "",
        "skills": { "frontend": [], "backend": [], "databases": [], "tools": [] },
        "experience": [ { "title": "", "company": "", "startDate": "", "endDate": "", "isCurrent": false, "description": [] } ],
        "projects": [ { "title": "", "techStack": [], "liveLink": "", "githubLink": "", "description": [] } ],
        "education": [ { "degree": "", "institution": "", "startDate": "", "endDate": "", "score": "" } ]
      }

      Base Resume JSON:
      ${JSON.stringify(masterResumeJSON)}

      Job Description:
      ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    const cleanJsonString = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    const rawJson = JSON.parse(cleanJsonString);

    // Zod se wapas check karwa rahe hain taaki format hamesha perfect rahe
    const validatedData = resumeZodSchema.parse(rawJson);

    return validatedData;
  } catch (error) {
    console.error('Tailoring AI Error:', error);
    throw new Error('AI se resume tailor karne me error aagaya');
  }
};

// Dono functions ko export karna mat bhoolna
module.exports = { generateResumeJSON, tailorResumeWithAI };

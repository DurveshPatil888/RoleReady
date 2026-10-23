const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');

const puppeteer = require('puppeteer');

const resumeZodSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().describe('Full name of the candidate'),
    email: z.string().describe('Email address'),
    phone: z.string().describe('Phone number'),
    linkedin: z.string().describe('LinkedIn profile URL'),
    github: z.string().describe('GitHub profile URL'),
    portfolio: z.string().describe('Portfolio website URL'),
  }),
  summary: z.string().describe('A professional summary or objective'),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    databases: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  experience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        isCurrent: z.boolean(),
        description: z
          .array(z.string())
          .describe(
            'Bullet points describing responsibilities and achievements'
          ),
      })
    )
    .describe('Work experience history'),
  projects: z
    .array(
      z.object({
        title: z.string(),
        techStack: z.array(z.string()),
        liveLink: z.string(),
        githubLink: z.string(),
        description: z
          .array(z.string())
          .describe('Bullet points describing the project'),
      })
    )
    .describe('Personal or professional projects'),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        score: z.string().describe('CGPA, percentage, or grade'),
      })
    )
    .describe('Educational background'),
});

// $ref hata do taaki Gemini ko flat, simple schema mile
const toSchema = (zodSchema) => {
  const schema = z.toJSONSchema(zodSchema);
  delete schema.$schema; // Gemini ko ye field nahi chahiye
  return schema;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateResumeJSON = async (pdfText) => {
  try {
    const prompt = `
      You are an expert ATS Resume Parser. Extract information from the resume text into the exact JSON structure required.

      You MUST return a JSON object with these exact keys:
      - personalInfo: an OBJECT { fullName, email, phone, linkedin, github, portfolio } (never a string)
      - summary: string
      - skills: { frontend: [], backend: [], databases: [], tools: [] }
      - experience: array of objects, where each object MUST have: { title, company, startDate, endDate, isCurrent, description: [] }
      - projects: array of objects, where each object MUST have: { title, techStack: [], liveLink, githubLink, description: [] }
      - education: array of objects, where each object MUST have: { degree, institution, startDate, endDate, score }

      CRITICAL: DO NOT return plain strings inside arrays. Every experience, project, and education item must be a proper JSON object with the exact keys mentioned above.
      If a value is not found in the resume, use an empty string "" (or [] for arrays, false for booleans).

      Resume Text:
      ${pdfText}
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toSchema(resumeZodSchema),
        temperature: 0.1,
      },
    });

    const raw = JSON.parse(response.text);
    console.log('RAW AI OUTPUT:', JSON.stringify(raw, null, 2));

    const result = resumeZodSchema.safeParse(raw);
    if (!result.success) {
      console.error(
        'Zod validation failed:',
        JSON.stringify(result.error.issues, null, 2)
      );
      throw new Error('AI returned invalid structure');
    }

    return result.data;
  } catch (error) {
    console.error('AI Parsing Service Error:', error);
    throw new Error('AI parsing failed.');
  }
};

const prompt = `
  You are tailoring a real candidate's resume for a specific job. Write like a thoughtful human, not like an AI.

  TRUTH RULES (strict):
  - filter the resume content based on job description do not earse old content but shaped like the job description.
  - Never invent tools, metrics, responsibilities, companies, dates or degrees.
  - Keep every number exactly as in the base resume (150+, 1000+, 30%, 25%, etc.).
  - Keep the same JSON structure and keys. Do not change any URLs.

  TAILORING RULES:
  1. Read the JD and pick the 8-10 most important keywords that easily shortlist the resume.
  2. Summary: rewrite in 2 plain sentences aimed at this role. No claims that are not in the resume.
  3. Skills: put JD-relevant skills first. Add a skill only if it is already in the base resume.
  4. Experience and projects: put the most JD-relevant bullet first, and rewrite each bullet using the JD's vocabulary where it is truthful.
  5. Keep all projects. Put the most relevant ones first.

  HUMAN WRITING RULES:
  - Use simple verbs: built, fixed, added, wrote, connected, cut, shipped.
  - Avoid: leveraging, spearheaded, robust, seamless, scalable, cutting-edge, architected, utilizing, advanced, orchestrated.
  - Vary how bullets start. No two bullets in a row with the same first word.
  - Each bullet: what you did + how/with what + result (only if the base resume has one). Max ~20 words.
  - Do not copy sentences from the JD.

  Base Resume JSON:
  ${JSON.stringify(masterResumeJSON)}

  Job Description:
  ${jobDescription}
`;

// --- PUPPETEER PDF GENERATION LOGIC ---

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close(); // error aaye tab bhi browser band hoga
  }
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const link = (url, text) => (url ? `<a href="${esc(url)}">${text}</a>` : '');
const bullets = (arr = []) =>
  `<ul>${arr.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

const renderResumeHtml = (r) => {
  const p = r.personalInfo || {};
  const header = [
    p.phone && esc(p.phone),
    p.email && esc(p.email),
    link(p.linkedin, 'LinkedIn'),
    link(p.github, 'GitHub'),
    link(p.portfolio, 'Portfolio'),
  ]
    .filter(Boolean)
    .join(' | ');

  const skills = Object.entries(r.skills || {})
    .filter(([, v]) => v?.length)
    .map(([k, v]) => `<div><b>${esc(k)}:</b> ${v.map(esc).join(', ')}</div>`)
    .join('');

  const experience = (r.experience || [])
    .map(
      (e) => `
    <div class="row"><b>${esc(e.title)} - ${esc(e.company)}</b>
    <span>${esc(e.startDate)} - ${e.isCurrent ? 'Present' : esc(e.endDate)}</span></div>
    ${bullets(e.description)}`
    )
    .join('');

  const projects = (r.projects || [])
    .map(
      (pr) => `
    <div class="row"><b>${esc(pr.title)}</b>
    <span>${[link(pr.liveLink, 'Live'), link(pr.githubLink, 'GitHub')].filter(Boolean).join(' | ')}</span></div>
    ${bullets(pr.description)}`
    )
    .join('');

  const education = (r.education || [])
    .map(
      (ed) => `
    <div class="row"><b>${esc(ed.degree)} - ${esc(ed.institution)}</b>
    <span>${esc(ed.startDate)} - ${esc(ed.endDate)}</span></div>`
    )
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.35; color: #000; }
    h1 { text-align: center; font-size: 20pt; margin: 0; text-transform: uppercase; }
    .contact { text-align: center; margin-bottom: 8px; }
    h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1px solid #000; margin: 10px 0 4px; }
    a { color: #000; text-decoration: none; }
    ul { margin: 2px 0 6px 16px; padding: 0; }
    .row { display: flex; justify-content: space-between; margin-top: 4px; }
  </style></head><body>
    <h1>${esc(p.fullName)}</h1>
    <div class="contact">${header}</div>
    <h2>Summary</h2><div>${esc(r.summary)}</div>
    <h2>Skills</h2>${skills}
    <h2>Experience</h2>${experience}
    <h2>Projects</h2>${projects}
    <h2>Education</h2>${education}
  </body></html>`;
};

const generateResumePdf = async (resumeData) => {
  try {
    return await generatePdfFromHtml(renderResumeHtml(resumeData));
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF.');
  }
};
module.exports = { generateResumeJSON, tailorResumeWithAI, generateResumePdf };

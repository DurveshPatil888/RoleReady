//this file is used to extract links from a PDF buffer and apply them to the resume data.

async function extractLinks(buffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const links = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const annots = await page.getAnnotations();

    for (const a of annots) {
      if (a.subtype === 'Link' && a.url && !a.url.startsWith('mailto:')) {
        links.push(a.url);
      }
    }
  }
  return links;
}

const norm = (s = '') => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function applyLinks(data, links) {
  const linkedin = links.find((l) => l.includes('linkedin.com')) || '';
  const github =
    links.find((l) => /^https?:\/\/github\.com\/[^/]+\/?$/.test(l)) || '';
  const portfolio =
    links.find(
      (l) => !l.includes('linkedin.com') && !l.includes('github.com')
    ) || '';

  data.personalInfo = { ...data.personalInfo, linkedin, github, portfolio };

  data.projects = (data.projects || []).map((p) => {
    const match = links.find((l) => {
      const repo = norm(l.split('/').pop());
      return l.includes('github.com') && repo && norm(p.title).includes(repo);
    });
    return { ...p, githubLink: match || p.githubLink || '' };
  });

  return data;
}

module.exports = { extractLinks, applyLinks };

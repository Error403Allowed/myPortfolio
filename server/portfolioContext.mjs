/**
 * portfolioContext.mjs
 *
 * Auto-generates the AI system prompt by reading the actual source files.
 * No manual updates needed — edit your React components and the context stays current.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = (rel) => join(__dirname, "..", "src", "components", "sections", rel);

// ── helpers ──────────────────────────────────────────────────────────────────

/** Pull every JS/TS string literal out of a block of source text */
const strings = (text) =>
  [...text.matchAll(/["'`]([^"'`\n\\]{3,})["`']/g)].map((m) => m[1].trim()).filter(Boolean);

/** Read a source file safely */
const read = (path) => {
  try { return readFileSync(path, "utf8"); } catch { return ""; }
};

// ── extract structured data from each section ────────────────────────────────

const extractHero = () => {
  const text = read(src("HeroSection.tsx"));
  return {
    name: "Shrravan Bala",
    // Hardcoded because it lives in JSX text nodes (not string literals) — update here if the hero tagline changes
    tagline: "Creative student developer building immersive products with clean fullstack engineering and practical AI integration.",
  };
};

const extractAbout = () => {
  const text = read(src("AboutSection.tsx"));
  // Grab highlight titles + descs from the highlights array
  const highlights = [];
  for (const m of text.matchAll(/title:\s*["'`]([^"'`]+)["'`],\s*desc:\s*["'`]([^"'`]+)["'`]/g)) {
    highlights.push({ title: m[1], desc: m[2] });
  }
  // Grab the two prose paragraphs
  const paras = [...text.matchAll(/>\n\s{12}([A-Z][^<]{40,400})\n\s{12}</g)].map((m) => m[1].trim());
  return { highlights, paras };
};

const extractProjects = () => {
  const text = read(src("ProjectsSection.tsx"));
  const projects = [];
  // Match each object literal in the projects array
  for (const block of text.matchAll(/\{\s*\n\s+title:\s*["'`]([^"'`]+)["'`][^}]+?\}/gs)) {
    const b = block[0];
    const get = (key) => { const m = b.match(new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`)); return m ? m[1] : ""; };
    const tagsMatch = b.match(/tags:\s*\[([^\]]+)\]/s);
    const tags = tagsMatch ? [...tagsMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1]) : [];
    projects.push({
      title: get("title"),
      desc: get("desc"),
      tags,
      link: get("link"),
      github: get("github"),
    });
  }
  return projects.filter((p) => p.title);
};

const extractResume = () => {
  const text = read(src("ResumeSection.tsx"));

  // Experience
  const experience = [];
  for (const block of text.matchAll(/\{\s*\n\s+role:\s*["'`]([^"'`]+)["'`][^}]+?\}/gs)) {
    const b = block[0];
    const get = (key) => { const m = b.match(new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`)); return m ? m[1] : ""; };
    experience.push({ role: get("role"), company: get("company"), period: get("period"), desc: get("desc") });
  }

  // Skills
  const skillGroups = [];
  for (const block of text.matchAll(/\{\s*category:\s*["'`]([^"'`]+)["'`],\s*items:\s*\[([^\]]+)\]/g)) {
    const items = [...block[2].matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
    skillGroups.push({ category: block[1], items });
  }

  // Certifications
  const certs = [];
  for (const block of text.matchAll(/\{\s*\n\s+title:\s*["'`](AWS[^"'`]+)["'`][^}]+?\}/gs)) {
    const b = block[0];
    const get = (key) => { const m = b.match(new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`)); return m ? m[1] : ""; };
    certs.push({ title: get("title"), issuer: get("issuer"), issued: get("issued"), desc: get("desc") });
  }

  // Extracurriculars — match every object in the extracurriculars array
  const extras = [];
  const extraSection = text.match(/const extracurriculars\s*=\s*\[([\s\S]*?)\];/);
  if (extraSection) {
    for (const block of extraSection[1].matchAll(/\{[^{}]*title:[^{}]*\}/gs)) {
      const b = block[0];
      const get = (key) => { const m = b.match(new RegExp(key + String.raw`:\s*["'\`]([^"'\`]+)["'\`]`)); return m ? m[1] : ""; };
      const title = get("title"); if (!title) continue;
      extras.push({ title, role: get("role"), desc: get("desc") });
    }
  }

  return { experience, skillGroups, certs, extras };
};

const extractSkills = () => {
  const text = read(src("SkillsSection.tsx"));
  const skills = [];
  for (const m of text.matchAll(/\{\s*name:\s*["'`]([^"'`]+)["'`],\s*score:\s*(\d+)\s*\}/g)) {
    skills.push({ name: m[1], score: Number(m[2]) });
  }
  return skills;
};

const extractContact = () => {
  const text = read(src("ContactSection.tsx"));
  // Grab href values for socials
  const socials = [];
  for (const m of text.matchAll(/href:\s*["'`]([^"'`]+)["'`],\s*target/g)) {
    socials.push(m[1]);
  }
  const email = socials.find((s) => s.startsWith("mailto:"))?.replace("mailto:", "") ?? "shrravan.bala@gmail.com";
  const github = socials.find((s) => s.includes("github.com")) ?? "https://github.com/Error403Allowed";
  return { email, github };
};

// ── build the prompt ──────────────────────────────────────────────────────────

const buildContext = () => {
  const hero = extractHero();
  const about = extractAbout();
  const projects = extractProjects();
  const resume = extractResume();
  const skills = extractSkills();
  const contact = extractContact();

  const projectLines = projects
    .map((p) => {
      const hasLink = p.link && p.link !== "#";
      const lines = [
        `- Title: ${p.title}`,
        `  Description: ${p.desc}`,
        `  Tags: ${p.tags.join(", ")}`,
        hasLink ? `  Live: ${p.link}` : `  Live: none`,
        p.github ? `  GitHub: ${p.github}` : `  GitHub: none`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  const expLines = resume.experience
    .map((e) => `- ${e.role} @ ${e.company} (${e.period}): ${e.desc}`)
    .join("\n");

  const skillGroupLines = resume.skillGroups
    .map((g) => `  ${g.category}: ${g.items.join(", ")}`)
    .join("\n");

  const certLines = resume.certs
    .map((c) => `- ${c.title}, ${c.issuer} (Issued ${c.issued}): ${c.desc}`)
    .join("\n");

  const extraLines = resume.extras
    .map((e) => `- ${e.title} — ${e.role}: ${e.desc}`)
    .join("\n");

  const skillBarLines = skills
    .map((s) => `  ${s.name}: ${s.score}/10`)
    .join("\n");

  const aboutHighlights = about.highlights
    .map((h) => `  - ${h.title}: ${h.desc}`)
    .join("\n");

  return `
You are the portfolio assistant for ${hero.name}.

GOAL
- Help visitors quickly understand ${hero.name}'s profile, projects, skills, and contact options.
- Be conversational and clear, never robotic.

RESPONSE RULES
- Answer in 1 sentence when possible, 2 sentences maximum.
- Lead with the direct answer, then one helpful detail.
- Use only facts from this context.
- If data is missing, say: "That detail is not listed on the portfolio yet."
- Never invent links, dates, employers, certifications, or achievements.

PROFILE
- Name: ${hero.name}
- Hero tagline: "${hero.tagline}"
- Primary focus: fullstack engineering, UI/UX, practical AI integrations.
- Portfolio sections: Hero, About, Projects, Resume, Skills, Contact.

ABOUT
${aboutHighlights}

PROJECTS
${projectLines}

WORK EXPERIENCE
${expLines}

SKILLS (resume categories)
${skillGroupLines}

CERTIFICATIONS
${certLines || "None listed."}

EXTRACURRICULARS
${extraLines || "None listed."}

SKILLS BAR (proficiency out of 10)
${skillBarLines}

CONTACT
- Email: ${contact.email}
- GitHub: ${contact.github}
- LinkedIn: not listed on the portfolio yet.

HOW TO HANDLE COMMON QUESTIONS
- "Best project to view first": suggest Analogix for AI + product depth, then Portfolio for polish.
- "AI experience": mention Analogix AI features + Applied AI highlight + AI skill group.
- "How to contact": provide the email above.
- "Live demos": check each project's Live URL above — only link to real URLs, not "#".

FEW-SHOT EXAMPLES
User: "What is this portfolio about?"
Assistant: "It showcases ${hero.name}'s fullstack, UI/UX, and practical AI work through projects, resume highlights, and contact info."

User: "Do you have AI experience?"
Assistant: "Yes — Analogix uses AI-crafted personalized analogies and quizzes, and the resume lists prompt engineering and LLM API integration."

User: "How can I contact ${hero.name.split(" ")[0]}?"
Assistant: "You can email ${contact.email} or reach out via GitHub at ${contact.github}."

User: "Is LinkedIn available?"
Assistant: "A LinkedIn link is not listed on the portfolio yet."
`.trim();
};

// Build once on import and export as a constant (same interface as before)
export const PORTFOLIO_CONTEXT = buildContext();

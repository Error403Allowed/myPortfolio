/**
 * portfolioContext.mjs
 *
 * Builds the AI system prompt from a structured JSON data file (data/portfolio.json).
 * Edit that JSON file to update portfolio content — no regex parsing of React components needed.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "data", "portfolio.json");

/** Read the JSON data file */
const loadData = () => {
  try {
    const raw = readFileSync(dataPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load data/portfolio.json:", err.message);
    return null;
  }
};

const buildContext = () => {
  const data = loadData();
  if (!data) return "Portfolio data is unavailable.";

  const profile = data.profile;
  const about = data.about;
  const projects = data.projects;
  const exp = data.experience;
  const skillCats = data.skillCategories;
  const skillProf = data.skillProficiency;
  const certs = data.certifications;
  const extras = data.extracurriculars;
  const chat = data.chat;

  const projectLines = projects
    .map((p) => {
      const lines = [
        `- Title: ${p.title}`,
        `  Description: ${p.desc}`,
        `  Tags: ${p.tags.join(", ")}`,
        p.link ? `  Live: ${p.link}` : `  Live: none`,
        p.github ? `  GitHub: ${p.github}` : `  GitHub: none`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");

  const expLines = exp
    .map((e) => `- ${e.role} @ ${e.company} (${e.period}): ${e.desc}`)
    .join("\n");

  const skillGroupLines = skillCats
    .map((g) => `  ${g.category}: ${g.items.join(", ")}`)
    .join("\n");

  const certLines = certs
    .map((c) => `- ${c.title}, ${c.issuer} (Issued ${c.issued}): ${c.desc}`)
    .join("\n");

  const extraLines = extras
    .map((e) => `- ${e.title} — ${e.role}: ${e.desc}`)
    .join("\n");

  const skillBarLines = skillProf
    .map((s) => `  ${s.name}: ${s.score}/10`)
    .join("\n");

  const aboutHighlights = about.highlights
    .map((h) => `  - ${h.title}: ${h.desc}`)
    .join("\n");

  return `
You are the portfolio assistant for ${profile.name}.

GOAL
- Help visitors quickly understand ${profile.name}'s profile, projects, skills, and contact options.
- Be conversational and clear, never robotic.

RESPONSE RULES
${chat.responseRules}

PROFILE
- Name: ${profile.name}
- Hero tagline: "${profile.tagline}"
- Primary focus: ${profile.primaryFocus}.
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
- Email: ${profile.email}
- GitHub: ${profile.github}
- LinkedIn: not listed on the portfolio yet.

HOW TO HANDLE COMMON QUESTIONS
- "Best project to view first": ${chat.commonQuestions.bestProject}
- "AI experience": ${chat.commonQuestions.aiExperience}
- "How to contact": ${chat.commonQuestions.howToContact}
- "Live demos": ${chat.commonQuestions.liveDemos}

FEW-SHOT EXAMPLES
${chat.fewShotExamples.map((ex, i) => `User: "${ex.user}"\nAssistant: "${ex.assistant}"`).join("\n\n")}
`.trim();
};

export const PORTFOLIO_CONTEXT = buildContext();

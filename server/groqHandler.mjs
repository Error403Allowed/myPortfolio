import { PORTFOLIO_CONTEXT } from "./portfolioContext.mjs";

const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const CHAT_ROUTE = "/api/chat";
const MAX_BODY_BYTES = 1_000_000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_DEFAULT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const MAX_RESPONSE_SENTENCES = 2;
const MAX_RESPONSE_WORDS = 45;
const MAX_OUTPUT_TOKENS = 90;

const RESPONSE_STYLE_PROMPT = `
Response style rules:
- Sound natural and conversational, not robotic.
- Keep responses short and clear: 1 sentence preferred, 2 sentences maximum.
- Answer the user's direct question first.
- If relevant portfolio info is missing, say so plainly in one short sentence.
`.trim();

const writeJson = (res, statusCode, payload, corsHeaders) => {
  res.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
};

const readJsonBody = async (req) => {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      throw new Error("Request body too large.");
    }
  }
  return body ? JSON.parse(body) : {};
};

const parseKeyPool = (env) => {
  const numberedKeys = Object.entries(env)
    .filter(([name, value]) => name.startsWith("GROQ_API_KEY") && typeof value === "string" && value.trim())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value.trim());

  return [...new Set(numberedKeys)];
};

const sanitizeMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((message) => message.content.length > 0);
};

const clampToSentenceLimit = (text, maxSentences) => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return cleaned;
  const matches = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  if (!matches) return cleaned;
  return matches.slice(0, maxSentences).map((s) => s.trim()).join(" ") || cleaned;
};

const clampToWordLimit = (text, maxWords) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
};

const finalizeAssistantReply = (text) => {
  const normalized = clampToWordLimit(clampToSentenceLimit(text, MAX_RESPONSE_SENTENCES), MAX_RESPONSE_WORDS).trim();
  if (!normalized) return normalized;
  if (/[.!?]$/.test(normalized)) return normalized;
  return `${normalized}.`;
};

const requestChatCompletion = async (apiKey, messages, model, systemPrompt) => {
  try {
    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: RESPONSE_STYLE_PROMPT },
          ...messages,
        ],
      }),
    });

    const payload = await response.json().catch(() => ({}));
    const content = payload?.choices?.[0]?.message?.content;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: typeof payload?.error?.message === "string" ? payload.error.message : "Groq API request failed.",
      };
    }

    if (typeof content !== "string" || !content.trim()) {
      return { ok: false, status: 502, error: "Groq returned an empty response." };
    }

    return { ok: true, status: 200, answer: finalizeAssistantReply(content) };
  } catch {
    return { ok: false, status: 503, error: "Unable to reach Groq." };
  }
};

export const createChatHandler = (env = process.env) => {
  const model = env.GROQ_MODEL ?? GROQ_DEFAULT_MODEL;
  const allowedOrigin = env.CHAT_ALLOWED_ORIGIN ?? "*";
  const systemPrompt = env.CHAT_SYSTEM_PROMPT ?? PORTFOLIO_CONTEXT;
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  let rotationCursor = 0;

  const keyOrderForRequest = (keys) => {
    const start = rotationCursor % keys.length;
    rotationCursor = (rotationCursor + 1) % keys.length;
    return keys.slice(start).concat(keys.slice(0, start));
  };

  return async (req, res) => {
    if (!req.url || !req.url.startsWith(CHAT_ROUTE)) return false;

    if (req.method === "OPTIONS") {
      res.writeHead(204, corsHeaders);
      res.end();
      return true;
    }

    if (req.method !== "POST") {
      writeJson(res, 405, { error: "Method not allowed." }, corsHeaders);
      return true;
    }

    const keys = parseKeyPool(env);
    if (keys.length === 0) {
      writeJson(res, 500, { error: "No Groq API keys configured. Add GROQ_API_KEY_1 to your .env file." }, corsHeaders);
      return true;
    }

    let payload;
    try {
      payload = await readJsonBody(req);
    } catch (error) {
      writeJson(res, 400, { error: error instanceof Error ? error.message : "Invalid JSON request body." }, corsHeaders);
      return true;
    }

    const messages = sanitizeMessages(payload?.messages);
    if (messages.length === 0) {
      writeJson(res, 400, { error: "A non-empty messages array is required." }, corsHeaders);
      return true;
    }

    const orderedKeys = keyOrderForRequest(keys);
    let lastError = "AI service unavailable.";

    for (const key of orderedKeys) {
      const result = await requestChatCompletion(key, messages, model, systemPrompt);
      if (result.ok) {
        writeJson(res, 200, { answer: result.answer }, corsHeaders);
        return true;
      }
      lastError = result.error;
      if (RETRYABLE_STATUS_CODES.has(result.status) || result.status === 401 || result.status === 403) continue;
      writeJson(res, result.status, { error: result.error }, corsHeaders);
      return true;
    }

    writeJson(res, 503, { error: lastError }, corsHeaders);
    return true;
  };
};

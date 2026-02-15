import { createServer } from "node:http";
import { PORTFOLIO_CONTEXT } from "./portfolioContext.mjs";

const PORT = Number(process.env.CHAT_PROXY_PORT ?? 8787);
const HF_MODEL = process.env.HF_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct";
const ALLOWED_ORIGIN = process.env.CHAT_ALLOWED_ORIGIN ?? "*";
const SYSTEM_PROMPT = process.env.CHAT_SYSTEM_PROMPT ?? PORTFOLIO_CONTEXT;
const RESPONSE_STYLE_PROMPT = `
Response style rules:
- Sound natural and conversational, not robotic.
- Keep responses short and clear: 1 sentence preferred, 2 sentences maximum.
- Answer the user's direct question first.
- If relevant portfolio info is missing, say so plainly in one short sentence.
`.trim();

const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
let rotationCursor = 0;
const CHAT_ROUTE = "/api/chat";
const MAX_BODY_BYTES = 1_000_000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const HUGGING_FACE_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const MAX_RESPONSE_SENTENCES = 2;
const MAX_RESPONSE_WORDS = 45;
const MAX_OUTPUT_TOKENS = 90;

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const writeJson = (res, statusCode, payload) => {
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

const parseKeyPool = () => {
  const numberedKeys = Object.entries(process.env)
    .filter(([name, value]) => name.startsWith("API_KEY_") && typeof value === "string" && value.trim())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value.trim());

  return [...new Set(numberedKeys)];
};

const keyOrderForRequest = (keys) => {
  const start = rotationCursor % keys.length;
  rotationCursor = (rotationCursor + 1) % keys.length;
  return keys.slice(start).concat(keys.slice(0, start));
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

  const shortened = matches
    .slice(0, maxSentences)
    .map((segment) => segment.trim())
    .join(" ");

  return shortened || cleaned;
};

const clampToWordLimit = (text, maxWords) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
};

const finalizeAssistantReply = (text) => {
  const withSentenceLimit = clampToSentenceLimit(text, MAX_RESPONSE_SENTENCES);
  const withWordLimit = clampToWordLimit(withSentenceLimit, MAX_RESPONSE_WORDS);
  const normalized = withWordLimit.trim();

  if (!normalized) return normalized;
  if (/[.!?]$/.test(normalized)) return normalized;
  return `${normalized}.`;
};

const requestChatCompletion = async (apiKey, messages) => {
  try {
    const response = await fetch(HUGGING_FACE_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        temperature: 0.3,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
        error:
          typeof payload?.error?.message === "string"
            ? payload.error.message
            : "Hugging Face API request failed.",
      };
    }

    if (typeof content !== "string" || !content.trim()) {
      return {
        ok: false,
        status: 502,
        error: "Hugging Face returned an empty response.",
      };
    }

    return {
      ok: true,
      status: 200,
      answer: finalizeAssistantReply(content),
    };
  } catch {
    return {
      ok: false,
      status: 503,
      error: "Unable to reach Hugging Face.",
    };
  }
};

const handleChatRequest = async (req, res) => {
  const keys = parseKeyPool();
  if (keys.length === 0) {
    writeJson(res, 500, { error: "No API keys configured. Add API_KEY_1 and API_KEY_2." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    writeJson(res, 400, {
      error: error instanceof Error ? error.message : "Invalid JSON request body.",
    });
    return;
  }

  const messages = sanitizeMessages(payload?.messages);
  if (messages.length === 0) {
    writeJson(res, 400, { error: "A non-empty messages array is required." });
    return;
  }

  const orderedKeys = keyOrderForRequest(keys);
  let lastError = "AI service unavailable.";

  for (const key of orderedKeys) {
    const result = await requestChatCompletion(key, messages);

    if (result.ok) {
      writeJson(res, 200, { answer: result.answer });
      return;
    }

    lastError = result.error;
    if (RETRYABLE_STATUS_CODES.has(result.status) || result.status === 401 || result.status === 403) {
      continue;
    }

    writeJson(res, result.status, { error: result.error });
    return;
  }

  writeJson(res, 503, { error: lastError });
};

const server = createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith(CHAT_ROUTE)) {
    writeJson(res, 404, { error: "Not found." });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    writeJson(res, 405, { error: "Method not allowed." });
    return;
  }
  await handleChatRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Chat proxy running at http://localhost:${PORT}${CHAT_ROUTE}`);
});

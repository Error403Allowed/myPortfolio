import { createChatHandler } from "../server/chatHandler.mjs";

const handleChat = createChatHandler(process.env);

export default async function handler(req, res) {
  const handled = await handleChat(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Not found." }));
  }
}

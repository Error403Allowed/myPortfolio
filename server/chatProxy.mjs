import { createServer } from "node:http";
import { createChatHandler } from "./chatHandler.mjs";

const PORT = Number(process.env.CHAT_PROXY_PORT ?? 8787);
const handleChatRequest = createChatHandler(process.env);

const server = createServer(async (req, res) => {
  const handled = await handleChatRequest(req, res);
  if (!handled) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Not found." }));
  }
});

server.listen(PORT, () => {
  console.log(`Chat proxy running at http://localhost:${PORT}${CHAT_ROUTE}`);
});

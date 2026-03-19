import { createEmailHandler } from "../server/emailHandler.mjs";

const handleEmail = createEmailHandler(process.env);

export default async function handler(req, res) {
  const handled = await handleEmail(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Not found." }));
  }
}

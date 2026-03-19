// Your Formspree endpoint - get this from https://formspree.io/
// 1. Go to https://formspree.io/ and create a free account
// 2. Create a new form and copy your endpoint URL
// 3. Replace the URL below with your actual endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzwdera";

const ALLOWED_ORIGIN = process.env.EMAIL_ALLOWED_ORIGIN ?? "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  if (!req.url || !req.url.startsWith("/api/email")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  if (!FORMSPREE_ENDPOINT) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Formspree endpoint not configured" }));
    return;
  }

  try {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const data = JSON.parse(body);

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    if (response.ok) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: true, message: "Email sent successfully!" }));
    } else {
      const error = await response.json().catch(() => ({ message: "Failed to send email" }));
      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: error.message || "Failed to send email" }));
    }
  } catch (error) {
    console.error("Formspree error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to send email. Please try again later." }));
  }
}

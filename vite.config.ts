import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-ignore
import { createChatHandler } from "./server/chatHandler.mjs";
// @ts-ignore
import emailHandler from "./server/emailHandler.mjs";

const chatApiPlugin = (env: Record<string, string>): Plugin => ({
  name: "chat-api-middleware",
  configureServer(server) {
    const handleChatRequest = createChatHandler(env);

    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith("/api/chat")) {
        const handled = await handleChatRequest(req, res);
        if (handled) return;
      }

      next();
    });
  },
});

const emailApiPlugin = (): Plugin => ({
  name: "email-api-middleware",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith("/api/email")) {
        await emailHandler(req, res);
        return;
      }

      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), chatApiPlugin(env), emailApiPlugin(env), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

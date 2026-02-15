import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, SendHorizontal, X } from "lucide-react";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

interface ChatApiPayload {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  } | string;
}

const HF_CHAT_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const HF_API_KEYS = (import.meta.env.VITE_HF_API_KEYS ?? "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);
const HF_MODEL = import.meta.env.VITE_HF_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct";
const HF_KEY_ROTATION_SECONDS = Number(import.meta.env.VITE_HF_KEY_ROTATION_SECONDS ?? 15);
const MAX_HISTORY_MESSAGES = 12;
const FALLBACK_ANSWER = "I couldn't generate a useful response for that yet.";
const NETWORK_ERROR_ANSWER =
  "I'm having trouble reaching the AI service right now. Please try again in a few seconds.";
const THINKING_TEXT = "Thinking...";
const MISSING_KEY_ANSWER =
  "Missing `VITE_HF_API_KEY` (or `VITE_HF_API_KEYS`) in `.env`, so chat is disabled right now.";
const SYSTEM_PROMPT = `
You are the portfolio assistant for Shrravan Bala.
- Keep responses short and clear: 1 sentence preferred, 2 sentences max.
- Answer the user directly first.
- Focus on Shrravan's projects, skills, and portfolio context.
- If details are missing, say that the detail is not listed yet.
`.trim();

const SUGGESTED_PROMPTS = [
  "What should I know about this portfolio in 30 seconds?",
  "Which projects are most relevant for a frontend internship?",
  "What AI features has Shrravan built so far?",
];

const createMessage = (role: Role, content: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  role,
  content,
});

const getApiErrorMessage = (payload: ChatApiPayload) => {
  if (typeof payload.error === "string") return payload.error;
  return payload.error?.message ?? "Chat request failed.";
};

const resolveApiKey = () => {
  const keyPool = HF_API_KEYS.length > 0 ? HF_API_KEYS : HF_API_KEY?.trim() ? [HF_API_KEY.trim()] : [];
  if (keyPool.length === 0) return null;

  const intervalMs = Math.max(10, HF_KEY_ROTATION_SECONDS) * 1000;
  const slot = Math.floor(Date.now() / intervalMs);
  return keyPool[slot % keyPool.length];
};

const getMessageBubbleClassName = (role: Role) =>
  `max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
    role === "user"
      ? "ml-auto bg-primary text-primary-foreground"
      : "mr-auto bg-secondary/70 text-foreground border border-white/10"
  }`;

const PortfolioAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "Hey, I'm your AI assistant. Ask me about Shrravan's AI work, projects, tech stack, or how to collaborate.",
    ),
  ]);

  const messageListRef = useRef<HTMLDivElement>(null);
  const canSend = inputValue.trim().length > 0 && !isSending;
  const shouldShowSuggestions = useMemo(
    () => messages.every((message) => message.role !== "user"),
    [messages],
  );

  useEffect(() => {
    if (!isOpen) return;
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, messages]);

  const sendMessage = async (rawInput: string) => {
    const content = rawInput.trim();
    if (!content || isSending) return;

    const userMessage = createMessage("user", content);
    const messageHistory = [...messages, userMessage]
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => ({ role: message.role, content: message.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    const activeApiKey = resolveApiKey();
    if (!activeApiKey) {
      setMessages((prev) => [...prev, createMessage("assistant", MISSING_KEY_ANSWER)]);
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(HF_CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeApiKey}`,
        },
        body: JSON.stringify({
          model: HF_MODEL,
          temperature: 0.3,
          max_tokens: 90,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messageHistory],
        }),
      });

      const data: ChatApiPayload = await response.json().catch(() => ({}));
      const answer = data.choices?.[0]?.message?.content?.trim() || FALLBACK_ANSWER;

      if (!response.ok) {
        const rawError = getApiErrorMessage(data);
        const statusError =
          response.status === 401 || response.status === 403
            ? "Invalid Hugging Face API key. Update `VITE_HF_API_KEY`."
            : `AI request failed: ${rawError}`;
        setMessages((prev) => [...prev, createMessage("assistant", statusError)]);
        return;
      }

      setMessages((prev) => [...prev, createMessage("assistant", answer)]);
    } catch {
      setMessages((prev) => [...prev, createMessage("assistant", NETWORK_ERROR_ANSWER)]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="w-[min(92vw,370px)] h-[min(72vh,520px)] glass glow-border rounded-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.92, y: 16, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0, transformOrigin: "bottom right" }}
            exit={{ opacity: 0, scale: 0.92, y: 16, transformOrigin: "bottom right" }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Ask me anything</p>
              </div>
            </div>

            <div ref={messageListRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={getMessageBubbleClassName(message.role)}>
                  {message.content}
                </div>
              ))}

              {isSending && (
                <div className={getMessageBubbleClassName("assistant")}>{THINKING_TEXT}</div>
              )}
            </div>

            {shouldShowSuggestions && (
              <div className="px-4 pb-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void sendMessage(prompt)}
                      disabled={isSending}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary/70 border border-white/10 text-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 border-t border-white/10">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage(inputValue);
                    }
                  }}
                  placeholder="Ask anything..."
                  className="flex-1 max-h-28 resize-none rounded-xl bg-secondary/60 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <button
                  onClick={() => void sendMessage(inputValue)}
                  disabled={!canSend}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Send message"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="glass glow-border w-12 h-12 rounded-full flex items-center justify-center hover:glow-border-strong transition-all duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary" />
        ) : (
          <MessageCircle className="w-5 h-5 text-primary" />
        )}
      </button>
    </div>
  );
};

export default PortfolioAssistantWidget;

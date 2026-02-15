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
  answer?: string;
  error?: string;
}

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL ?? "/api/chat";
const MAX_HISTORY_MESSAGES = 12;
const FALLBACK_ANSWER = "I couldn't generate a useful response for that yet.";
const THINKING_TEXT = "Thinking...";
const PROXY_OFFLINE_HINT =
  "AI backend is not reachable. Restart `npm run dev` and try again.";

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

  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen]);

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

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messageHistory }),
      });

      const data: ChatApiPayload = await response.json().catch(() => ({}));
      const answer =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer.trim()
          : FALLBACK_ANSWER;

      if (!response.ok) {
        const errorMessage = data.error ?? "Chat request failed.";
        setMessages((prev) => [...prev, createMessage("assistant", `AI request failed: ${errorMessage}`)]);
        return;
      }

      setMessages((prev) => [...prev, createMessage("assistant", answer)]);
    } catch {
      setMessages((prev) => [...prev, createMessage("assistant", PROXY_OFFLINE_HINT)]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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

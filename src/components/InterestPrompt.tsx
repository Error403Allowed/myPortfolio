import { motion } from "framer-motion";
import { X } from "lucide-react";

interface InterestPromptProps {
  onClose: () => void;
  onContact: () => void;
}

const InterestPrompt = ({ onClose, onContact }: InterestPromptProps) => {
  return (
    <motion.div
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[60] w-[calc(100%-2rem)] max-w-sm"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      role="dialog"
      aria-label="Get in touch prompt"
    >
      <div className="glass glow-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground text-sm sm:text-base">
              Looks like you&apos;re interested, let&apos;s get in touch!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              I&apos;d love to hear about your ideas or opportunities.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss prompt"
            className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onContact}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get in touch
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterestPrompt;

import { motion } from "framer-motion";

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen = ({ onEnter }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background grid-bg"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Floating orb */}
      <motion.div
        className="absolute w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow) / 0.6), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-center z-10 px-4"
      >
        <motion.p
          className="font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Welcome to
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold glow-text text-primary mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          My Portfolio
        </motion.h1>

        <motion.button
          onClick={onEnter}
          className="glass glow-border px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-foreground tracking-wide
                     hover:glow-border-strong transition-all duration-300 cursor-pointer group"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-3">
            Enter Portfolio
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
        </motion.button>
      </motion.div>

      {/* Bottom line decoration */}
      <motion.div
        className="absolute bottom-12 flex gap-2"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;

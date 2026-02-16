import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 24, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 24, mass: 0.4 });

  const tiltX = useTransform(smoothY, [-0.5, 0.5], [11, -11]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-11, 11]);
  const portraitX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const portraitY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 pt-24 sm:pt-20"
    >
      {/* Atmospheric background */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[620px] sm:h-[620px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--glow)), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 right-0 w-[380px] h-[380px] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)), transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--primary) / 0.14) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.14) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />
      <div className="z-10 w-full max-w-7xl">
        <div className="grid items-center gap-10 lg:gap-16 md:grid-cols-[1.05fr,0.95fr]">
          <div className="text-center md:text-left">
            <motion.p
              className="font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary mb-5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.02]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.58 }}
            >
              Shrravan <span className="text-primary glow-text">Bala</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-10 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.55 }}
            >
              Creative student developer building immersive products with clean
              frontend engineering and practical AI integration.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5 }}
            >
              <motion.a
                href="#projects"
                className="glass glow-border w-full sm:w-auto px-6 py-3 rounded-full font-medium text-foreground text-center hover:glow-border-strong transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Work
              </motion.a>
              <motion.a
                href="#contact"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground text-center hover:opacity-90 transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get in Touch
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[370px] lg:h-[370px] [transform-style:preserve-3d]"
            style={{
              x: portraitX,
              y: portraitY,
              rotateX: tiltX,
              rotateY: tiltY,
              transformPerspective: 900,
            }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.72, ease: "easeOut" }}
          >
            <motion.div
              className="absolute -inset-9 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/90" />
              <div className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-primary/80" />
            </motion.div>

            <motion.div
              className="absolute -inset-5 rounded-full border border-primary/25"
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute -inset-2 rounded-full border border-primary/35" />

            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden border border-white/20 glass"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/pfp.jpg"
                alt="Portrait of Shrravan Bala"
                className="w-full h-full object-cover object-[50%_24%]"
                loading="eager"
                decoding="async"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/38 via-transparent to-background/10" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-8 h-8 text-muted-foreground" />
      </motion.div>
    </section>
  );
};

export default HeroSection;

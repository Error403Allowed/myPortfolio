import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "React / Next.js", score: 8 },
  { name: "TypeScript", score: 8 },
  { name: "Tailwind CSS", score: 9 },
  { name: "Node.js", score: 8 },
  { name: "UI/UX Design", score: 9 },
  { name: "Python", score: 7 },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 md:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">
            Expertise
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12">
            Skills & <span className="text-primary">Tools</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-medium text-foreground text-sm sm:text-base">{skill.name}</span>
                <span className="font-mono text-xs sm:text-sm text-primary shrink-0">{skill.score.toFixed(1)}/10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--glow) / 0.6))`,
                    boxShadow: `0 0 10px hsl(var(--glow) / 0.3)`,
                  }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.score * 10}%` } : { width: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

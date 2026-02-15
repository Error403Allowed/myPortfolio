import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Personal Portfolio",
    desc: "This very site! A glassmorphic, interactive portfolio built with React, Framer Motion, and a custom dynamic theme system.",
    tags: ["React", "TypeScript", "Tailwind"],
    link: "#",
  },
  {
    title: "Task Management App",
    desc: "A productivity tool with drag-and-drop boards, real-time sync, and a clean minimal interface. Great starter project idea.",
    tags: ["React", "Firebase", "DnD Kit"],
    link: "#",
  },
  {
    title: "Weather Dashboard",
    desc: "A responsive weather app fetching live data from a public API with beautiful data visualizations and location search.",
    tags: ["API Integration", "Charts", "CSS"],
    link: "#",
  },
  {
    title: "Coming Soon...",
    desc: "Got a cool idea? A blog, an e-commerce storefront, a game, a CLI tool — this space is for your next creation.",
    tags: ["Your Idea", "Your Stack"],
    link: "#",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">
            My Work
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Here are some projects I've built or am planning. Replace these with your own work as you go!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="glass glow-border rounded-2xl p-6 group hover:glow-border-strong transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-full h-40 rounded-xl bg-secondary mb-5 overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--glow) / 0.3), transparent)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm text-muted-foreground">
                    {project.title}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {project.desc}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  <Github className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "../icons/BrandIcons";

const projects = [
  {
    title: "Personal Portfolio",
    desc: "This very site! A glassmorphic, interactive portfolio built with React, Framer Motion, and a custom dynamic theme system.",
    tags: ["React", "TypeScript", "Tailwind"],
    link: "#",
    github: "https://github.com/Error403Allowed/myPortfolio",
    cover: "/PortfolioCover.png",
  },
  {
    title: "Analogy-based Learning App",
    desc: "Analogix is a personalized study web app built with React + TypeScript (Vite), Tailwind CSS, and Framer Motion, using AI integrations to teach through AI-crafted, personalised analogies, run quizzes, and provide dashboard insights with calendar/deadline tracking.",
    tags: ["React", "Typescript", "Tailwind"],
    link: "https://analogix.vercel.app",
    github: "https://github.com/Error403Allowed/Analogix",
    cover: "/AnalogixCover.png",
  },
  {
    title: "Coming Soon...",
    desc: "Stick around to see what I've got planned next!",
    tags: ["Your Idea", "Your Stack"],
    link: "#",
    github: "",
    cover: "",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
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
            Here are some projects I've built or am planning to build. Each one is a unique blend of creativity and logic, showcasing my skills and passions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const hasLiveLink = project.link && project.link !== "#";
            const hasGitHub = Boolean(project.github);
            const showActions = hasLiveLink || hasGitHub;

            return (
              <motion.div
                key={project.title}
                className="glass glow-border rounded-2xl p-6 group hover:glow-border-strong transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-full h-40 rounded-xl bg-secondary mb-5 overflow-hidden relative">
                  {project.cover ? (
                    <img
                      src={project.cover}
                      alt={`${project.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
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
                    </>
                  )}
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

                  {showActions ? (
                    <div className="flex gap-2">
                      {hasLiveLink ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live link`}
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                      ) : null}
                      {hasGitHub ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                        >
                          <GitHubIcon className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

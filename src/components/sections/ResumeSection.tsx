import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Award, Heart } from "lucide-react";

const experience = [
  {
    role: "Your Role Here",
    company: "Company Name",
    period: "2024 — Present",
    desc: "Describe your key responsibilities and achievements in this role.",
  },
  {
    role: "Previous Role",
    company: "Previous Company",
    period: "2022 — 2024",
    desc: "What did you accomplish? What technologies did you use?",
  },
];

const resumeSkills = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  { category: "Frameworks", items: ["React", "Node.js", "Tailwind CSS"] },
  { category: "Tools", items: ["Git", "Figma", "VS Code"] },
];

const extracurriculars = [
  {
    title: "Club or Organization",
    role: "President / Member",
    desc: "Brief description of your involvement and impact.",
  },
  {
    title: "Volunteer Work",
    role: "Volunteer",
    desc: "What did you contribute? What was the outcome?",
  },
  {
    title: "Personal Projects",
    role: "Creator",
    desc: "Side projects, hackathons, or creative endeavors.",
  },
];

const ResumeSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resume" className="py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">
            My Background
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-16">
            Resume & <span className="text-primary">Experience</span>
          </h2>
        </motion.div>

        {/* Work Experience */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Work Experience</h3>
          </div>
          <div className="space-y-6 ml-5 border-l border-border pl-8">
            {experience.map((job, i) => (
              <motion.div
                key={job.role}
                className="glass glow-border rounded-xl p-6 hover:glow-border-strong transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{job.role}</h4>
                  <span className="font-mono text-xs text-primary">{job.period}</span>
                </div>
                <p className="text-sm text-primary/80 mb-2">{job.company}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Skills</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {resumeSkills.map((group, i) => (
              <motion.div
                key={group.category}
                className="glass glow-border rounded-xl p-5 hover:glow-border-strong transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <h4 className="font-semibold text-foreground mb-3">{group.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Extracurriculars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Extracurriculars</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {extracurriculars.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass glow-border rounded-xl p-5 hover:glow-border-strong transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-primary mb-2">{item.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeSection;

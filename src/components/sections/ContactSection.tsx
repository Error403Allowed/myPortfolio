import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter, Phone } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
];

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">
            Get in Touch
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Let's <span className="text-primary">Connect</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            Have a project in mind or just want to chat? I'm always open to new
            opportunities and conversations.
          </p>
        </motion.div>

        {/* Call / Contact Cards */}
        <motion.div
          className="grid sm:grid-cols-2 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <a
            href="tel:+1234567890"
            className="glass glow-border rounded-xl p-6 flex items-center gap-4
                       hover:glow-border-strong transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Call Me
              </p>
              <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
            </div>
          </a>
          <a
            href="mailto:hello@example.com"
            className="glass glow-border rounded-xl p-6 flex items-center gap-4
                       hover:glow-border-strong transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Email Me
              </p>
              <p className="text-sm text-muted-foreground">hello@example.com</p>
            </div>
          </a>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="glass w-12 h-12 rounded-full flex items-center justify-center
                         hover:glow-border transition-all duration-300 group"
              title={social.label}
            >
              <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </motion.div>

        <motion.p
          className="mt-20 text-sm text-muted-foreground font-mono"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          © 2026 — Built with passion
        </motion.p>
      </div>
    </section>
  );
};

export default ContactSection;

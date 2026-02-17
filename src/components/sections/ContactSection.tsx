import { motion, useInView } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "../icons/BrandIcons";

const socials = [
  { icon: GitHubIcon, label: "GitHub", href: "https://github.com/Error403Allowed", target: "_blank", rel: "noopener" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "#", target: "_blank", rel: "noopener" },
  { icon: Mail, label: "Email", href: "mailto:shrravan.bala@gmail.com", target: "_blank", rel: "noopener" },
];

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:shrravan.bala@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
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
              <p className="text-sm text-muted-foreground">+61 423 920 080</p>
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
              <p className="text-sm text-muted-foreground">shrravan.bala@gmail.com</p>
            </div>
          </a>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass glow-border rounded-2xl p-5 sm:p-6 text-left mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5">
            Send me a message
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              placeholder="Tell me about your idea, project, or any opportunities you may have!"
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Send Message
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.form>

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
              target={social.target}
              rel={social.rel}
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
          © 2026 — Designed and built by Shrravan Bala. All rights reserved.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactSection;

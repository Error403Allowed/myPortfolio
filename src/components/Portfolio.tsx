import { motion } from "framer-motion";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ResumeSection from "@/components/sections/ResumeSection";
import ContactSection from "@/components/sections/ContactSection";
import Navbar from "@/components/Navbar";

const Portfolio = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ResumeSection />
      <SkillsSection />
      <ContactSection />
    </motion.div>
  );
};

export default Portfolio;

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import Portfolio from "@/components/Portfolio";
import ColorPicker from "@/components/ColorPicker";
import ParticleBackground from "@/components/ParticleBackground";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [accentHue, setAccentHue] = useState(210);

  const handleColorChange = (hue: number) => {
    setAccentHue(hue);
    document.documentElement.style.setProperty("--accent-hue", String(hue));
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <ParticleBackground />
      <CursorGlow />
      <AnimatePresence mode="wait">
        {!entered ? (
          <SplashScreen key="splash" onEnter={() => setEntered(true)} />
        ) : (
          <Portfolio key="portfolio" />
        )}
      </AnimatePresence>
      {entered && (
        <ColorPicker currentHue={accentHue} onHueChange={handleColorChange} />
      )}
    </div>
  );
};

export default Index;

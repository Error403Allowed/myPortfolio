import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Portfolio from "@/components/Portfolio";
import ColorPicker from "@/components/ColorPicker";
import ParticleBackground from "@/components/ParticleBackground";
import CursorGlow from "@/components/CursorGlow";
import PortfolioAssistantWidget from "@/components/PortfolioAssistantWidget";

const ENTERED_STORAGE_KEY = "portfolio-entered";

const Index = () => {
  const [entered, setEntered] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ENTERED_STORAGE_KEY) === "true";
  });
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [accentHue, setAccentHue] = useState(210);

  const handleColorChange = (hue: number) => {
    setAccentHue(hue);
    document.documentElement.style.setProperty("--accent-hue", String(hue));
  };

  const handleEnter = () => {
    window.sessionStorage.setItem(ENTERED_STORAGE_KEY, "true");
    setEntered(true);
  };

  useEffect(() => {
    if (!entered) {
      setEffectsEnabled(false);
      return;
    }

    let cancelled = false;
    const enableEffects = () => {
      if (!cancelled) setEffectsEnabled(true);
    };

    if ("requestIdleCallback" in window) {
      const callbackId = window.requestIdleCallback(enableEffects, { timeout: 200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(callbackId);
      };
    }

    const timeoutId = window.setTimeout(enableEffects, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [entered]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {effectsEnabled && <ParticleBackground />}
      {effectsEnabled && <CursorGlow />}
      {entered ? <Portfolio /> : <SplashScreen onEnter={handleEnter} />}
      {entered && (
        <ColorPicker currentHue={accentHue} onHueChange={handleColorChange} />
      )}
      {entered && <PortfolioAssistantWidget />}
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Portfolio from "@/components/Portfolio";
import ColorPicker from "@/components/ColorPicker";
import ParticleBackground from "@/components/ParticleBackground";
import CursorGlow from "@/components/CursorGlow";
import PortfolioAssistantWidget from "@/components/PortfolioAssistantWidget";
import InterestPrompt from "@/components/InterestPrompt";

const ENTERED_STORAGE_KEY = "portfolio-entered";
const INTEREST_PROMPT_SHOWN_KEY = "interest-prompt-shown";
const INTEREST_PROMPT_DELAY_MS = 3 * 60 * 1000;

const Index = () => {
  const [entered, setEntered] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ENTERED_STORAGE_KEY) === "true";
  });
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [showInterestPrompt, setShowInterestPrompt] = useState(false);
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

  useEffect(() => {
    if (!entered) return;
    if (window.sessionStorage.getItem(INTEREST_PROMPT_SHOWN_KEY) === "true") return;

    const timerId = window.setTimeout(() => {
      setShowInterestPrompt(true);
      window.sessionStorage.setItem(INTEREST_PROMPT_SHOWN_KEY, "true");
    }, INTEREST_PROMPT_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [entered]);

  const handlePromptClose = () => {
    setShowInterestPrompt(false);
    window.sessionStorage.setItem(INTEREST_PROMPT_SHOWN_KEY, "true");
  };

  const handlePromptContact = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    handlePromptClose();
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {effectsEnabled && <ParticleBackground />}
      {effectsEnabled && <CursorGlow />}
      {entered ? <Portfolio /> : <SplashScreen onEnter={handleEnter} />}
      {entered && (
        <ColorPicker currentHue={accentHue} onHueChange={handleColorChange} />
      )}
      {entered && <PortfolioAssistantWidget />}
      {entered && showInterestPrompt && (
        <InterestPrompt onClose={handlePromptClose} onContact={handlePromptContact} />
      )}
    </div>
  );
};

export default Index;

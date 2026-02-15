import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  currentHue: number;
  onHueChange: (hue: number) => void;
}

const presets = [
  { hue: 210, label: "Blue" },
  { hue: 180, label: "Cyan" },
  { hue: 260, label: "Purple" },
  { hue: 330, label: "Pink" },
  { hue: 140, label: "Green" },
  { hue: 30, label: "Orange" },
];

const ColorPicker = ({ currentHue, onHueChange }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass glow-border rounded-2xl p-4 mb-3 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.hue}
                  onClick={() => onHueChange(preset.hue)}
                  className="w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer border-2"
                  style={{
                    background: `hsl(${preset.hue}, 80%, 55%)`,
                    borderColor:
                      currentHue === preset.hue
                        ? "hsl(0 0% 100% / 0.8)"
                        : "transparent",
                    boxShadow:
                      currentHue === preset.hue
                        ? `0 0 15px hsl(${preset.hue}, 80%, 55%, 0.5)`
                        : "none",
                  }}
                  title={preset.label}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="glass glow-border w-12 h-12 rounded-full flex items-center justify-center
                   hover:glow-border-strong transition-all duration-300 cursor-pointer"
      >
        <Palette className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};

export default ColorPicker;

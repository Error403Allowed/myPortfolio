import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0, y = 0;
    let targetX = 0, targetY = 0;

    const handleMouse = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      glow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouse);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[1]"
      style={{
        background: "radial-gradient(circle, hsl(var(--glow) / 0.08), transparent 70%)",
        willChange: "transform",
      }}
    />
  );
};

export default CursorGlow;

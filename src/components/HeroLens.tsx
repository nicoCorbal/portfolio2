"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function HeroLens() {
  const [isInHero, setIsInHero] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const hero = document.querySelector("section");

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (hero) {
        const rect = hero.getBoundingClientRect();
        const inHero = e.clientY >= rect.top && e.clientY <= rect.bottom;
        setIsInHero(inHero);

        if (inHero) {
          document.body.style.cursor = "none";
        } else {
          document.body.style.cursor = "";
        }
      }
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "";
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* SVG Filter for custom color mapping */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="lensFilter">
            {/* Invert colors */}
            <feColorMatrix
              type="matrix"
              values="-1 0 0 0 1
                      0 -1 0 0 1
                      0 0 -1 0 1
                      0 0 0 1 0"
            />
            {/* Shift hue: orange→purple, white stays warm */}
            <feColorMatrix
              type="hueRotate"
              values="45"
            />
            {/* Boost saturation */}
            <feColorMatrix
              type="saturate"
              values="1.8"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        className="pointer-events-none fixed z-50 w-[120px] h-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isInHero ? 1 : 0,
          scale: isInHero ? 1 : 0.5
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Pattern background */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "6px 6px",
          }}
        />

        {/* Color shift filter */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backdropFilter: "url(#lensFilter)",
            WebkitBackdropFilter: "url(#lensFilter)",
          }}
        />

        {/* Black ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[var(--text)]" />
      </motion.div>
    </>
  );
}

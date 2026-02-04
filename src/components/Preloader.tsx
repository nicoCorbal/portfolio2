"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showName, setShowName] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.floor(eased * 100);

      setCount(newCount);

      // Show name at 30% progress
      if (progress > 0.3) {
        setShowName(true);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg)] overflow-hidden"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center">
            {/* Logo / Initials */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="flex items-baseline gap-1 mb-8"
            >
              <span className="text-[clamp(3rem,8vw,5rem)] font-semibold tracking-[-0.02em] text-[var(--text)]">
                N
              </span>
              <span className="text-[clamp(3rem,8vw,5rem)] font-creative italic font-semibold tracking-[-0.02em] text-[var(--accent)]">
                C
              </span>
            </motion.div>

            {/* Name reveal */}
            <div className="overflow-hidden h-[clamp(2rem,5vw,3.5rem)] mb-12">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: showName ? 0 : "100%" }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="flex items-baseline gap-3"
              >
                <span className="text-[clamp(1.5rem,4vw,2.5rem)] font-semibold tracking-[-0.02em] text-[var(--text)]">
                  Nicolás
                </span>
                <span className="text-[clamp(1.5rem,4vw,2.5rem)] font-creative italic font-semibold tracking-[-0.02em] text-[var(--text)]">
                  Corbal
                </span>
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="relative w-[200px] sm:w-[280px]">
              <div className="h-[2px] w-full bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${count}%` }}
                />
              </div>

              {/* Counter */}
              <div className="flex justify-between items-center mt-4">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.2 }}
                  className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-medium"
                >
                  Loading
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[13px] font-medium tabular-nums text-[var(--text)]"
                >
                  {count}%
                </motion.span>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.3 }}
            className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-[var(--text)]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.4 }}
            className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-[var(--text)]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-[var(--text)]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-[var(--text)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import HeroContent from "./HeroContent";

// Colores invertidos
const INVERTED_COLORS = {
  text: "#FF4D00",      // Naranja (era negro)
  accent: "#FFFFFF",    // Blanco (era naranja)
  bg: "#0A0A0A",        // Negro
};

const LENS_SIZE = 120;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const invertedLayerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isInHero, setIsInHero] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Lens effect only for non-touch devices
  useEffect(() => {
    if (isTouchDevice) return;

    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrame: number;

    const updateLens = () => {
      if (!containerRef.current || !invertedLayerRef.current || !ringRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const headerHeight = 64;

      // Área visible del hero (considerando header y viewport)
      const visibleTop = Math.max(rect.top, headerHeight);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);

      // ¿Hay área visible del hero?
      const heroHasVisibleArea = visibleBottom > visibleTop;

      // ¿El ratón está en el área visible del hero?
      const isMouseInVisibleHero =
        heroHasVisibleArea &&
        lastMouseX >= rect.left &&
        lastMouseX <= rect.right &&
        lastMouseY >= visibleTop &&
        lastMouseY <= visibleBottom;

      setIsInHero(isMouseInVisibleHero);
      document.body.style.cursor = isMouseInVisibleHero ? "none" : "";

      // Posición relativa a la sección para el clip-path
      const relativeX = lastMouseX - rect.left;
      const relativeY = lastMouseY - rect.top;

      // Actualizar directamente via refs (sin pasar por React state)
      invertedLayerRef.current.style.clipPath = `circle(${LENS_SIZE / 2}px at ${relativeX}px ${relativeY}px)`;
      ringRef.current.style.left = `${lastMouseX}px`;
      ringRef.current.style.top = `${lastMouseY}px`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateLens);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateLens);
    };

    const handleMouseLeave = () => {
      document.body.style.cursor = "";
      setIsInHero(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
      document.body.style.cursor = "";
    };
  }, [isTouchDevice]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      {/* Versión normal */}
      <HeroContent
        textColor="var(--text)"
        accentColor="var(--accent)"
        scrollYProgress={scrollYProgress}
      />

      {/* Versión invertida - solo en dispositivos no touch */}
      {!isTouchDevice && (
        <motion.div
          ref={invertedLayerRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ clipPath: "circle(0px at 0px 0px)" }}
          animate={{ opacity: isInHero ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          <HeroContent
            textColor={INVERTED_COLORS.text}
            accentColor={INVERTED_COLORS.accent}
            bgColor={INVERTED_COLORS.bg}
            isInverted
            scrollYProgress={scrollYProgress}
          />
        </motion.div>
      )}

      {/* Anillo de la lente - solo en dispositivos no touch */}
      {!isTouchDevice && (
        <motion.div
          ref={ringRef}
          className="pointer-events-none fixed z-50 rounded-full border-2 border-[var(--text)]"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: -200,
            top: -200,
            marginLeft: -LENS_SIZE / 2,
            marginTop: -LENS_SIZE / 2,
          }}
          animate={{
            opacity: isInHero ? 1 : 0,
            scale: isInHero ? 1 : 0.5,
          }}
          transition={{ duration: 0.1 }}
        />
      )}
    </section>
  );
}

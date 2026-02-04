"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import gsap from "gsap";
import { useTranslations } from "next-intl";

interface HeroContentProps {
  textColor: string;
  accentColor: string;
  bgColor?: string;
  isInverted?: boolean;
  scrollYProgress: MotionValue<number>;
}

export default function HeroContent({
  textColor,
  accentColor,
  bgColor,
  isInverted = false,
  scrollYProgress,
}: HeroContentProps) {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const nicolasRef = useRef<HTMLDivElement>(null);
  const corbalRef = useRef<HTMLDivElement>(null);

  const nicolasY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const corbalY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    if (isInverted) return; // Solo animar la versión normal
    if (!nicolasRef.current || !corbalRef.current) return;

    const nicolasChars = nicolasRef.current.querySelectorAll(".char");
    const corbalChars = corbalRef.current.querySelectorAll(".char");

    gsap.fromTo(
      nicolasChars,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.1,
      }
    );

    gsap.fromTo(
      corbalChars,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.35,
      }
    );
  }, [isInverted]);

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block">
        {char}
      </span>
    ));
  };

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center px-10 sm:px-20"
      style={{ backgroundColor: bgColor }}
    >
      {/* Noise overlay for inverted version */}
      {isInverted && (
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Header invertido */}
      {isInverted && (
        <header className="absolute top-0 left-0 right-0 z-10">
          <nav className="px-10 sm:px-20 h-16 flex items-center justify-between">
            <div className="flex items-baseline gap-1" style={{ color: textColor }}>
              <span className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em]">N</span>
              <span className="text-[20px] sm:text-[22px] font-creative italic font-semibold tracking-[-0.02em]">C</span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8">
              {[
                { label: tNav("work"), num: "01" },
                { label: tNav("about"), num: "02" },
                { label: tNav("contact"), num: "03" },
              ].map((item) => (
                <span key={item.label} className="flex items-baseline gap-2" style={{ color: textColor }}>
                  <span className="text-[10px] font-semibold" style={{ color: accentColor }}>
                    {item.num}
                  </span>
                  <span className="text-[14px] font-medium tracking-[-0.01em]">{item.label}</span>
                </span>
              ))}
            </div>
          </nav>
        </header>
      )}
      {/* Main Typography */}
      <div className="relative z-10 max-w-none ml-4 sm:ml-12">
        {/* Nicolás */}
        <motion.div
          ref={nicolasRef}
          style={{ y: nicolasY }}
          className="overflow-hidden"
        >
          <h1
            className="text-[clamp(3rem,15vw,14rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
            style={{ color: textColor }}
          >
            {splitText("Nicolás")}
          </h1>
        </motion.div>

        {/* Corbal */}
        <motion.div
          ref={corbalRef}
          style={{ y: corbalY }}
          className="overflow-hidden ml-2 sm:ml-4 md:ml-[12vw]"
        >
          <h1 className="text-[clamp(3rem,15vw,14rem)] leading-[0.9] tracking-[-0.02em] font-creative italic font-semibold">
            <span style={{ color: textColor }}>Cor</span>
            <span style={{ color: accentColor }}>bal</span>
          </h1>
        </motion.div>
      </div>

      {/* Subtitle */}
      <motion.div
        style={{ y: subtitleY, opacity: opacityOut }}
        className="mt-6 sm:mt-8 md:mt-10 ml-2 sm:ml-4 md:ml-[12vw]"
      >
        <p
          className="text-[clamp(0.875rem,1.5vw,1.125rem)] max-w-sm sm:max-w-md leading-relaxed"
          style={{ color: isInverted ? textColor : "var(--text-muted)" }}
        >
          {t.rich("subtitle", {
            design: (chunks) => (
              <span className="font-creative italic font-semibold" style={{ color: textColor }}>
                {t("design")}
              </span>
            ),
            code: (chunks) => (
              <span className="font-medium" style={{ color: textColor }}>
                {t("code")}
              </span>
            ),
          })}
        </p>
      </motion.div>

      {/* Location - top right */}
      <motion.div
        initial={isInverted ? false : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute top-24 sm:top-28 right-10 sm:right-20 flex flex-col items-end gap-3"
      >
        <div className="flex items-center gap-2">
          <span className="w-6 sm:w-8 h-[1px]" style={{ backgroundColor: accentColor }} />
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: isInverted ? textColor : "var(--text-muted)" }}
          >
            {t("basedIn")}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[13px] sm:text-[14px] font-medium tracking-[-0.01em]" style={{ color: textColor }}>
            {t("location")}
          </p>
          <p
            className="text-[10px] sm:text-[11px] mt-1 font-medium tabular-nums"
            style={{ color: isInverted ? textColor : "var(--text-muted)" }}
          >
            {t("coordinates")}
          </p>
        </div>
      </motion.div>

      {/* Status - bottom left */}
      <motion.div
        initial={isInverted ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-10 left-10 sm:left-20 flex flex-col gap-2"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex items-center justify-center h-2 w-2">
            <span
              className="animate-ping absolute h-2 w-2 rounded-full opacity-75"
              style={{ backgroundColor: accentColor }}
            />
            <span className="rounded-full h-1.5 w-1.5" style={{ backgroundColor: accentColor }} />
          </span>
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] leading-none font-semibold"
            style={{ color: isInverted ? textColor : "var(--text-muted)" }}
          >
            {t("available")}
          </span>
        </div>
        <p className="text-[12px] sm:text-[13px] font-medium pl-4" style={{ color: textColor }}>
          {t.rich("openFor", {
            projects: (chunks) => <span className="font-creative italic">{t("projects")}</span>,
          })}
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: opacityOut }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]"
          style={{ color: isInverted ? textColor : "var(--text-muted)" }}
        >
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-6 sm:h-8"
          style={{ backgroundColor: isInverted ? textColor : "var(--text-muted)" }}
        />
      </motion.div>
    </div>
  );
}

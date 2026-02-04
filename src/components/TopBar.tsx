"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();

  const navItems = [
    { label: t("work"), href: "#work", num: "01" },
    { label: t("about"), href: "#about", num: "02" },
    { label: t("contact"), href: "#contact", num: "03" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : ""
      }`}
    >
      <nav className="mx-auto px-10 sm:px-20 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-baseline gap-1 text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          <span className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em]">N</span>
          <span className="text-[20px] sm:text-[22px] font-creative italic font-semibold tracking-[-0.02em]">C</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-baseline gap-2 text-[var(--text)] transition-colors hover:text-[var(--accent)]"
            >
              <span className="text-[10px] font-semibold text-[var(--accent)]">
                {item.num}
              </span>
              <span className="text-[14px] font-medium tracking-[-0.01em]">
                {item.label}
              </span>
            </a>
          ))}

          {/* Language Switcher */}
          <div className="ml-2 pl-4 border-l border-[var(--border)]">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

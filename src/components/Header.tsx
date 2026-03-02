"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const t = useTranslations("header");
  const [time, set_time] = useState("");

  useEffect(() => {
    const update_time = () => {
      const now = new Date();
      set_time(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Madrid",
          hour12: false,
        })
      );
    };
    update_time();
    const interval = setInterval(update_time, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-start mb-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("name")}
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {t("subtitle")}{time ? ` · ${time}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-4 mt-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}

"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const otherLocale = locale === "es" ? "en" : "es";

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={() => switchLocale(otherLocale)}
      className="group flex items-baseline gap-2 text-[var(--text)] transition-colors hover:text-[var(--accent)]"
      aria-label={`Switch to ${otherLocale === "es" ? "Spanish" : "English"}`}
    >
      <span className="text-[10px] font-semibold text-[var(--accent)]">
        {locale.toUpperCase()}
      </span>
      <span className="text-[14px] font-medium tracking-[-0.01em]">
        {otherLocale.toUpperCase()}
      </span>
    </motion.button>
  );
}

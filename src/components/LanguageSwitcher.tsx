"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const other_locale = locale === "es" ? "en" : "es";

  const switch_locale = () => {
    const new_path = pathname.replace(`/${locale}`, `/${other_locale}`);
    router.push(new_path);
  };

  return (
    <button
      onClick={switch_locale}
      className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      aria-label={`Switch to ${other_locale === "es" ? "Spanish" : "English"}`}
    >
      {other_locale.toUpperCase()}
    </button>
  );
}

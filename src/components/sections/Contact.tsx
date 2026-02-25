"use client";

import { useTranslations } from "next-intl";
import HoverPopup from "@/components/HoverPopup";
import { SymbolCardPopup } from "@/components/sections/Bio";

export default function Contact() {
  const t = useTranslations("footer");
  const link_class = "text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors";

  return (
    <footer className="text-sm text-[var(--text-muted)] space-y-3">
      <p>
        {t.rich("reach", {
          email: (chunks) => (
            <a href="mailto:hola@nicolascorbal.com" className={link_class}>{chunks}</a>
          ),
          twitter: (chunks) => (
            <a href="https://twitter.com/nicocorbal" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
          ),
          github: (chunks) => (
            <HoverPopup content={<SymbolCardPopup symbol="GH" bg="#24292e" title={t("popups.github.title")} desc={t("popups.github.desc")} />}>
              <a href="https://github.com/nicolascorbal" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
          linkedin: (chunks) => (
            <HoverPopup content={<SymbolCardPopup symbol="in" bg="#0A66C2" title={t("popups.linkedin.title")} desc={t("popups.linkedin.desc")} />}>
              <a href="https://linkedin.com/in/nicolascorbal" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
        })}
      </p>
      <p className="text-xs text-[var(--text-muted)]">
        {t("copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}

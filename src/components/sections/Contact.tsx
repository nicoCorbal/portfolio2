"use client";

import { useTranslations } from "next-intl";
import HoverPopup from "@/components/HoverPopup";
import { IconCardPopup } from "@/components/sections/Bio";

export default function Contact() {
  const t = useTranslations("footer");
  const link_class = "text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors";

  return (
    <footer className="text-sm text-[var(--text-muted)] space-y-3">
      <p>
        {t.rich("reach", {
          email: (chunks) => (
            <a href="mailto:nicocorbal@gmail.com" className={link_class}>{chunks}</a>
          ),
          github: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-github.svg" icon_bg="#24292e" title={t("popups.github.title")} desc={t("popups.github.desc")} invert />}>
              <a href="https://github.com/NicoCorbal" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
          linkedin: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-linkedin.svg" icon_bg="#0A66C2" title={t("popups.linkedin.title")} desc={t("popups.linkedin.desc")} full />}>
              <a href="https://www.linkedin.com/in/nicol%C3%A1s-corbal-912929318/" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
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

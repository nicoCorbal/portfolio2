"use client";

import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("footer");

  return (
    <footer className="text-sm text-[var(--text-muted)] space-y-3">
      <p>
        {t.rich("reach", {
          email: (chunks) => (
            <a
              href="mailto:hola@nicolascorbal.com"
              className="text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {chunks}
            </a>
          ),
          twitter: (chunks) => (
            <a
              href="https://twitter.com/nicocorbal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {chunks}
            </a>
          ),
          github: (chunks) => (
            <a
              href="https://github.com/nicolascorbal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {chunks}
            </a>
          ),
          linkedin: (chunks) => (
            <a
              href="https://linkedin.com/in/nicolascorbal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <p className="text-xs text-[var(--text-muted)]">
        {t("copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}

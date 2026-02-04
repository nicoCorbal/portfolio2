"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SOCIAL_LINKS = [
  { name: "LinkedIn", url: "https://linkedin.com/in/nicolascorbal" },
  { name: "GitHub", url: "https://github.com/nicolascorbal" },
  { name: "Twitter", url: "https://twitter.com/nicolascorbal" },
];

const EMAIL = "hola@nicolascorbal.com";

export default function Contact() {
  const t = useTranslations("contact");
  const current_year = new Date().getFullYear();

  return (
    <section id="contact" className="section relative min-h-[80vh] flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold text-[var(--accent)] mb-4 block">
            03
          </span>
          <h2 className="text-heading">{t("title")}</h2>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] mb-6">
              {t("headline")}
            </h3>
            <p className="text-body-large text-[var(--text-muted)] max-w-lg">
              {t("description")}
            </p>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Email */}
            <div>
              <p className="text-sm font-semibold text-[var(--accent)] mb-3">
                {t("email")}
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="group text-2xl font-medium hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
              >
                {EMAIL}
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  &rarr;
                </span>
              </a>
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold text-[var(--accent)] mb-3">
                {t("social")}
              </p>
              <div className="flex flex-wrap gap-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-auto pt-16"
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            {t("footer.location")}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {t("footer.copyright", { year: current_year })}
          </p>
        </div>
      </motion.footer>
    </section>
  );
}

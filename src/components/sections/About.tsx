"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Figma",
];

const DIFFERENTIATORS = ["bridge", "detail", "learn", "product"] as const;

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="section relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--accent)]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold text-[var(--accent)] mb-4 block">
            02
          </span>
          <h2 className="text-heading">{t("title")}</h2>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-body-large mb-8">
              {t.rich("headline", {
                company: (chunks) => <span className="text-[var(--accent)] font-semibold">{chunks}</span>,
              })}
            </p>

            <div className="space-y-6 text-[var(--text-muted)]">
              <p>
                {t.rich("story.p1", {
                  year: (chunks) => <span className="font-medium text-[var(--text)]">{chunks}</span>,
                  company: (chunks) => <span className="text-[var(--accent)] font-semibold">{chunks}</span>,
                })}
              </p>
              <p>
                {t.rich("story.p2", {
                  role: (chunks) => <span className="text-[var(--accent)] font-medium">{chunks}</span>,
                })}
              </p>
              <p>
                {t.rich("story.p3", {
                  craft: (chunks) => <span className="font-creative italic">{chunks}</span>,
                })}
              </p>
            </div>

            {/* Differentiators */}
            <div className="mt-12">
              <h3 className="text-sm font-semibold text-[var(--accent)] mb-6">
                {t("defines")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {DIFFERENTIATORS.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="text-sm font-medium">
                      {t(`differentiators.${key}`)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stack */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h3 className="text-sm font-semibold text-[var(--accent)] mb-4">
                {t("stack")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg)] border border-[var(--border)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <h3 className="text-sm font-semibold text-[var(--accent)] mb-4">
                {t("values")}
              </h3>
              <div className="space-y-4">
                {(["freedom", "team", "impact"] as const).map((key) => (
                  <div key={key}>
                    <p className="font-medium">{t(`valuesList.${key}.title`)}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {t(`valuesList.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {t("education")}
                </p>
                <p className="text-sm font-medium">{t("educationValue")}</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {t("locationLabel")}
                </p>
                <p className="text-sm font-medium">{t("locationValue")}</p>
              </div>
            </div>

            {/* Easter Egg Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-sm text-[var(--text-muted)]"
            >
              <span>{t("easterEgg.hint")} </span>
              <span className="font-mono text-[var(--accent)]">{t("easterEgg.key")}</span>
              <span> {t("easterEgg.surprise")}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

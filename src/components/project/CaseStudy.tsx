"use client";

import { motion } from "framer-motion";

interface CaseStudyProps {
  caseStudy: {
    problem: string;
    process: string;
    solution: string;
    results?: string;
  };
}

const sections = [
  { key: "problem", label: "El Problema" },
  { key: "process", label: "El Proceso" },
  { key: "solution", label: "La Solución" },
  { key: "results", label: "Resultados" },
] as const;

export default function CaseStudy({ caseStudy }: CaseStudyProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Case Study
          </span>
        </motion.div>

        {/* Content */}
        <div className="space-y-12 sm:space-y-16">
          {sections.map(({ key, label }, index) => {
            const content = caseStudy[key];
            if (!content) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
              >
                {/* Label */}
                <div className="md:col-span-3">
                  <h3 className="text-[13px] sm:text-[14px] font-medium text-[var(--accent)]">
                    {label}
                  </h3>
                </div>

                {/* Content */}
                <div className="md:col-span-9 md:col-start-4">
                  <p className="text-[var(--text)] text-base sm:text-lg leading-relaxed">
                    {content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

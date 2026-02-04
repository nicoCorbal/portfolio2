"use client";

import { motion } from "framer-motion";

interface FeatureGridProps {
  features: string[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 bg-[var(--bg-secondary)]">
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
            Features
          </span>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-4 sm:p-6 bg-[var(--bg)] rounded-xl border border-[var(--border)] transition-all hover:border-[var(--border-strong)]"
            >
              <span className="text-sm sm:text-base text-[var(--text)] font-medium">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

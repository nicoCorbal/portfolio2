"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

interface ProjectNavProps {
  prev: Project | null;
  next: Project | null;
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Previous Project */}
          {prev ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/projects/${prev.id}`}
                className="group flex flex-col items-start"
              >
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                  Previous
                </span>
                <span className="flex items-center gap-2 text-[var(--text)] text-lg sm:text-xl font-medium group-hover:text-[var(--accent)] transition-colors">
                  <svg
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  {prev.title}
                </span>
              </Link>
            </motion.div>
          ) : (
            <div />
          )}

          {/* Next Project */}
          {next ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/projects/${next.id}`}
                className="group flex flex-col items-end text-right"
              >
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                  Next
                </span>
                <span className="flex items-center gap-2 text-[var(--text)] text-lg sm:text-xl font-medium group-hover:text-[var(--accent)] transition-colors">
                  {next.title}
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}

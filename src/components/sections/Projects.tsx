"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import projectsEs from "@/data/projects.es.json";
import projectsEn from "@/data/projects.en.json";

type Project = {
  id: string;
  title: string;
  year: string;
  type: string;
  category: string;
  description: string;
  features: string[];
  tech: string[];
  icon: string;
  color: string;
  link?: string;
};

export default function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const projects: Project[] = locale === "es" ? projectsEs : projectsEn;

  const professional_projects = projects.filter((p) => p.category === "professional");
  const personal_projects = projects.filter((p) => p.category === "personal");

  return (
    <section id="work" className="section relative">
      {/* Watermark */}
      <div className="absolute top-20 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="text-[20vw] font-semibold text-[var(--border)] leading-none tracking-[-0.04em]">
          {t("watermark")}
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Professional Work */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-heading mb-4">{t("professional")}</h2>
          <p className="text-body-large text-[var(--text-muted)] mb-12 max-w-2xl">
            {t.rich("professionalSubtitle", {
              highlight: (chunks) => <span className="text-[var(--accent)] font-medium">{chunks}</span>,
            })}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {professional_projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} locale={locale} />
            ))}
          </div>
        </motion.div>

        {/* Personal Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading mb-4">{t("personal")}</h2>
          <p className="text-body-large text-[var(--text-muted)] mb-12 max-w-2xl">
            {t.rich("personalSubtitle", {
              highlight: (chunks) => <span className="text-[var(--accent)] font-medium">{chunks}</span>,
            })}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {personal_projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} locale={locale} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, locale }: { project: Project; index: number; locale: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/${locale}/projects/${project.id}`}
        className="group block p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${project.color}15` }}
          >
            <span className="text-2xl font-semibold" style={{ color: project.color }}>
              {project.title.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-[var(--text-muted)]">{project.year}</span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--accent)] mb-3">{project.type}</p>
        <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-md bg-[var(--border)] text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Ver proyecto</span>
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </div>
      </Link>
    </motion.div>
  );
}

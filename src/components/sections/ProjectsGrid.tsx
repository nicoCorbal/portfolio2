"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/projects";
import HoverPopup from "@/components/HoverPopup";

/* ── Popup ── */

function ProjectPopup({ project }: { project: Project }) {
  const preview_image = project.screenshot || project.heroImage;

  return (
    <span className="flex flex-col w-[320px] popup-stagger">
      {preview_image ? (
        <span className="block relative h-[180px] w-full popup-img-zoom">
          <Image
            src={preview_image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </span>
      ) : (
        <span className="flex items-center justify-center h-[120px] w-full bg-white">
          <Image
            src={project.icon}
            alt={project.title}
            width={64}
            height={64}
            className="brightness-0 opacity-90"
          />
        </span>
      )}
      <span className="flex flex-col gap-2 px-4 py-3">
        <span className="font-medium text-sm">{project.title}</span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
          {project.description}
        </span>
        <span className="flex flex-wrap gap-1.5 pt-0.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full text-[var(--text-muted)] border border-[var(--border)]"
            >
              {t}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

/* ── Card ── */

function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  return (
    <div className="group flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl transition-transform duration-200 hover:-translate-y-0.5">
      {/* Thumbnail */}
      <div className="relative aspect-[19/10] w-full overflow-hidden rounded-t-xl">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 350px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <Image
              src={project.icon}
              alt={project.title}
              width={120}
              height={120}
              className="brightness-0 opacity-90"
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <HoverPopup
          content={<ProjectPopup project={project} />}
          position="top"
        >
          <Link
            href={`/${locale}/projects/${project.id}`}
            className="font-medium text-sm underline underline-offset-3 decoration-[var(--text-muted)] hover:decoration-[var(--text)] transition-colors"
          >
            {project.title}
          </Link>
        </HoverPopup>
        <span className="text-[13px] text-[var(--text-muted)] leading-snug line-clamp-2">
          {project.description}
        </span>
        <span className="flex flex-wrap gap-1.5 pt-1 mt-auto">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full text-[var(--text-muted)] border border-[var(--border)]"
            >
              {t}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* ── Grid ── */

export default function ProjectsGrid() {
  const locale = useLocale();
  const t = useTranslations("projects");
  const projects = getAllProjects(locale);

  return (
    <section>
      <h2 className="text-sm font-medium text-[var(--text-muted)] mb-6">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bento-stagger">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

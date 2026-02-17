"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import HoverPopup from "@/components/HoverPopup";

function ProjectPopup({ project }: { project: { title: string; description: string; icon: string; heroImage?: string; color: string; tech: string[] } }) {
  return (
    <span className="flex flex-col w-[280px]">
      {project.heroImage ? (
        <span className="block relative h-[140px] w-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="280px"
          />
        </span>
      ) : (
        <span
          className="flex items-center justify-center h-[100px] w-full"
          style={{ backgroundColor: project.color }}
        >
          <Image
            src={project.icon}
            alt={project.title}
            width={40}
            height={40}
            className="brightness-0 invert opacity-80"
          />
        </span>
      )}
      <span className="flex flex-col gap-1.5 px-4 py-3">
        <span className="font-medium text-sm">{project.title}</span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
          {project.description}
        </span>
        <span className="flex flex-wrap gap-1 pt-1">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg)] text-[var(--text-muted)]"
            >
              {t}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export default function ProjectsTable() {
  const locale = useLocale();
  const t = useTranslations("projects");
  const projects = getAllProjects(locale);

  return (
    <section>
      <h2 className="text-sm font-medium text-[var(--text-muted)] mb-6">{t("title")}</h2>
      <div>
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between gap-4 py-4 border-b border-[var(--border)]"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="text-[var(--text-muted)] text-sm tabular-nums w-10 shrink-0 pt-0.5">
                {project.year}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <HoverPopup
                  content={<ProjectPopup project={project} />}
                >
                  <Link
                    href={`/${locale}/projects/${project.id}`}
                    className="underline underline-offset-3 decoration-[var(--text-muted)] hover:decoration-[var(--text)] transition-colors"
                  >
                    {project.title}
                  </Link>
                </HoverPopup>
                <span className="text-[13px] text-[var(--text-muted)] leading-snug line-clamp-1">
                  {project.description}
                </span>
              </div>
            </div>
            <span className="text-[var(--text-muted)] text-sm shrink-0 hidden sm:inline pt-0.5">
              {project.type}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

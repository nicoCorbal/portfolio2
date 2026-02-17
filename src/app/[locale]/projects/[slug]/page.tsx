"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getProjectBySlug, getAdjacentProjects } from "@/lib/projects";

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations("projectDetail");
  const project = getProjectBySlug(slug, locale);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    notFound();
  }

  const { prev, next } = getAdjacentProjects(project.id, locale);
  const has_content = project.caseStudy || (project.learnings && project.learnings.length > 0) ||
                     (project.featuresDetailed && project.featuresDetailed.length > 0) || project.technical;

  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      {/* Nav */}
      <nav className="mb-12">
        <Link
          href={`/${locale}`}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>{t("back")}</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-[var(--text-muted)] leading-relaxed">
          {project.longDescription || project.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {t("buttons.viewProject")} ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] underline underline-offset-3 decoration-[var(--border)] hover:decoration-[var(--text)] transition-colors"
            >
              {t("buttons.github")}
            </a>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {project.heroImage ? (
        <div className="rounded-lg overflow-hidden border border-[var(--border)] mb-10">
          <Image
            src={project.heroImage}
            alt={project.title}
            width={720}
            height={450}
            className="w-full h-auto"
          />
        </div>
      ) : (
        <div className="relative aspect-[2.5/1] rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] mb-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={project.icon}
              alt={project.title}
              width={60}
              height={60}
              className="opacity-40"
            />
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-[var(--border)] mb-10 text-sm">
        <div>
          <p className="text-[var(--text-muted)] mb-1">{t("year")}</p>
          <p className="font-medium">{project.year}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)] mb-1">{t("type")}</p>
          <p className="font-medium">{project.type}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)] mb-1">{t("category")}</p>
          <p className="font-medium capitalize">{project.category}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)] mb-1">{t("stack")}</p>
          <p className="font-medium">{project.tech.slice(0, 3).join(", ")}</p>
        </div>
      </div>

      {/* Case Study */}
      {project.caseStudy && (
        <section className="mb-12 space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-3">
              {t("caseStudy.problem")}
            </h3>
            <p className="leading-relaxed">{project.caseStudy.problem}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-3">
              {t("caseStudy.process")}
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">{project.caseStudy.process}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-3">
              {t("caseStudy.solution")}
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">{project.caseStudy.solution}</p>
          </div>
          {project.caseStudy.results && (
            <div className="p-5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
              <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-3">
                {t("caseStudy.results")}
              </h3>
              <p className="leading-relaxed">{project.caseStudy.results}</p>
            </div>
          )}
        </section>
      )}

      {/* Learnings */}
      {project.learnings && project.learnings.length > 0 && (
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
            {t("learnings")}
          </h3>
          <div className="space-y-3">
            {project.learnings.map((learning, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-[var(--text-muted)] tabular-nums shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="leading-relaxed">{learning}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {project.featuresDetailed && project.featuresDetailed.length > 0 && (
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
            {t("features")}
          </h3>
          <div className="space-y-6">
            {project.featuresDetailed.map((feature, i) => (
              <div key={i} className="pb-5 border-b border-[var(--border)] last:border-0 last:pb-0">
                <h4 className="font-medium mb-1">{feature.name}</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
                {feature.how && (
                  <p className="mt-2 text-xs text-[var(--text-muted)] border-l-2 border-[var(--border)] pl-3">
                    {feature.how}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical */}
      {project.technical && (
        <section className="mb-12 space-y-8">
          <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
            {t("technical")}
          </h3>

          {project.technical.architecture && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-3">
                {t("architecture")}
              </h4>
              <p className="leading-relaxed">{project.technical.architecture}</p>
            </div>
          )}

          {project.technical.highlights && project.technical.highlights.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
                {t("highlights")}
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                {project.technical.highlights.map((h, i) => (
                  <div key={i} className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                    <p className="font-medium text-sm mb-1">{h.title}</p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.technical.challenges && project.technical.challenges.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
                {t("challenges")}
              </h4>
              <div className="space-y-4">
                {project.technical.challenges.map((c, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("challenge")}</p>
                      <p className="text-sm leading-relaxed">{c.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">{t("solution")}</p>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{c.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tech Stack - Only show if no rich content */}
      {!has_content && (
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
            {t("technologies")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs bg-[var(--bg-secondary)] rounded border border-[var(--border)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium mb-4">
            {t("gallery")}
          </h3>
          <div className="space-y-6">
            {project.images.map((img, i) => (
              <div key={i}>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[var(--border)]">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
                {img.caption && (
                  <p className="text-[var(--text-muted)] text-xs mt-2">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-[var(--border)]">
        {prev ? (
          <Link href={`/${locale}/projects/${prev.id}`} className="group">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t("nav.prev")}</p>
            <p className="font-medium group-hover:underline">{prev.title}</p>
          </Link>
        ) : (
          <Link href={`/${locale}`} className="group">
            <p className="text-xs text-[var(--text-muted)] mb-1">← {t("back")}</p>
            <p className="font-medium group-hover:underline">{t("nav.all")}</p>
          </Link>
        )}
        {next ? (
          <Link href={`/${locale}/projects/${next.id}`} className="group sm:text-right">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t("nav.next")}</p>
            <p className="font-medium group-hover:underline">{next.title}</p>
          </Link>
        ) : (
          <Link href={`/${locale}`} className="group sm:text-right">
            <p className="text-xs text-[var(--text-muted)] mb-1">{t("nav.viewMore")}</p>
            <p className="font-medium group-hover:underline">{t("nav.all")}</p>
          </Link>
        )}
      </nav>
    </main>
  );
}

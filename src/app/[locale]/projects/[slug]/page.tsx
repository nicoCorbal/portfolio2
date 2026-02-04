"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProjectBySlug, getAdjacentProjects } from "@/lib/projects";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
  const hasContent = project.caseStudy || (project.learnings && project.learnings.length > 0) ||
                     (project.featuresDetailed && project.featuresDetailed.length > 0) || project.technical;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 flex justify-between items-center bg-[var(--bg)]/80 backdrop-blur-sm"
      >
        <Link
          href={`/${locale}/#work`}
          className="text-[14px] font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>{t("back")}</span>
        </Link>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
          {project.type} · {project.year}
        </span>
      </motion.nav>

      {/* Hero */}
      <header className="pt-28 sm:pt-36 pb-12 px-6 sm:px-10">
        <div className="max-w-[1100px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-[clamp(2.5rem,10vw,6rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-[var(--text)]"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 text-[var(--text-muted)] text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            {project.longDescription || project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text)] text-[var(--bg)] rounded-full text-[14px] font-semibold hover:bg-[var(--accent)] transition-colors"
              >
                <span>{t("buttons.viewProject")}</span>
                <span>↗</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--text)] rounded-full text-[14px] font-medium hover:border-[var(--text)] transition-colors"
              >
                {t("buttons.github")}
              </a>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="px-6 sm:px-10 pb-16"
      >
        <div className="max-w-[1100px] mx-auto">
          {project.heroImage ? (
            <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
              <Image
                src={project.heroImage}
                alt={project.title}
                width={1100}
                height={700}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="relative aspect-[2.5/1] rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={project.icon}
                  alt={project.title}
                  width={80}
                  height={80}
                  className="opacity-60"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
            </div>
          )}
        </div>
      </motion.section>

      {/* Quick Info */}
      <section className="px-6 sm:px-10 py-10 border-y border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-2">{t("year")}</p>
            <p className="text-[var(--text)] font-semibold text-lg">{project.year}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-2">{t("type")}</p>
            <p className="text-[var(--text)] font-semibold text-lg">{project.type}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-2">{t("category")}</p>
            <p className="text-[var(--text)] font-semibold text-lg capitalize">{project.category}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-2">{t("stack")}</p>
            <p className="text-[var(--text)] font-semibold text-lg">{project.tech.slice(0, 3).join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Case Study */}
      {project.caseStudy && (
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-12 md:gap-16"
            >
              {/* Left column */}
              <div className="space-y-10">
                <motion.div variants={fadeIn}>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-4">
                    {t("caseStudy.problem")}
                  </h3>
                  <p className="text-[var(--text)] leading-relaxed text-lg">
                    {project.caseStudy.problem}
                  </p>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-4">
                    {t("caseStudy.process")}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {project.caseStudy.process}
                  </p>
                </motion.div>
              </div>

              {/* Right column */}
              <div className="space-y-10">
                <motion.div variants={fadeIn}>
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-4">
                    {t("caseStudy.solution")}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {project.caseStudy.solution}
                  </p>
                </motion.div>

                {project.caseStudy.results && (
                  <motion.div variants={fadeIn} className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                    <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-4">
                      {t("caseStudy.results")}
                    </h3>
                    <p className="text-[var(--text)] leading-relaxed">
                      {project.caseStudy.results}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Learnings */}
      {project.learnings && project.learnings.length > 0 && (
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[var(--bg-secondary)]">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">
                {t("learnings")}
              </span>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-4"
            >
              {project.learnings.map((learning, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="flex gap-4 p-5 bg-[var(--bg)] rounded-xl border border-[var(--border)]"
                >
                  <span className="text-xl font-semibold text-[var(--accent)] shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[var(--text)] leading-relaxed">{learning}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features */}
      {project.featuresDetailed && project.featuresDetailed.length > 0 && (
        <section className="px-6 sm:px-10 py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">
                {t("features")}
              </span>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-6"
            >
              {project.featuresDetailed.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="grid md:grid-cols-[60px,1fr] gap-4 pb-6 border-b border-[var(--border)] last:border-0 last:pb-0"
                >
                  <span className="text-2xl font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-2">{feature.name}</h4>
                    <p className="text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
                    {feature.how && (
                      <p className="mt-3 text-sm text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-4">
                        {feature.how}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Technical */}
      {project.technical && (
        <section className="px-6 sm:px-10 py-20 sm:py-28 bg-[var(--bg-secondary)]">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">
                {t("technical")}
              </span>
            </motion.div>

            <div className="space-y-12">
              {project.technical.architecture && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-4">
                    {t("architecture")}
                  </h3>
                  <p className="text-[var(--text)] leading-relaxed text-lg">{project.technical.architecture}</p>
                </motion.div>
              )}

              {project.technical.highlights && project.technical.highlights.length > 0 && (
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-6">
                    {t("highlights")}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {project.technical.highlights.map((h, i) => (
                      <motion.div
                        key={i}
                        variants={fadeIn}
                        className="p-5 bg-[var(--bg)] rounded-xl border border-[var(--border)]"
                      >
                        <p className="font-semibold text-[var(--text)] mb-2">{h.title}</p>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{h.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {project.technical.challenges && project.technical.challenges.length > 0 && (
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <h3 className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-6">
                    {t("challenges")}
                  </h3>
                  <div className="space-y-4">
                    {project.technical.challenges.map((c, i) => (
                      <motion.div
                        key={i}
                        variants={fadeIn}
                        className="grid md:grid-cols-2 gap-6 p-5 bg-[var(--bg)] rounded-xl border border-[var(--border)]"
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-2">{t("challenge")}</p>
                          <p className="text-[var(--text)] leading-relaxed">{c.challenge}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-2">{t("solution")}</p>
                          <p className="text-[var(--text-muted)] leading-relaxed">{c.solution}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack - Only show if no rich content above */}
      {!hasContent && (
        <section className="px-6 sm:px-10 py-16">
          <div className="max-w-[1100px] mx-auto">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold block mb-6">
              {t("technologies")}
            </span>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-[14px] font-medium bg-[var(--bg-secondary)] text-[var(--text)] rounded-full border border-[var(--border)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="px-6 sm:px-10 py-20">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">
                {t("gallery")}
              </span>
            </motion.div>
            <div className="grid gap-8">
              {project.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--border)]">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </div>
                  {img.caption && (
                    <p className="text-[var(--text-muted)] text-sm mt-4">{img.caption}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="px-6 sm:px-10 py-16 sm:py-20 border-t border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            {prev ? (
              <Link href={`/${locale}/projects/${prev.id}`} className="group">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-3">
                  {t("nav.prev")}
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <Link href={`/${locale}/#work`} className="group">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-3">
                  ← {t("back")}
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t("nav.all")}
                </p>
              </Link>
            )}

            {next ? (
              <Link href={`/${locale}/projects/${next.id}`} className="group sm:text-right">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-3">
                  {t("nav.next")}
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {next.title}
                </p>
              </Link>
            ) : (
              <Link href={`/${locale}/#work`} className="group sm:text-right">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-3">
                  {t("nav.viewMore")}
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {t("nav.all")}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

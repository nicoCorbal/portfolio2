"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import HoverPopup from "@/components/HoverPopup";

/* ── Collage popup: photos scatter in with stagger ── */
function CollagePopup({ images, label }: { images: { src: string; alt: string; rotate: string; z: number; left: string; top: string; w: string; h: string }[]; label?: string }) {
  return (
    <span className="block w-[320px]">
      <span className="relative block h-[210px] w-full">
        {images.map((img, i) => (
          <span
            key={i}
            className="absolute collage-photo"
            style={{
              width: img.w,
              height: img.h,
              left: img.left,
              top: img.top,
              transform: `rotate(${img.rotate})`,
              zIndex: img.z,
            }}
          >
            <span
              className="block w-full h-full rounded-lg overflow-hidden"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.1)" }}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="150px" />
            </span>
          </span>
        ))}
      </span>
      {label && (
        <span className="block px-4 py-2.5 text-xs text-[var(--text-muted)]">{label}</span>
      )}
    </span>
  );
}

/* ── Cover grid: staggered entrance + hover dimming ── */
function CoverGridPopup({ covers, label }: { covers: { src: string; alt: string }[]; label?: React.ReactNode }) {
  return (
    <span className="block w-[320px]">
      <span className="flex gap-2.5 p-3 cover-grid">
        {covers.map((cover, i) => (
          <span
            key={i}
            className="relative flex-1 aspect-[2/3] rounded-lg overflow-hidden cover-item"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          >
            <Image src={cover.src} alt={cover.alt} fill className="object-cover" sizes="90px" />
          </span>
        ))}
      </span>
      {label && (
        <span className="block px-4 pb-3 text-xs text-[var(--text-muted)]">{label}</span>
      )}
    </span>
  );
}

/* ── Icon + text card ── */
export function IconCardPopup({ icon, icon_bg, title, desc, invert = false, full = false }: { icon: string; icon_bg?: string; title: React.ReactNode; desc: React.ReactNode; invert?: boolean; full?: boolean }) {
  return (
    <span className="flex items-center gap-3 w-[280px] px-4 py-3">
      <span
        className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${full ? "overflow-hidden" : ""}`}
        style={{ backgroundColor: icon_bg }}
      >
        <Image src={icon} alt="" width={full ? 48 : 24} height={full ? 48 : 24} className={`${invert ? "brightness-0 invert" : ""} ${full ? "w-full h-full" : ""}`} />
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-[var(--text-muted)]">{desc}</span>
      </span>
    </span>
  );
}

/* ── Image + text card with stagger + ken burns ── */
function ImageCardPopup({ image, title, desc }: { image: string; title: React.ReactNode; desc: React.ReactNode }) {
  return (
    <span className="block w-[320px] popup-stagger">
      <span className="relative block h-[160px] w-full popup-img-zoom">
        <Image src={image} alt="" fill className="object-cover" sizes="320px" />
      </span>
      <span className="flex flex-col gap-0.5 px-4 py-3">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</span>
      </span>
    </span>
  );
}

/* ── Letter avatar card ── */
function StudioPopup({ name, desc, color }: { name: string; desc: string; color: string }) {
  return (
    <span className="flex items-center gap-3 w-[280px] px-4 py-3">
      <span
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0)}
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm">{name}</span>
        <span className="text-xs text-[var(--text-muted)]">{desc}</span>
      </span>
    </span>
  );
}

/* ── Symbol + text card (X, Illustrator, socials) ── */
export function SymbolCardPopup({ symbol, bg, fg, title, desc }: { symbol: string; bg: string; fg?: string; title: React.ReactNode; desc: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3 w-[280px] px-4 py-3">
      <span
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base"
        style={{ backgroundColor: bg, color: fg || "#fff" }}
      >
        {symbol}
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-[var(--text-muted)]">{desc}</span>
      </span>
    </span>
  );
}

/* ── Image data ── */

const MUSIC_COVERS = [
  { src: "/popups/music-aphex.jpg", alt: "Aphex Twin — SAW 85-92" },
  { src: "/popups/music-klang.jpg", alt: "Klangkuenstler" },
  { src: "/popups/music-hector.jpg", alt: "Héctor Oaks — Fuego Universal" },
];

const FILM_COVERS = [
  { src: "/popups/film-bellezza.jpg", alt: "La Grande Bellezza" },
  { src: "/popups/film-popes.jpg", alt: "The Two Popes" },
  { src: "/popups/film-requiem.jpg", alt: "Requiem for a Dream" },
];

const BOOK_COVERS = [
  { src: "/popups/book-rams.jpg", alt: "Dieter Rams — Less But Better" },
  { src: "/popups/book-camus.jpg", alt: "Albert Camus — El hombre rebelde" },
  { src: "/popups/book-nightfever.jpg", alt: "Night Fever" },
  { src: "/popups/book-1q84.jpg", alt: "Murakami — 1Q84" },
];

export default function Bio() {
  const t = useTranslations("bio");
  const link_class = "underline underline-offset-3 decoration-[var(--text-muted)] hover:decoration-[var(--text)] transition-colors";

  return (
    <section className="space-y-5 text-[15px] leading-relaxed">
      {/* P1: Who */}
      <p>
        {t.rich("p1", {
          osix: (chunks) => (
            <HoverPopup position="bottom" content={<ImageCardPopup image="/popups/studio-osix.png" title={t("popups.osix.title")} desc={t("popups.osix.desc")} />}>
              <a href="https://osix.tech" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
          usc: (chunks) => (
            <HoverPopup position="bottom" content={<ImageCardPopup image="/popups/usc.jpg" title={t("popups.usc.title")} desc={t("popups.usc.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
        })}
      </p>

      {/* P2: What */}
      <p>
        {t.rich("p2", {
          role: (chunks) => <span className="font-medium">{chunks}</span>,
        })}
      </p>

      {/* P3: Day to day */}
      <p>{t("p3")}</p>

      {/* Stack */}
      <p>
        {t.rich("stack", {
          react: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-react.svg" icon_bg="#222222" title={t("popups.react.title")} desc={t("popups.react.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          next: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-next.svg" icon_bg="#000000" title={t("popups.next.title")} desc={t("popups.next.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          ts: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-ts.svg" icon_bg="#3178C6" title={t("popups.ts.title")} desc={t("popups.ts.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          tailwind: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-tailwind.svg" icon_bg="#222222" title={t("popups.tailwind.title")} desc={t("popups.tailwind.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          figma: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-figma.svg" icon_bg="#1E1E1E" title={t("popups.figma.title")} desc={t("popups.figma.desc")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          illustrator: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-illustrator.svg" icon_bg="#300" title={t("popups.illustrator.title")} desc={t("popups.illustrator.desc")} full />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          photoshop: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-photoshop.svg" icon_bg="#001E36" title={t("popups.photoshop.title")} desc={t("popups.photoshop.desc")} full />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          aftereffects: (chunks) => (
            <HoverPopup content={<IconCardPopup icon="/popups/tech-aftereffects.svg" icon_bg="#1f0040" title={t("popups.aftereffects.title")} desc={t("popups.aftereffects.desc")} full />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
        })}
      </p>

      {/* P4: Studios */}
      <p>
        {t.rich("p4", {
          lusion: (chunks) => (
            <HoverPopup content={<ImageCardPopup image="/popups/studio-lusion.jpg" title={t("popups.lusion.title")} desc={t("popups.lusion.desc")} />}>
              <a href="https://lusion.co" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
          linear: (chunks) => (
            <HoverPopup content={<ImageCardPopup image="/popups/studio-linear.jpg" title={t("popups.linear.title")} desc={t("popups.linear.desc")} />}>
              <a href="https://linear.app" target="_blank" rel="noopener noreferrer" className={link_class}>{chunks}</a>
            </HoverPopup>
          ),
        })}
      </p>

      {/* P5: Interests */}
      <p>
        {t.rich("p5", {
          music: (chunks) => (
            <HoverPopup content={<CoverGridPopup covers={MUSIC_COVERS} label={t("popups.music.label")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          films: (chunks) => (
            <HoverPopup content={<CoverGridPopup covers={FILM_COVERS} label={t("popups.films.label")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
          books: (chunks) => (
            <HoverPopup content={<CoverGridPopup covers={BOOK_COVERS} label={t("popups.books.label")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
        })}
      </p>

      {/* P7: CTA */}
      <p>
        {t.rich("p7", {
          link: (chunks) => (
            <a href="mailto:nicocorbal@gmail.com" className={link_class}>{chunks}</a>
          ),
        })}
      </p>
    </section>
  );
}

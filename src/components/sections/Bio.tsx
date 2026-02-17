"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import HoverPopup from "@/components/HoverPopup";

/* ── Collage popup: scattered photos at angles ── */
function CollagePopup({ images, label }: { images: { src: string; alt: string; rotate: string; z: number; left: string; top: string; w: string; h: string }[]; label?: string }) {
  return (
    <span className="block w-[280px]">
      <span className="relative block h-[180px] w-full">
        {images.map((img, i) => (
          <span
            key={i}
            className="absolute rounded-lg overflow-hidden border-2 border-[var(--bg-secondary)]"
            style={{
              width: img.w,
              height: img.h,
              left: img.left,
              top: img.top,
              transform: `rotate(${img.rotate})`,
              zIndex: img.z,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="140px" />
          </span>
        ))}
      </span>
      {label && (
        <span className="block px-4 py-2.5 text-xs text-[var(--text-muted)]">{label}</span>
      )}
    </span>
  );
}

/* ── Cover grid: albums, movies, or books side by side ── */
function CoverGridPopup({ covers, label }: { covers: { src: string; alt: string }[]; label?: string }) {
  return (
    <span className="block w-[280px]">
      <span className="flex gap-2 p-3">
        {covers.map((cover, i) => (
          <span
            key={i}
            className="relative flex-1 aspect-[2/3] rounded-md overflow-hidden transition-transform duration-200 ease-out hover:scale-110 hover:z-10"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
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

/* ── Icon + text card (OSIX, studios) ── */
function IconCardPopup({ icon, icon_bg, title, desc }: { icon: string; icon_bg: string; title: string; desc: string }) {
  return (
    <span className="flex items-center gap-3 w-[260px] px-4 py-3">
      <span
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: icon_bg }}
      >
        <Image src={icon} alt={title} width={24} height={24} className="brightness-0 invert" />
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-[var(--text-muted)]">{desc}</span>
      </span>
    </span>
  );
}

/* ── Image + text card (USC) ── */
function ImageCardPopup({ image, title, desc }: { image: string; title: string; desc: string }) {
  return (
    <span className="block w-[280px]">
      <span className="relative block h-[120px] w-full">
        <Image src={image} alt={title} fill className="object-cover" sizes="280px" />
      </span>
      <span className="flex flex-col gap-0.5 px-4 py-3">
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-[var(--text-muted)]">{desc}</span>
      </span>
    </span>
  );
}

/* ── Letter avatar card (studios without icon) ── */
function StudioPopup({ name, desc, color }: { name: string; desc: string; color: string }) {
  return (
    <span className="flex items-center gap-3 w-[240px] px-4 py-3">
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

/* ── Image data ── */
const BERLIN_IMAGES = [
  { src: "/popups/berlin-1.jpg", alt: "Berlin night", rotate: "-4deg", z: 1, left: "10px", top: "20px", w: "130px", h: "100px" },
  { src: "/popups/berlin-2.jpg", alt: "Berlin neon", rotate: "3deg", z: 2, left: "75px", top: "45px", w: "130px", h: "100px" },
  { src: "/popups/berlin-3.jpg", alt: "Berghain", rotate: "-2deg", z: 3, left: "140px", top: "10px", w: "130px", h: "100px" },
];


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

      {/* P6: Berlin */}
      <p>
        {t.rich("p6", {
          berlin: (chunks) => (
            <HoverPopup content={<CollagePopup images={BERLIN_IMAGES} label={t("popups.berlin.label")} />}>
              <span className={`${link_class} cursor-default`}>{chunks}</span>
            </HoverPopup>
          ),
        })}
      </p>

      {/* P7: CTA */}
      <p>
        {t.rich("p7", {
          link: (chunks) => (
            <a href="mailto:hola@nicolascorbal.com" className={link_class}>{chunks}</a>
          ),
        })}
      </p>
    </section>
  );
}

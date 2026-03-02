"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import HoverPopup from "@/components/HoverPopup";

/* ── Popup: portada de libro/álbum ── */
function CoverPopup({ src, alt, label }: { src: string; alt: string; label: React.ReactNode }) {
    return (
        <span className="block w-[220px]">
            <span className="relative block h-[220px] w-full popup-img-zoom">
                <Image src={src} alt={alt} fill className="object-cover" sizes="220px" />
            </span>
            <span className="block px-4 py-2.5 text-xs text-[var(--text-muted)]">{label}</span>
        </span>
    );
}

/* ── Popup: imagen + texto ── */
function ImageCardPopup({ image, title, desc }: { image: string; title: React.ReactNode; desc: React.ReactNode }) {
    return (
        <span className="block w-[280px] popup-stagger">
            <span className="relative block h-[140px] w-full popup-img-zoom">
                <Image src={image} alt="" fill className="object-cover" sizes="280px" />
            </span>
            <span className="flex flex-col gap-0.5 px-4 py-3">
                <span className="font-medium text-sm">{title}</span>
                <span className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</span>
            </span>
        </span>
    );
}

/* ── Popup: dos portadas de álbum ── */
function DualCoverPopup({ covers, label }: { covers: { src: string; alt: string }[]; label: React.ReactNode }) {
    return (
        <span className="block w-[260px]">
            <span className="flex gap-2 p-3 cover-grid">
                {covers.map((c, i) => (
                    <span
                        key={i}
                        className="relative flex-1 aspect-square rounded-lg overflow-hidden cover-item"
                        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                    >
                        <Image src={c.src} alt={c.alt} fill className="object-cover" sizes="110px" />
                    </span>
                ))}
            </span>
            <span className="block px-4 pb-3 text-xs text-[var(--text-muted)]">{label}</span>
        </span>
    );
}

type RowProps = {
    label: React.ReactNode;
    children: React.ReactNode;
};

function NowRow({ label, children }: RowProps) {
    return (
        <div className="flex items-baseline gap-4 py-3.5 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-sm w-28 shrink-0">{label}</span>
            <span className="text-sm">{children}</span>
        </div>
    );
}

export default function Now() {
    const t = useTranslations("now");
    const link = "underline underline-offset-3 decoration-[var(--text-muted)] hover:decoration-[var(--text)] transition-colors";

    return (
        <section>
            <h2 className="text-sm font-medium text-[var(--text-muted)] mb-6">{t("title")}</h2>
            <div>

                {/* Trabajando en */}
                <NowRow label={t("labels.working")}>
                    <HoverPopup content={
                        <ImageCardPopup
                            image="/popups/studio-osix.png"
                            title="OSIX"
                            desc={t("popups.osix")}
                        />
                    }>
                        <a href="https://osix.tech" target="_blank" rel="noopener noreferrer" className={link}>
                            {t("items.working")}
                        </a>
                    </HoverPopup>
                </NowRow>

                {/* Escuchando */}
                <NowRow label={t("labels.listening")}>
                    <HoverPopup content={
                        <DualCoverPopup
                            covers={[
                                { src: "/popups/music-hector.jpg", alt: "Héctor Oaks" },
                                { src: "/popups/music-klang.jpg", alt: "Klangkuenstler" },
                            ]}
                            label={t("popups.music")}
                        />
                    }>
                        <span className="cursor-default">{t("items.listening")}</span>
                    </HoverPopup>
                </NowRow>

                {/* Leyendo */}
                <NowRow label={t("labels.reading")}>
                    <HoverPopup content={
                        <CoverPopup
                            src="/popups/book-1q84.jpg"
                            alt="1Q84"
                            label={t("popups.book")}
                        />
                    }>
                        <span className="cursor-default">{t("items.reading")}</span>
                    </HoverPopup>
                </NowRow>

                {/* Desde */}
                <NowRow label={t("labels.location")}>
                    {t("items.location")}
                </NowRow>

            </div>
        </section>
    );
}

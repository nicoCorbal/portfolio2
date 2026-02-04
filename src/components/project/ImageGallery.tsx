"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  if (!images || images.length === 0) return null;

  return (
    <section ref={containerRef} className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
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
            Gallery
          </span>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${index === 0 && images.length > 2 ? "md:col-span-2" : ""}`}
            >
              <motion.div
                style={index === 0 ? { y } : {}}
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
              {image.caption && (
                <p className="mt-3 text-[12px] sm:text-[13px] text-[var(--text-muted)]">
                  {image.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

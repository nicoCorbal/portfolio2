"use client";

import { motion } from "framer-motion";
import { letterStagger, letterVariant } from "@/lib/animations";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const letters = text.split("");

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={letterStagger}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariant}
          className="inline-block"
          style={{ display: letter === " " ? "inline" : "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Preloader from "@/components/Preloader";
import TypingGame from "@/components/TypingGame";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <TypingGame />

      <main
        id="main-content"
        className="relative bg-[var(--bg)] overflow-hidden"
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
      >
        <TopBar />
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );
}

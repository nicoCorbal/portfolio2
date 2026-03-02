"use client";

import Header from "@/components/Header";
import Bio from "@/components/sections/Bio";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main-content" className="max-w-[720px] mx-auto px-6 py-16 animate-[fade-in_0.5s_ease-out_both]">
      <Header />
      <Bio />
      <hr className="my-12 border-[var(--border)]" />
      <ProjectsGrid />
      <hr className="my-12 border-[var(--border)]" />
      <Contact />
    </main>
  );
}

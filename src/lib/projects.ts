import projectsEs from "@/data/projects.es.json";
import projectsEn from "@/data/projects.en.json";

export interface Project {
  id: string;
  title: string;
  year: string;
  type: string;
  category: "professional" | "personal";
  description: string;
  longDescription?: string;

  // Case Study
  caseStudy?: {
    problem: string;
    process: string;
    solution: string;
    results?: string;
  };

  // What I learned
  learnings?: string[];

  // Technical deep dive
  technical?: {
    architecture?: string;
    highlights?: {
      title: string;
      description: string;
    }[];
    challenges?: {
      challenge: string;
      solution: string;
    }[];
  };

  // Detailed features
  featuresDetailed?: {
    name: string;
    description: string;
    how?: string;
  }[];

  // Gallery
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];

  features: string[];
  tech: string[];
  icon: string;
  heroImage?: string;
  screenshot?: string;
  color: string;
  link?: string;
  github?: string;
  metaDescription?: string;
}

// Get projects by locale
function getProjects(locale: string = "es"): Project[] {
  return (locale === "en" ? projectsEn : projectsEs) as Project[];
}

// Helper functions
export function getProjectBySlug(slug: string, locale: string = "es"): Project | undefined {
  const projects = getProjects(locale);
  return projects.find((p) => p.id === slug);
}

export function getProjectsByCategory(category: "professional" | "personal", locale: string = "es"): Project[] {
  const projects = getProjects(locale);
  return projects.filter((p) => p.category === category);
}

export function getAdjacentProjects(currentId: string, locale: string = "es"): { prev: Project | null; next: Project | null } {
  const projects = getProjects(locale);
  const index = projects.findIndex((p) => p.id === currentId);
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export function getAllProjects(locale: string = "es"): Project[] {
  return getProjects(locale);
}

export function get_project_index(id: string, locale: string = "es"): number {
  return getProjects(locale).findIndex((p) => p.id === id);
}

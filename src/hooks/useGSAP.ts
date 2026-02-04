"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Hook to initialize GSAP with ScrollTrigger
 * Returns a ref to attach to the container element
 */
export function useGSAP<T extends HTMLElement = HTMLDivElement>(
  callback: (gsapContext: gsap.Context) => void,
  dependencies: React.DependencyList = []
) {
  const containerRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, containerRef);

    return () => ctx.revert();
  }, dependencies);

  return containerRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  animation: gsap.TweenVars,
  triggerOptions: ScrollTrigger.Vars = {}
) {
  const elementRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current) return;

    const tween = gsap.from(elementRef.current, {
      ...animation,
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
        ...triggerOptions,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return elementRef;
}

/**
 * Hook for parallax effects
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.5
) {
  const elementRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current) return;

    const tween = gsap.to(elementRef.current, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  return elementRef;
}

/**
 * Hook for magnetic button effect
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength: number = 0.3
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}

export { gsap, ScrollTrigger };

import { Variants, Transition } from "framer-motion";

// Durations
export const DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Easings
export const EASINGS = {
  out: [0.23, 1, 0.32, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

// Spring configs
export const SPRINGS = {
  soft: { type: "spring", stiffness: 100, damping: 15 },
  medium: { type: "spring", stiffness: 200, damping: 20 },
  stiff: { type: "spring", stiffness: 400, damping: 30 },
  bouncy: { type: "spring", stiffness: 300, damping: 10 },
} as const;

// Common transitions
export const TRANSITIONS: Record<string, Transition> = {
  default: { duration: DURATIONS.normal, ease: EASINGS.out },
  fast: { duration: DURATIONS.fast, ease: EASINGS.out },
  slow: { duration: DURATIONS.slow, ease: EASINGS.smooth },
  spring: SPRINGS.medium,
  bouncy: SPRINGS.bouncy,
};

// Fade variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITIONS.default },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.default },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.default },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: TRANSITIONS.default },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: TRANSITIONS.default },
};

// Scale variants
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: TRANSITIONS.spring },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: SPRINGS.bouncy },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Letter stagger for text animations
export const letterStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const letterVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.out },
  },
};

// Hover animations
export const hoverScale = {
  scale: 1.02,
  transition: TRANSITIONS.fast,
};

export const hoverScaleLarge = {
  scale: 1.05,
  transition: TRANSITIONS.fast,
};

export const hoverLift = {
  y: -4,
  transition: TRANSITIONS.fast,
};

export const hoverLiftLarge = {
  y: -8,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  transition: TRANSITIONS.default,
};

export const tapScale = {
  scale: 0.98,
  transition: TRANSITIONS.fast,
};

// Scroll-triggered animations
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slower, ease: EASINGS.out },
  },
};

export const scrollRevealScale: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.out },
  },
};

// Parallax helper
export const parallaxY = (offset: number) => ({
  y: offset,
  transition: { type: "tween", ease: "linear" },
});

// Magnetic button helper
export const magneticHover = (x: number, y: number) => ({
  x: x * 0.3,
  y: y * 0.3,
  transition: TRANSITIONS.fast,
});

// Underline animation for links
export const underlineVariants: Variants = {
  initial: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, transition: TRANSITIONS.default },
};

// Card hover effect
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: TRANSITIONS.default,
  },
};

// Glow effect
export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 0 0 rgba(20, 20, 20, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(20, 20, 20, 0)",
      "0 0 20px 10px rgba(20, 20, 20, 0.1)",
      "0 0 0 0 rgba(20, 20, 20, 0)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

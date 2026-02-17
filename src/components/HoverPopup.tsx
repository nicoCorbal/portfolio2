"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom";
};

export default function HoverPopup({ children, content, position = "top" }: Props) {
  const [visible, set_visible] = useState(false);
  const timeout_ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timeout_ref.current) clearTimeout(timeout_ref.current);
    set_visible(true);
  }, []);

  const hide = useCallback(() => {
    timeout_ref.current = setTimeout(() => set_visible(false), 120);
  }, []);

  const is_top = position === "top";

  return (
    <span
      className="relative inline"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <span
        className={`absolute left-1/2 z-50 ${is_top ? "bottom-full mb-3" : "top-full mt-3"}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(-50%) translateY(0) scale(1)"
            : `translateX(-50%) translateY(${is_top ? "8px" : "-8px"}) scale(0.97)`,
          transition: "opacity 0.2s cubic-bezier(0.16,1,0.3,1), transform 0.2s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <span
          className="block overflow-hidden rounded-xl bg-[var(--bg-secondary)] text-[var(--text)]"
          style={{
            boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid var(--border)",
          }}
        >
          {content}
        </span>
      </span>
    </span>
  );
}

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
    timeout_ref.current = setTimeout(() => set_visible(false), 150);
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
            : `translateX(-50%) translateY(${is_top ? "16px" : "-16px"}) scale(0.8)`,
          transition: visible
            ? "opacity 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "opacity 0.15s ease-out, transform 0.15s ease-out",
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <span
          data-open={visible}
          className="block overflow-hidden rounded-2xl bg-[var(--bg-secondary)] text-[var(--text)]"
          style={{
            boxShadow: "var(--popup-shadow)",
            border: "1px solid var(--border)",
          }}
        >
          {content}
        </span>
      </span>
    </span>
  );
}

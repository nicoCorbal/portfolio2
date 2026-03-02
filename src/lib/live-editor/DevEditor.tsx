"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { create_selector, type SelectedInfo } from "./engine/selector";
import { apply_patch } from "./engine/patcher";
import { TextEditor, type SaveStatus } from "./panels/TextEditor";

// --- Icons (14px, thin stroke) ---
const ICON_PENCIL = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" />
  </svg>
);

const ICON_CHECK = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 4.5L6 12L2.5 8.5" />
  </svg>
);

export function DevEditor() {
  const [edit_mode, set_edit_mode] = useState(false);
  const [selected, set_selected] = useState<SelectedInfo | null>(null);
  const [save_status, set_save_status] = useState<SaveStatus>("idle");
  const btn_ref = useRef<HTMLButtonElement>(null);

  // Sync edit_mode to DOM + calculate wave delays
  useEffect(() => {
    document.body.dataset.liveEditMode = String(edit_mode);

    if (edit_mode && btn_ref.current) {
      const br = btn_ref.current.getBoundingClientRect();
      const bx = br.left + br.width / 2;
      const by = br.top + br.height / 2;

      const editables = document.querySelectorAll<HTMLElement>("[data-editable]");
      let max_dist = 0;
      const entries: { el: HTMLElement; dist: number }[] = [];

      editables.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dist = Math.hypot(r.left + r.width / 2 - bx, r.top + r.height / 2 - by);
        entries.push({ el, dist });
        if (dist > max_dist) max_dist = dist;
      });

      entries.forEach(({ el, dist }) => {
        const t = max_dist > 0 ? dist / max_dist : 0;
        el.style.setProperty("--le-delay", `${Math.round(t * 500)}ms`);
      });
    }

    return () => {
      delete document.body.dataset.liveEditMode;
      document.querySelectorAll<HTMLElement>("[data-editable]").forEach((el) => {
        el.style.removeProperty("--le-delay");
      });
    };
  }, [edit_mode]);

  // Keyboard shortcut: Cmd+E / Ctrl+E
  useEffect(() => {
    function handle_keydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        set_edit_mode((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handle_keydown);
    return () => document.removeEventListener("keydown", handle_keydown);
  }, []);

  // Activate event-delegation selector when in edit mode
  useEffect(() => {
    if (!edit_mode) {
      set_selected(null);
      return;
    }

    const cleanup = create_selector(
      () => {},
      (info) => {
        set_save_status("idle");
        set_selected(info);
      }
    );

    return cleanup;
  }, [edit_mode]);

  const handle_toggle = useCallback(() => {
    set_edit_mode((prev) => !prev);
  }, []);

  const handle_save = useCallback(
    async (new_text: string) => {
      if (!selected) return;

      set_save_status("saving");
      try {
        await apply_patch(selected.source_file, selected.content_key, new_text);
        set_save_status("saved");
      } catch {
        set_save_status("error");
      }
    },
    [selected]
  );

  const handle_close = useCallback(() => {
    set_selected(null);
    set_save_status("idle");
  }, []);

  return (
    <>
      {/* Toggle button */}
      <button
        ref={btn_ref}
        type="button"
        onClick={handle_toggle}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--bg)",
          backgroundColor: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          cursor: "pointer",
          transition: "opacity 0.15s, transform 0.15s",
          opacity: 0.9,
          animation: "le-float-in 0.3s ease both",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.9"; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {edit_mode ? (
          <>
            {ICON_CHECK}
            <span>Done</span>
          </>
        ) : (
          <>
            {ICON_PENCIL}
            <span>Edit</span>
            <kbd style={{
              marginLeft: 2,
              display: "inline-flex",
              alignItems: "center",
              height: 18,
              padding: "0 5px",
              fontSize: 10,
              fontWeight: 500,
              fontFamily: "inherit",
              lineHeight: 1,
              color: "var(--bg)",
              opacity: 0.5,
              backgroundColor: "transparent",
              border: "1px solid",
              borderColor: "inherit",
              borderRadius: 4,
            }}>
              ⌘E
            </kbd>
          </>
        )}
      </button>

      {/* Text editor panel */}
      {selected && (
        <TextEditor
          key={selected.content_key}
          target={selected.element}
          initial_text={selected.text}
          on_save={handle_save}
          on_close={handle_close}
          content_key={selected.content_key}
          save_status={save_status}
        />
      )}
    </>
  );
}

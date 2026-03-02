"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

/* ── Icons ── */
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

/* ── Field keys for data-demo-editable ── */
type FieldKey = "title" | "subtitle" | "bio" | "detail_1" | "detail_2";

/* ── Inline Editor Panel (absolute, scoped to container) ── */
function DemoPanel({
  field_key,
  initial_text,
  rect,
  container_rect,
  on_save,
  on_close,
}: {
  field_key: string;
  initial_text: string;
  rect: DOMRect;
  container_rect: DOMRect;
  on_save: (key: string, text: string) => void;
  on_close: () => void;
}) {
  const wrapper_ref = useRef<HTMLDivElement>(null);
  const latest_text = useRef(initial_text);
  const [morphed, set_morphed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => set_morphed(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: "Type here..." }),
    ],
    content: `<p>${initial_text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
    onUpdate: ({ editor: e }) => {
      latest_text.current = e.getText();
    },
    editorProps: {
      attributes: {
        class: "outline-none focus:outline-none min-h-[1em] px-3 py-2 text-[var(--le-panel-text)] text-sm leading-relaxed",
      },
    },
    immediatelyRender: false,
    autofocus: "end",
  });

  const save_and_close = useCallback(() => {
    const text = latest_text.current.trim();
    if (text && text !== initial_text.trim()) {
      on_save(field_key, text);
    }
    on_close();
  }, [field_key, initial_text, on_save, on_close]);

  /* Close on click outside (scoped to container via parent) */
  useEffect(() => {
    function handle_mousedown(e: MouseEvent) {
      if (wrapper_ref.current && !wrapper_ref.current.contains(e.target as Node)) {
        save_and_close();
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handle_mousedown);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handle_mousedown);
    };
  }, [save_and_close]);

  /* Close on Escape */
  useEffect(() => {
    function handle_keydown(e: KeyboardEvent) {
      if (e.key === "Escape") save_and_close();
    }
    document.addEventListener("keydown", handle_keydown);
    return () => document.removeEventListener("keydown", handle_keydown);
  }, [save_and_close]);

  /* Position relative to container */
  const rel_top = rect.top - container_rect.top;
  const rel_left = rect.left - container_rect.left;
  const panel_left = Math.max(rel_left - 8, 8);
  const panel_width = Math.min(Math.max(rect.width + 16, 320), container_rect.width - 16);

  const wrapper_style: React.CSSProperties = {
    position: "absolute",
    zIndex: 50,
    top: morphed ? rel_top - 8 : rel_top,
    left: morphed ? panel_left : rel_left,
    width: morphed ? panel_width : rect.width,
    minHeight: morphed ? rect.height + 48 : rect.height,
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const card_style: React.CSSProperties = {
    borderRadius: morphed ? 12 : 3,
    boxShadow: morphed
      ? "0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 20px -8px rgba(0,0,0,0.1)"
      : "none",
    outline: morphed
      ? "2px solid var(--le-panel-ring)"
      : "1.5px dashed var(--le-accent)",
    outlineOffset: morphed ? 2 : 3,
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
  };

  if (!editor) return null;

  return (
    <>
      {/* Backdrop — scoped to container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          backgroundColor: morphed ? "rgba(0,0,0,0.06)" : "transparent",
          backdropFilter: morphed ? "blur(2px)" : "blur(0px)",
          WebkitBackdropFilter: morphed ? "blur(2px)" : "blur(0px)",
          borderRadius: "inherit",
          transition: "all 0.35s ease",
        }}
      />

      {/* Editor panel */}
      <div ref={wrapper_ref} style={wrapper_style}>
        <div className="bg-[var(--le-panel-bg)]" style={card_style}>
          {/* Header */}
          <div
            style={{
              maxHeight: morphed ? 40 : 0,
              opacity: morphed ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
            }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--le-panel-border)] px-3 py-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--le-accent)]"
                style={{ animation: "le-pulse-ring 2s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-medium text-[var(--le-panel-text-muted)] font-mono truncate max-w-[200px] uppercase tracking-wider">
                {field_key}
              </span>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={save_and_close}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--le-panel-text-muted)] hover:bg-[var(--le-close-hover-bg)] hover:text-[var(--le-panel-text)] transition-colors"
                  title="Close (Esc)"
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="12" y2="12" />
                    <line x1="12" y1="4" x2="4" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}

/* ── Main Demo Component ── */
export function LiveEditorDemo() {
  const container_ref = useRef<HTMLDivElement>(null);
  const btn_ref = useRef<HTMLButtonElement>(null);
  const [edit_mode, set_edit_mode] = useState(false);
  const [hovered_key, set_hovered_key] = useState<string | null>(null);
  const [selected, set_selected] = useState<{ key: FieldKey; rect: DOMRect } | null>(null);

  const [fields, set_fields] = useState({
    title: "Nicolás Corbal",
    subtitle: "Product designer & developer",
    bio: "I build tools that make content editing feel natural and immediate.",
    detail_1: "Next.js · React · TypeScript",
    detail_2: "Santiago de Compostela, Spain",
  });

  /* Wave delay calculation when entering edit mode */
  useEffect(() => {
    if (!edit_mode || !container_ref.current || !btn_ref.current) return;

    const br = btn_ref.current.getBoundingClientRect();
    const bx = br.left + br.width / 2;
    const by = br.top + br.height / 2;

    const editables = container_ref.current.querySelectorAll<HTMLElement>("[data-demo-editable]");
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

    return () => {
      editables.forEach((el) => el.style.removeProperty("--le-delay"));
    };
  }, [edit_mode]);

  /* Hover handling (scoped to container) */
  const handle_mouse_over = useCallback(
    (e: React.MouseEvent) => {
      if (!edit_mode) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-demo-editable]");
      set_hovered_key(el?.getAttribute("data-demo-editable") ?? null);
    },
    [edit_mode]
  );

  const handle_mouse_out = useCallback(
    (e: React.MouseEvent) => {
      if (!edit_mode) return;
      const related = (e.relatedTarget as HTMLElement)?.closest?.("[data-demo-editable]");
      if (!related) set_hovered_key(null);
    },
    [edit_mode]
  );

  /* Click handling (scoped to container) */
  const handle_click = useCallback(
    (e: React.MouseEvent) => {
      if (!edit_mode) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-demo-editable]");
      if (!el) return;

      e.preventDefault();
      e.stopPropagation();

      const key = el.getAttribute("data-demo-editable") as FieldKey;
      if (!key) return;
      const rect = el.getBoundingClientRect();
      set_selected({ key, rect });
    },
    [edit_mode]
  );

  const handle_save = useCallback((key: string, text: string) => {
    set_fields((prev) => ({ ...prev, [key as FieldKey]: text }));
  }, []);

  const handle_close_panel = useCallback(() => {
    set_selected(null);
  }, []);

  const handle_toggle = useCallback(() => {
    set_edit_mode((prev) => {
      if (prev) set_selected(null);
      return !prev;
    });
    set_hovered_key(null);
  }, []);

  const container_rect = container_ref.current?.getBoundingClientRect();

  return (
    <div
      ref={container_ref}
      data-demo-edit-mode={edit_mode ? "true" : "false"}
      className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
      onMouseOver={handle_mouse_over}
      onMouseOut={handle_mouse_out}
      onClick={handle_click}
    >
      {/* Mock content */}
      <div className="px-8 py-10 sm:px-12 sm:py-14">
        <h2
          data-demo-editable="title"
          data-demo-hovered={hovered_key === "title" ? "" : undefined}
          className="text-2xl font-semibold tracking-tight mb-1"
        >
          {fields.title}
        </h2>
        <p
          data-demo-editable="subtitle"
          data-demo-hovered={hovered_key === "subtitle" ? "" : undefined}
          className="text-sm text-[var(--text-muted)] mb-4"
        >
          {fields.subtitle}
        </p>
        <p
          data-demo-editable="bio"
          data-demo-hovered={hovered_key === "bio" ? "" : undefined}
          className="text-sm leading-relaxed mb-3"
        >
          {fields.bio}
        </p>
        <div className="flex items-center gap-0 text-xs text-[var(--text-muted)]">
          <span
            data-demo-editable="detail_1"
            data-demo-hovered={hovered_key === "detail_1" ? "" : undefined}
          >
            {fields.detail_1}
          </span>
          <span className="mx-2">·</span>
          <span
            data-demo-editable="detail_2"
            data-demo-hovered={hovered_key === "detail_2" ? "" : undefined}
          >
            {fields.detail_2}
          </span>
        </div>
      </div>

      {/* Toggle button */}
      <button
        ref={btn_ref}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handle_toggle();
        }}
        className="absolute bottom-4 right-4 z-[60] flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity"
        style={{
          color: "var(--bg)",
          backgroundColor: "var(--text)",
          opacity: 0.9,
          animation: "le-float-in 0.3s ease both",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.9"; }}
      >
        {edit_mode ? (
          <>{ICON_CHECK}<span>Done</span></>
        ) : (
          <>{ICON_PENCIL}<span>Edit</span></>
        )}
      </button>

      {/* Editor panel (absolute, inside container) */}
      {selected && container_rect && (
        <DemoPanel
          key={selected.key}
          field_key={selected.key}
          initial_text={fields[selected.key]}
          rect={selected.rect}
          container_rect={container_rect}
          on_save={handle_save}
          on_close={handle_close_panel}
        />
      )}
    </div>
  );
}

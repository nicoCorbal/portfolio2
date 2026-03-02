"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { BubbleToolbar } from "../BubbleToolbar";
import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "../utils";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface TextEditorProps {
  target: HTMLElement;
  initial_text: string;
  on_save: (new_text: string) => void;
  on_close: () => void;
  content_key?: string;
  save_status?: SaveStatus;
}

/* ── Save Indicator — animated check draw ── */
function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium transition-all",
        status === "saving" && "text-[var(--le-panel-text-muted)]",
        status === "saved" && "text-[var(--le-panel-success)]",
        status === "error" && "text-[var(--le-panel-error)]"
      )}
    >
      {status === "saving" && (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <path
              d="M8 2a6 6 0 0 1 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ animation: "le-spin 0.7s linear infinite", transformOrigin: "center" }}
            />
          </svg>
          <span>Saving…</span>
        </>
      )}
      {status === "saved" && (
        <span className="inline-flex items-center gap-1.5">
          {/* Animated check with circle */}
          <span className="relative">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              {/* Circle draws in */}
              <circle
                cx="8" cy="8" r="7"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                opacity="0.2"
                style={{
                  strokeDasharray: 44,
                  strokeDashoffset: 44,
                  animation: "le-check-circle 0.4s cubic-bezier(0.65, 0, 0.35, 1) forwards",
                }}
              />
              {/* Check draws in with delay */}
              <path
                d="M5 8.5L7 10.5L11 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 12,
                  strokeDashoffset: 12,
                  animation: "le-check-draw 0.35s cubic-bezier(0.65, 0, 0.35, 1) 0.2s forwards",
                }}
              />
            </svg>
            {/* Success ping ring */}
            <span
              className="absolute inset-0 rounded-full border border-current"
              style={{ animation: "le-success-ping 0.6s ease-out 0.3s both" }}
            />
          </span>
          <span style={{ animation: "le-label-in 0.3s ease 0.25s both" }}>Saved</span>
        </span>
      )}
      {status === "error" && (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="7" />
            <line x1="8" y1="5" x2="8" y2="9" />
            <line x1="8" y1="11" x2="8" y2="11.5" />
          </svg>
          <span>Error</span>
        </>
      )}
    </span>
  );
}

export function TextEditor({
  target,
  initial_text,
  on_save,
  on_close,
  content_key,
  save_status = "idle",
}: TextEditorProps) {
  const wrapper_ref = useRef<HTMLDivElement>(null);
  const latest_text = useRef(initial_text);
  const [morphed, set_morphed] = useState(false);

  // Double rAF for morph: paint unmorphed frame first, then transition
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
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Type here..." }),
      Highlight,
      Typography,
    ],
    content: `<p>${initial_text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
    onUpdate: ({ editor }) => {
      latest_text.current = editor.getText();
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
      on_save(text);
    }
    on_close();
  }, [initial_text, on_save, on_close]);

  // Close on click outside
  useEffect(() => {
    function handle_mousedown(e: MouseEvent) {
      if (
        wrapper_ref.current &&
        !wrapper_ref.current.contains(e.target as Node)
      ) {
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

  // Close on Escape
  useEffect(() => {
    function handle_keydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        save_and_close();
      }
    }
    document.addEventListener("keydown", handle_keydown);
    return () => document.removeEventListener("keydown", handle_keydown);
  }, [save_and_close]);

  const rect = target.getBoundingClientRect();

  // FLIP morph: panel starts matching the field, then expands
  const panel_left = Math.max(rect.left - 8, 16);
  const panel_width = Math.max(rect.width + 16, 380);

  const wrapper_style: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    // Morph: start at field position, expand to panel position
    top: morphed ? rect.top - 8 : rect.top,
    left: morphed ? panel_left : rect.left,
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
      {/* Backdrop — blur + dim */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          backgroundColor: morphed ? "rgba(0,0,0,0.08)" : "transparent",
          backdropFilter: morphed ? "blur(3px)" : "blur(0px)",
          WebkitBackdropFilter: morphed ? "blur(3px)" : "blur(0px)",
          transition: "all 0.35s ease",
        }}
      />

      {/* Editor panel — morphs from field */}
      <div ref={wrapper_ref} style={wrapper_style}>
        <div className="bg-[var(--le-panel-bg)]" style={card_style}>
          {/* Header — slides in from collapsed */}
          <div
            style={{
              maxHeight: morphed ? 40 : 0,
              opacity: morphed ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
            }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--le-panel-border)] px-3 py-1.5">
              {/* Animated dot */}
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--le-accent)]"
                style={{ animation: "le-pulse-ring 2s ease-in-out infinite" }}
              />

              {content_key && (
                <span className="text-[10px] font-medium text-[var(--le-panel-text-muted)] font-mono truncate max-w-[200px] uppercase tracking-wider">
                  {content_key}
                </span>
              )}

              <div className="ml-auto flex items-center gap-2">
                <SaveIndicator status={save_status} />

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

          <BubbleToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}

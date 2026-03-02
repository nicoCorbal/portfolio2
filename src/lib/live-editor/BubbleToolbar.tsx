"use client";

import { type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState, useCallback } from "react";
import { cn } from "./utils";

interface BubbleToolbarProps {
  editor: Editor;
}

interface ToolbarItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  is_active: boolean;
}

function ToolbarButton({ item }: { item: ToolbarItem }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all",
        "hover:bg-white/20",
        item.is_active
          ? "bg-white/20 text-white shadow-sm"
          : "text-white/80"
      )}
      onClick={item.action}
      title={item.label}
    >
      {item.icon}
    </button>
  );
}

function Separator() {
  return <div className="mx-0.5 h-5 w-px bg-white/15" />;
}

// Inline SVG icons for portability (no @/components/ui dependency)
const ICON_BOLD = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ICON_ITALIC = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const ICON_STRIKE = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4H9a3 3 0 0 0-3 3c0 2 1.5 3 3 3" />
    <path d="M12 12h3a3 3 0 0 1 0 6H8" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);

const ICON_HIGHLIGHT = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 11-6 6v3h9l3-3" />
    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
  </svg>
);

const ICON_LINK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  const [show_link_input, set_show_link_input] = useState(false);
  const [link_url, set_link_url] = useState("");

  const apply_link = useCallback(() => {
    if (link_url) {
      editor.chain().focus().setLink({ href: link_url }).run();
    }
    set_show_link_input(false);
    set_link_url("");
  }, [editor, link_url]);

  const formatting_items: ToolbarItem[] = [
    {
      label: "Bold",
      icon: ICON_BOLD,
      action: () => editor.chain().focus().toggleBold().run(),
      is_active: editor.isActive("bold"),
    },
    {
      label: "Italic",
      icon: ICON_ITALIC,
      action: () => editor.chain().focus().toggleItalic().run(),
      is_active: editor.isActive("italic"),
    },
    {
      label: "Strikethrough",
      icon: ICON_STRIKE,
      action: () => editor.chain().focus().toggleStrike().run(),
      is_active: editor.isActive("strike"),
    },
  ];

  const annotation_items: ToolbarItem[] = [
    {
      label: "Highlight",
      icon: ICON_HIGHLIGHT,
      action: () => editor.chain().focus().toggleHighlight().run(),
      is_active: editor.isActive("highlight"),
    },
    {
      label: "Link",
      icon: ICON_LINK,
      action: () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        } else {
          set_show_link_input(true);
        }
      },
      is_active: editor.isActive("link"),
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      className={cn(
        "flex items-center gap-0.5 rounded-xl p-1 shadow-2xl",
        "bg-gray-900/80 backdrop-blur-lg",
        "border border-white/10"
      )}
    >
      {show_link_input ? (
        <div className="flex items-center gap-1.5 px-1">
          <input
            type="url"
            placeholder="https://"
            value={link_url}
            onChange={(e) => set_link_url(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply_link()}
            className={cn(
              "h-8 w-48 rounded-lg bg-white/10 px-2.5 text-xs text-white outline-none",
              "placeholder:text-white/40",
              "focus:ring-2 focus:ring-white/25"
            )}
            autoFocus
          />
          <button
            type="button"
            className="h-8 rounded-lg px-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            onClick={apply_link}
          >
            Set
          </button>
          <button
            type="button"
            className="h-8 rounded-lg px-2.5 text-xs text-white/50 hover:bg-white/20 hover:text-white transition-colors"
            onClick={() => set_show_link_input(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {formatting_items.map((item) => (
            <ToolbarButton key={item.label} item={item} />
          ))}
          <Separator />
          {annotation_items.map((item) => (
            <ToolbarButton key={item.label} item={item} />
          ))}
        </>
      )}
    </BubbleMenu>
  );
}

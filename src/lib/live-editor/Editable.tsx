interface EditableProps {
  content_key: string;
  source_file: string;
  as?: React.ElementType;
  class_name?: string;
  raw_value?: string;
  children: React.ReactNode;
}

/**
 * Pure wrapper — zero hooks, zero state.
 * Renders children with data attributes that DevEditor uses via event delegation.
 * Edit-mode styling is handled by global CSS on [data-live-edit-mode="true"] [data-editable].
 *
 * `raw_value` — optional raw string from JSON (e.g. with XML tags for t.rich()).
 * When present the editor will show this instead of textContent so tags are preserved.
 */
export function Editable({
  content_key,
  source_file,
  as: Tag = "div",
  class_name,
  raw_value,
  children,
}: EditableProps) {
  return (
    <Tag
      className={class_name}
      data-editable
      data-content-key={content_key}
      data-source-file={source_file}
      {...(raw_value != null ? { "data-raw-value": raw_value } : {})}
    >
      {children}
    </Tag>
  );
}

"use client";

import { useLocale } from "next-intl";
import { Editable } from "@/lib/live-editor";

interface EditableTextProps {
  content_key: string;
  file?: "messages" | "projects";
  as?: React.ElementType;
  class_name?: string;
  raw_value?: string;
  children: React.ReactNode;
}

export function EditableText({
  content_key,
  file = "messages",
  as = "span",
  class_name,
  raw_value,
  children,
}: EditableTextProps) {
  const locale = useLocale();
  const source_file = file === "messages"
    ? `src/messages/${locale}.json`
    : `src/data/projects.${locale}.json`;

  return (
    <Editable
      content_key={content_key}
      source_file={source_file}
      as={as}
      class_name={class_name}
      raw_value={raw_value}
    >
      {children}
    </Editable>
  );
}

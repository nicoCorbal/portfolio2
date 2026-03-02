import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join, extname } from "path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Live editing is disabled in production" },
      { status: 403 }
    );
  }

  const { file_path, content_key, new_text } = await request.json();

  if (!file_path || !content_key || typeof new_text !== "string") {
    return NextResponse.json(
      { error: "Missing file_path, content_key, or new_text" },
      { status: 400 }
    );
  }

  const absolute_path = join(process.cwd(), file_path);

  // Prevent path traversal
  if (!absolute_path.startsWith(process.cwd())) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const ext = extname(absolute_path).toLowerCase();

  try {
    if (ext === ".json") {
      return await apply_json_patch(absolute_path, content_key, new_text);
    }

    if (ext === ".tsx" || ext === ".jsx") {
      return await apply_tsx_patch(absolute_path, content_key, new_text);
    }

    return NextResponse.json(
      { error: `Unsupported file extension: ${ext}` },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── TSX/JSX strategy (existing) ──

async function apply_tsx_patch(
  absolute_path: string,
  content_key: string,
  new_text: string
) {
  const source = await readFile(absolute_path, "utf-8");

  const pattern = new RegExp(
    `(<Editable[^>]*content_key=["']${escape_regex(content_key)}["'][^>]*>)([\\s\\S]*?)(</Editable>)`
  );

  const match = source.match(pattern);

  if (!match) {
    return NextResponse.json(
      { error: `content_key "${content_key}" not found in ${absolute_path}` },
      { status: 404 }
    );
  }

  const updated = source.replace(pattern, `$1\n          ${new_text}\n        $3`);

  await writeFile(absolute_path, updated, "utf-8");

  return NextResponse.json({ ok: true });
}

// ── JSON strategy (new) ──

function parse_json_path(path: string): (string | number)[] {
  const segments: (string | number)[] = [];

  // Split on "." but handle bracket notation like "[0]" and "items[2]"
  for (const part of path.split(".")) {
    // Extract leading key (before any bracket)
    const leading_match = part.match(/^([^[]+)/);
    if (leading_match) {
      segments.push(leading_match[1]);
    }

    // Extract all bracket indices
    const remaining = leading_match ? part.slice(leading_match[1].length) : part;
    const index_re = /\[(\d+)\]/g;
    let index_match;
    while ((index_match = index_re.exec(remaining)) !== null) {
      segments.push(Number(index_match[1]));
    }
  }

  return segments;
}

function set_nested_value(
  obj: unknown,
  path: (string | number)[],
  value: unknown
): boolean {
  let current: unknown = obj;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];

    if (current === null || current === undefined) return false;

    if (typeof key === "number") {
      if (!Array.isArray(current) || key >= current.length) return false;
      current = current[key];
    } else {
      if (typeof current !== "object" || Array.isArray(current)) return false;
      if (!(key in (current as Record<string, unknown>))) return false;
      current = (current as Record<string, unknown>)[key];
    }
  }

  const last_key = path[path.length - 1];

  if (typeof last_key === "number") {
    if (!Array.isArray(current) || last_key >= (current as unknown[]).length) return false;
    (current as unknown[])[last_key] = value;
    return true;
  }

  if (current === null || typeof current !== "object" || Array.isArray(current)) return false;
  if (!(last_key in (current as Record<string, unknown>))) return false;
  (current as Record<string, unknown>)[last_key] = value;
  return true;
}

async function apply_json_patch(
  absolute_path: string,
  content_key: string,
  new_text: string
) {
  let source: string;
  try {
    source = await readFile(absolute_path, "utf-8");
  } catch {
    return NextResponse.json(
      { error: `File not found: ${absolute_path}` },
      { status: 404 }
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch {
    return NextResponse.json(
      { error: `Invalid JSON in ${absolute_path}` },
      { status: 500 }
    );
  }

  const path = parse_json_path(content_key);

  if (path.length === 0) {
    return NextResponse.json(
      { error: `Invalid content_key: "${content_key}"` },
      { status: 400 }
    );
  }

  const success = set_nested_value(data, path, new_text);

  if (!success) {
    return NextResponse.json(
      { error: `Path "${content_key}" not found in JSON` },
      { status: 404 }
    );
  }

  await writeFile(absolute_path, JSON.stringify(data, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true });
}

function escape_regex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

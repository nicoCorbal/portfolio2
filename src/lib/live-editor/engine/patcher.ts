/**
 * Sends a patch to the live-edit API to update content in a source file.
 */
export async function apply_patch(
  source_file: string,
  content_key: string,
  new_text: string
): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/live-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_path: source_file, content_key, new_text }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("[live-editor] patch failed:", data.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[live-editor] patch failed:", err);
    return false;
  }
}

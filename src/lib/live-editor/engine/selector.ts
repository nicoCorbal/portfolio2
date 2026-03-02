export interface SelectedInfo {
  element: HTMLElement;
  content_key: string;
  source_file: string;
  text: string;
}

type HoverCallback = (element: HTMLElement | null) => void;
type SelectCallback = (info: SelectedInfo) => void;

/**
 * Creates event-delegation listeners on the document for [data-editable] elements.
 * Returns a cleanup function to remove all listeners.
 */
export function create_selector(
  on_hover: HoverCallback,
  on_select: SelectCallback
): () => void {
  let hovered_el: HTMLElement | null = null;

  function find_editable(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof HTMLElement)) return null;
    return target.closest("[data-editable]") as HTMLElement | null;
  }

  function set_hovered(el: HTMLElement | null) {
    if (hovered_el === el) return;

    if (hovered_el) {
      hovered_el.removeAttribute("data-editable-hovered");
    }

    hovered_el = el;

    if (hovered_el) {
      hovered_el.setAttribute("data-editable-hovered", "");
    }

    on_hover(el);
  }

  function handle_mouseover(e: MouseEvent) {
    const el = find_editable(e.target);
    set_hovered(el);
  }

  function handle_mouseout(e: MouseEvent) {
    const el = find_editable(e.relatedTarget);
    if (!el) set_hovered(null);
  }

  function handle_click(e: MouseEvent) {
    const el = find_editable(e.target);
    if (!el) return;

    e.preventDefault();
    e.stopPropagation();

    const content_key = el.getAttribute("data-content-key") ?? "";
    const source_file = el.getAttribute("data-source-file") ?? "";
    const text = el.getAttribute("data-raw-value") || el.textContent || "";

    on_select({ element: el, content_key, source_file, text });
  }

  document.addEventListener("mouseover", handle_mouseover, true);
  document.addEventListener("mouseout", handle_mouseout, true);
  document.addEventListener("click", handle_click, true);

  return () => {
    // Clean up hovered attribute
    if (hovered_el) {
      hovered_el.removeAttribute("data-editable-hovered");
      hovered_el = null;
    }

    document.removeEventListener("mouseover", handle_mouseover, true);
    document.removeEventListener("mouseout", handle_mouseout, true);
    document.removeEventListener("click", handle_click, true);
  };
}

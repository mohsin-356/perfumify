"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  value?: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (value === undefined) return;
    // Avoid resetting caret position and flicker: only update when content actually differs
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  // One-time editor config for better compatibility
  useEffect(() => {
    try { document.execCommand("styleWithCSS", false, "true"); } catch {}
    try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch {}
  }, []);

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer as HTMLElement;
      const root = container?.nodeType === 1 ? (container as HTMLElement) : container?.parentElement;
      if (ref.current && root && ref.current.contains(root)) {
        savedRange.current = range;
      }
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRange.current) {
      // Ensure editor is focusable target
      ref.current?.focus();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const apply = (cmd: string, val?: string) => {
    if (!ref.current) return;
    // Restore the last selection inside editor to avoid losing it when clicking toolbar
    restoreSelection();
    const before = ref.current.innerHTML;
    let changed = false;
    try {
      changed = document.execCommand(cmd, false, val) as unknown as boolean;
    } catch {}
    const afterTry = ref.current.innerHTML;
    if (!changed && before === afterTry) {
      // Fallbacks for browsers that ignore some execCommand actions
      fallbackCommand(cmd, val);
    }
    onChange(ref.current.innerHTML);
  };

  // Run an action on toolbar mousedown without losing selection
  const withToolbarSelection = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      const container = r.commonAncestorContainer as HTMLElement;
      const root = container?.nodeType === 1 ? (container as HTMLElement) : container?.parentElement;
      if (ref.current && root && ref.current.contains(root)) {
        savedRange.current = r;
      }
    }
    action();
  };

  const applyBlock = (block: "P" | "H1" | "H2" | "H3" | "BLOCKQUOTE") => {
    // Try plain and angle-bracketed values for maximum compatibility
    if (!ref.current) return;
    restoreSelection();
    const plain = block.toUpperCase();
    const lower = block.toLowerCase();
    try { document.execCommand("formatBlock", false, plain); } catch {}
    try { document.execCommand("formatBlock", false, `<${lower}>`); } catch {}
    onChange(ref.current.innerHTML);
  };

  // --- Fallback utilities ---
  const getSelectionInEditor = (): Range | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return savedRange.current;
    const r = sel.getRangeAt(0);
    const container = r.commonAncestorContainer as HTMLElement;
    const root = container?.nodeType === 1 ? (container as HTMLElement) : container?.parentElement;
    if (ref.current && root && ref.current.contains(root)) return r;
    return savedRange.current;
  };

  const replaceSelectionWith = (html: string) => {
    try {
      document.execCommand("insertHTML", false, html);
    } catch {}
  };

  const wrapSelection = (wrapperStart: string, wrapperEnd: string) => {
    const r = getSelectionInEditor();
    if (!r) return;
    const frag = r.cloneContents();
    const div = document.createElement("div");
    div.appendChild(frag);
    const selectedHtml = div.innerHTML || (r.toString() as string);
    replaceSelectionWith(`${wrapperStart}${selectedHtml || ""}${wrapperEnd}`);
  };

  const fallbackCommand = (cmd: string, val?: string) => {
    if (!ref.current) return;
    switch (cmd) {
      case "underline":
        wrapSelection('<span style="text-decoration: underline;">', '</span>');
        break;
      case "italic":
        wrapSelection('<em>', '</em>');
        break;
      case "bold":
        wrapSelection('<strong>', '</strong>');
        break;
      case "insertUnorderedList":
        wrapSelection('<ul><li>', '</li></ul>');
        break;
      case "insertOrderedList":
        wrapSelection('<ol><li>', '</li></ol>');
        break;
      case "justifyLeft":
      case "justifyCenter":
      case "justifyRight":
      case "justifyFull": {
        const map: Record<string, string> = {
          justifyLeft: "left",
          justifyCenter: "center",
          justifyRight: "right",
          justifyFull: "justify",
        };
        wrapSelection(`<div style="text-align:${map[cmd]};">`, "</div>");
        break;
      }
      case "formatBlock": {
        const tag = String(val || "p").replace(/[<>]/g, "");
        wrapSelection(`<${tag}>`, `</${tag}>`);
        break;
      }
      default:
        break;
    }
  };

  const applyAlign = (dir: "left" | "center" | "right" | "full") => {
    const map: Record<string, string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      full: "justifyFull",
    };
    apply(map[dir]);
  };

  const applyHighlight = (color: string) => {
    if (!ref.current) return;
    restoreSelection();
    // hiliteColor works in modern Chrome; backColor as fallback
    document.execCommand("hiliteColor", false, color);
    document.execCommand("backColor", false, color);
    onChange(ref.current.innerHTML);
  };

  const makeLink = () => {
    if (!ref.current) return;
    restoreSelection();
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    try {
      const safe = new URL(url, window.location.href);
      document.execCommand("createLink", false, safe.toString());
      // Add target=_blank and rel attributes to the created link(s)
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer as HTMLElement;
        const root = container.nodeType === 1 ? (container as HTMLElement) : container.parentElement;
        if (root) {
          root.querySelectorAll("a").forEach((a) => {
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer nofollow");
          });
        }
      }
      onChange(ref.current.innerHTML);
    } catch {}
  };

  // Basic sanitizer used when DOMPurify isn't available
  function basicSanitizeHtml(html: string) {
    const allowedTags = new Set([
      "p","br","strong","b","em","i","u","ul","ol","li","h1","h2","h3","blockquote","a","span"
    ]);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const sanitizeNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (!allowedTags.has(tag)) {
          const text = doc.createTextNode(el.textContent || "");
          el.parentNode?.replaceChild(text, el);
          return;
        }
        // Strip all attributes except href on <a> and style on <span>
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          if (tag === "a" && name === "href") {
            const href = el.getAttribute("href") || "";
            if (!/^(https?:|mailto:|tel:)/i.test(href)) el.removeAttribute("href");
            continue;
          }
          if (tag === "span" && name === "style") {
            const val = el.getAttribute("style") || "";
            const safe = val
              .split(";")
              .map((p) => p.trim())
              .filter((p) => /^(color|background-color)\s*:/i.test(p))
              .join("; ");
            if (safe) el.setAttribute("style", safe); else el.removeAttribute("style");
            continue;
          }
          el.removeAttribute(name);
        }
      }
      // Recurse
      for (const child of Array.from(node.childNodes)) sanitizeNode(child);
    };

    Array.from(doc.body.childNodes).forEach(sanitizeNode);
    return doc.body.innerHTML;
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    if (!html && !text) return; // let browser handle
    e.preventDefault();
    let toInsert = text;
    if (html) {
      try {
        // Try dynamic import of DOMPurify if available in project
        const mod: any = await import("dompurify").catch(() => null);
        const DOMPurify: any = mod?.default ?? mod;
        if (DOMPurify?.sanitize) {
          toInsert = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ["p","br","strong","b","em","i","u","ul","ol","li","h1","h2","h3","blockquote","a","span"],
            ALLOWED_ATTR: { "a": ["href","target","rel"], "span": ["style"] },
            ADD_ATTR: ["style"],
            FORBID_TAGS: ["script","style"],
          });
        } else {
          toInsert = basicSanitizeHtml(html);
        }
      } catch {
        toInsert = basicSanitizeHtml(html);
      }
    }
    restoreSelection();
    document.execCommand("insertHTML", false, toInsert || text);
    onChange(ref.current.innerHTML);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("bold"))}>
          B
        </button>
        <button type="button" className="px-2 py-1 border rounded italic" onMouseDown={(e)=>withToolbarSelection(e, () => apply("italic"))}>
          I
        </button>
        <button type="button" className="px-2 py-1 border rounded underline" onMouseDown={(e)=>withToolbarSelection(e, () => apply("underline"))}>
          U
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("insertUnorderedList"))}>
          • List
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("insertOrderedList"))}>
          1. List
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyBlock("H1"))}>
          H1
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyBlock("H2"))}>
          H2
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyBlock("BLOCKQUOTE"))}>
          ❝ Quote
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => makeLink())}>
          Link
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("unlink"))}>
          Unlink
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyAlign("left"))}>
          ⬅
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyAlign("center"))}>
          ⬌
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyAlign("right"))}>
          ➡
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyAlign("full"))}>
          ▤
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("undo"))}>
          Undo
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("redo"))}>
          Redo
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => apply("removeFormat"))}>
          Clear
        </button>
        <button type="button" className="px-2 py-1 border rounded" onMouseDown={(e)=>withToolbarSelection(e, () => applyHighlight("#fff59d"))}>
          Highlight
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
        spellCheck={true}
        tabIndex={0}
        className="min-h-[160px] w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none outline-none text-left whitespace-pre-wrap"
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (!ref.current) return;
          if (e.ctrlKey || e.metaKey) {
            const key = e.key.toLowerCase();
            if (key === "b") { e.preventDefault(); apply("bold"); }
            if (key === "i") { e.preventDefault(); apply("italic"); }
            if (key === "u") { e.preventDefault(); apply("underline"); }
            if (key === "z") { /* let browser handle undo */ }
            if (key === "y") { e.preventDefault(); apply("redo"); }
          }
        }}
        onMouseUp={() => {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0);
        }}
        onKeyUp={() => {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0);
        }}
      />
    </div>
  );
}

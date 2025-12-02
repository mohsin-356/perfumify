"use client";

import { useState } from "react";

export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className={className || "px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"}
      title="Copy"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

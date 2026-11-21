"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Shares a page of the site. Phones get the native share sheet (WhatsApp, Messages, …);
 * elsewhere a small menu offers WhatsApp, email and copy link.
 */
export function ShareButton({
  path,
  title,
  text,
  label = "Share",
  iconOnly = false,
  className = "",
}: {
  /** Site path to share, e.g. "/alphabet/ka" or "/dialogues#slug" */
  path: string;
  title: string;
  /** The message that goes with the link */
  text: string;
  label?: string;
  /** Show just the icon; the label stays as the accessible name */
  iconOnly?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const url = () => new URL(path, window.location.origin).toString();

  async function share() {
    const data = { title, text, url: url() };
    if (navigator.share && navigator.canShare?.(data) !== false) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        // Closing the share sheet is not an error
        if ((e as Error).name === "AbortError") return;
      }
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url());
    }
  }

  const message = encodeURIComponent(`${text}\n${typeof window === "undefined" ? "" : url()}`);
  const item = "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold hover:bg-bg";

  return (
    <div ref={wrap} className="relative inline-block">
      <button
        type="button"
        onClick={share}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-line px-3 py-0.5 font-semibold hover:border-brand ${className}`}
      >
        <span aria-hidden>📤</span>
        {!iconOnly && label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border-2 border-line bg-surface p-1.5 text-base shadow-lg"
        >
          <a
            role="menuitem"
            href={`https://wa.me/?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={item}
          >
            <span aria-hidden>💬</span> WhatsApp
          </a>
          <a
            role="menuitem"
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${message}`}
            onClick={() => setOpen(false)}
            className={item}
          >
            <span aria-hidden>✉️</span> Email
          </a>
          <button role="menuitem" type="button" onClick={copy} className={item}>
            <span aria-hidden>{copied ? "✅" : "🔗"}</span> {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

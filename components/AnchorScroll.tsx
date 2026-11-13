"use client";
import { useEffect } from "react";

// In-page links (#packages, #faq…): land with the section's content just under the fixed header,
// instead of the section's top padding. Works for every section, whatever its padding.
export function AnchorScroll() {
  useEffect(() => {
    const go = (id: string, smooth = true) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const target = (el.firstElementChild as HTMLElement | null) ?? el;
      // Page position without transforms (reveal animations start 18px lower).
      let top = 0;
      for (let n: HTMLElement | null = target; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
      const HEADER = 60; // header height once the page is scrolled (it shrinks slightly)
      top -= HEADER + 20;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? "smooth" : "auto" });
      return true;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!id) return;
      if (go(id)) { e.preventDefault(); history.replaceState(null, "", `#${id}`); }
    };
    document.addEventListener("click", onClick);
    if (location.hash) setTimeout(() => go(location.hash.slice(1), false), 300);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

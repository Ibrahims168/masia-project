"use client";
import { useLayoutEffect } from "react";

// Nearest ancestor that scrolls sideways (a swipe slider on phones), if any.
function sideScroller(el: HTMLElement) {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const o = getComputedStyle(p).overflowX;
    if (o === "auto" || o === "scroll") return p;
  }
  return null;
}

// Fades in every [data-reveal] element as it scrolls into view.
// The "shown" flag is a data attribute, not a class: React rewrites className whenever
// a component re-renders (hover, open/close), which would otherwise hide the element again.
// Cards inside a sideways slider are revealed together with the slider: otherwise the ones
// off to the side stay invisible and fade in mid-swipe, which feels jerky.
export function Reveal() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const show = (el: Element) => el.setAttribute("data-in", "");
    // Measure everything first, then write: interleaving reads and writes forces a
    // full-page layout per element, which is very slow on phones.
    const h = window.innerHeight;
    const targets = els.map((el) => sideScroller(el) ?? el);
    const onScreen = targets.map((t) => t.getBoundingClientRect().top < h);
    els.forEach((el, i) => onScreen[i] && show(el)); // already visible: no flash on load
    root.classList.add("reveal-ready");
    const groups = new Map<Element, HTMLElement[]>();
    els.forEach((el, i) => { if (!onScreen[i]) groups.set(targets[i], [...(groups.get(targets[i]) ?? []), el]); });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        groups.get(e.target)?.forEach(show);
        io.unobserve(e.target);
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    groups.forEach((_, t) => io.observe(t));
    return () => { io.disconnect(); root.classList.remove("reveal-ready"); };
  }, []);
  return null;
}

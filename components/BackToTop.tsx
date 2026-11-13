"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

// Appears after the visitor has scrolled well down the page.
export function BackToTop() {
  const { lang } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; setShow(window.scrollY > 1200); });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t.toTop[lang]} title={t.toTop[lang]}
      tabIndex={show ? 0 : -1} aria-hidden={!show}
      className={`group fixed bottom-5 end-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#16295A] to-[#051127] text-[#D7B576] shadow-card ring-1 ring-white/15 transition duration-300 hover:-translate-y-1 sm:bottom-6 sm:end-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <ArrowUp size={21} className="transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}

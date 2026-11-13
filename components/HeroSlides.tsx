"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

const SLIDE_MS = 6500;

/** Crossfading photo slideshow with a slow "Ken Burns" zoom. Pauses while the tab is hidden. */
export function useHeroSlides() {
  const n = t.heroSlides.length;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const go = (i: number) => { if (i === cur) return; setPrev(cur); setCur(i); };
  useEffect(() => {
    let id = 0;
    const start = () => { id = window.setTimeout(() => { setPrev(cur); setCur((cur + 1) % n); }, SLIDE_MS); };
    const onVis = () => { clearTimeout(id); if (!document.hidden) start(); };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { clearTimeout(id); document.removeEventListener("visibilitychange", onVis); };
  }, [n, cur]);
  return { cur, prev, go };
}

// Only the current, outgoing and next slides are mounted: fewer big images on the page,
// and the next one is already loaded (eager) before it fades in, so nothing stutters.
export function HeroBackdrop({ cur, prev }: { cur: number; prev: number }) {
  const n = t.heroSlides.length;
  const next = (cur + 1) % n;
  return (
    <div className="absolute inset-0 isolate z-0 bg-[#0B1A3D]" aria-hidden>
      {t.heroSlides.map((s, i) => {
        if (i !== cur && i !== prev && i !== next) return null;
        const on = i === cur, leaving = i === prev;
        return (
          <div key={s.img}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${on ? "z-[2] opacity-100" : leaving ? "z-[1] opacity-0" : "z-0 opacity-0"}`}>
            <Image src={`/img/hero/${s.img}.jpg`} alt="" fill priority={i === 0} loading={i === 0 ? undefined : "eager"} quality={75} sizes="100vw"
              className={`object-cover [backface-visibility:hidden] ${on || leaving ? (i % 2 ? "kenburns-b" : "kenburns-a") : ""}`} />
          </div>
        );
      })}
      {/* soft dark tint over every photo */}
      <div className="absolute inset-0 z-[3] bg-black/25" />
    </div>
  );
}

// Caption + progress dots, shown under the hero subtitle.
export function HeroDots({ cur, go }: { cur: number; go: (i: number) => void }) {
  const { lang } = useLang();
  return (
    <div className="fade-up mt-5 flex flex-col items-center gap-2.5" style={{ "--d": "240ms" } as React.CSSProperties}>
      <span key={cur} className="pop-in inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
        <MapPin size={13} className="text-[#D7B576]" />{t.heroSlides[cur].cap[lang]}
      </span>
      <div className="flex items-center" dir="ltr">
        {t.heroSlides.map((s, i) => (
          <button key={s.img} type="button" onClick={() => go(i)} aria-label={s.cap[lang]} aria-current={i === cur}
            className="group grid h-8 place-items-center px-1.5">
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === cur ? "w-6 bg-[#D7B576]" : "w-1.5 bg-white/60 group-hover:bg-white"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

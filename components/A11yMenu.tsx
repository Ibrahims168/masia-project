"use client";
import { useEffect, useRef, useState } from "react";
import { Accessibility, X, Type, Contrast, Droplet, Link2, CaseSensitive, Focus, Pause, RotateCcw, Minus, Plus } from "lucide-react";
import { useLang } from "@/lib/lang";
import { legalUi } from "@/lib/legal";

// Accessibility menu (תפריט נגישות). Each option toggles a class on <html>; styles are in globals.css.
// Choices are remembered in the browser.
const KEY = "tv-a11y";
type State = { size: number; contrast: boolean; gray: boolean; links: boolean; font: boolean; focus: boolean; still: boolean };
const EMPTY: State = { size: 0, contrast: false, gray: false, links: false, font: false, focus: false, still: false };

const L = {
  title: { he: "תפריט נגישות", en: "Accessibility", ar: "إمكانية الوصول" },
  open: { he: "פתיחת תפריט נגישות", en: "Open accessibility menu", ar: "فتح قائمة إمكانية الوصول" },
  size: { he: "גודל טקסט", en: "Text size", ar: "حجم النص" },
  contrast: { he: "ניגודיות גבוהה", en: "High contrast", ar: "تباين عالٍ" },
  gray: { he: "גווני אפור", en: "Greyscale", ar: "تدرّج رمادي" },
  links: { he: "הדגשת קישורים", en: "Highlight links", ar: "إبراز الروابط" },
  font: { he: "גופן קריא", en: "Readable font", ar: "خط مقروء" },
  focus: { he: "הדגשת פוקוס", en: "Highlight focus", ar: "إبراز التركيز" },
  still: { he: "עצירת אנימציות", en: "Stop animations", ar: "إيقاف الحركة" },
  reset: { he: "איפוס הגדרות", en: "Reset", ar: "إعادة الضبط" },
};

function apply(s: State) {
  const c = document.documentElement.classList;
  [1, 2, 3].forEach((n) => c.toggle(`a11y-text-${n}`, s.size === n));
  c.toggle("a11y-contrast", s.contrast);
  c.toggle("a11y-gray", s.gray);
  c.toggle("a11y-links", s.links);
  c.toggle("a11y-font", s.font);
  c.toggle("a11y-focus", s.focus);
  c.toggle("a11y-still", s.still);
}

export function A11yMenu() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<State>(EMPTY);
  const panel = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v) { const n = { ...EMPTY, ...v }; setS(n); apply(n); } } catch {}
  }, []);
  const update = (patch: Partial<State>) => {
    const n = { ...s, ...patch };
    setS(n); apply(n);
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {}
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    const onDown = (e: MouseEvent) => { if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  const toggles = [
    { k: "contrast", Icon: Contrast }, { k: "gray", Icon: Droplet }, { k: "links", Icon: Link2 },
    { k: "font", Icon: CaseSensitive }, { k: "focus", Icon: Focus }, { k: "still", Icon: Pause },
  ] as const;
  const active = s.size > 0 || toggles.some((x) => s[x.k]);

  return (
    <div className="a11y-ui" dir={lang === "en" ? "ltr" : "rtl"}>
      <button ref={btn} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="a11y-panel" aria-label={L.open[lang]} title={L.title[lang]}
        className="fixed bottom-5 start-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#1B5FD9] text-white shadow-card ring-2 ring-white transition hover:scale-105 focus-visible:outline-offset-4">
        <Accessibility size={26} />
        {active && <span className="absolute -end-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-[#D7B576] ring-2 ring-white" />}
      </button>

      {open && (
        <div ref={panel} id="a11y-panel" role="dialog" aria-label={L.title[lang]}
          className="pop-in fixed bottom-20 start-4 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-sand-300 bg-white p-4 text-ink shadow-card">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-base font-extrabold"><Accessibility size={19} className="text-[#1B5FD9]" />{L.title[lang]}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100"><X size={18} /></button>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-2xl bg-sand-50 p-2.5">
            <span className="flex items-center gap-2 text-sm font-bold"><Type size={16} className="text-[#1B5FD9]" />{L.size[lang]}</span>
            <span className="flex items-center gap-1.5" dir="ltr">
              <button type="button" onClick={() => update({ size: Math.max(0, s.size - 1) })} disabled={s.size === 0} aria-label="-" className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-sand-300 disabled:opacity-40"><Minus size={15} /></button>
              <span className="w-8 text-center text-sm font-extrabold tabular-nums" aria-live="polite">{100 + s.size * 12.5}%</span>
              <button type="button" onClick={() => update({ size: Math.min(3, s.size + 1) })} disabled={s.size === 3} aria-label="+" className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-sand-300 disabled:opacity-40"><Plus size={15} /></button>
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {toggles.map(({ k, Icon }) => (
              <button key={k} type="button" aria-pressed={s[k]} onClick={() => update({ [k]: !s[k] } as Partial<State>)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-[13px] font-bold ring-1 transition ${s[k] ? "bg-[#1B5FD9] text-white ring-[#1B5FD9]" : "bg-white ring-sand-300 hover:ring-[#1B5FD9]/50"}`}>
                <Icon size={20} />{L[k][lang]}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-sand-300 pt-3">
            <button type="button" onClick={() => update(EMPTY)} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-soft hover:text-ink"><RotateCcw size={14} />{L.reset[lang]}</button>
            <a href="/accessibility" className="text-[13px] font-bold text-[#1B5FD9] underline-offset-2 hover:underline">{legalUi.links.accessibility[lang]}</a>
          </div>
        </div>
      )}
    </div>
  );
}

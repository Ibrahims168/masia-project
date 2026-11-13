"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Moon, Check, Minus, Sparkles, CalendarDays, PlaneTakeoff, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { PACKAGES } from "@/lib/config";
import { TRAVEL, tr as trT } from "@/lib/travel";

type Pkg = (typeof PACKAGES)[number];

// Package id -> destination key (for season + flight facts)
const DEST_OF: Record<string, string> = { europe: "paris", swiss: "swiss", santorini: "santorini", phuket: "phuket", tokyo: "japan", bali: "" };

// Package details: same layout as the destination guide. Arrows move between packages.
export function PackageModal({ pk: start, onClose }: { pk: Pkg; onClose: () => void }) {
  const { lang } = useLang();
  const dialog = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(Math.max(0, PACKAGES.findIndex((p) => p.id === start.id)));
  const pk = PACKAGES[idx];
  const card = t.pk[pk.id as keyof typeof t.pk];
  const d = t.pkd[pk.id as keyof typeof t.pkd];
  const dest = t.dest.find((x) => x.k === DEST_OF[pk.id]);
  const fl = dest ? TRAVEL[dest.k] : undefined;
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const onPrev = idx > 0 ? () => setIdx(idx - 1) : undefined;
  const onNext = idx < PACKAGES.length - 1 ? () => setIdx(idx + 1) : undefined;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const fwd = lang === "en" ? "ArrowRight" : "ArrowLeft", back = lang === "en" ? "ArrowLeft" : "ArrowRight";
      if (e.key === fwd) onNext?.();
      if (e.key === back) onPrev?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function quote() {
    onClose();
    window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${card.n[lang]} · ${card.s[lang]}`, dest: d.form } }));
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const facts = [
    { Icon: Moon, label: t.pkNights[lang], value: `${pk.nights} ${t.pkNights[lang]}` },
    ...(dest ? [{ Icon: CalendarDays, label: t.bestTime[lang], value: dest.b[lang] }] : []),
    ...(fl ? [{ Icon: PlaneTakeoff, label: trT.flightTitle[lang], value: `${trT.direct[fl.direct][lang]} · ~${fl.hours} ${trT.hours[lang]}` }] : []),
    { Icon: Tag, label: ({ he: "מחיר", en: "Price", ar: "السعر" } as const)[lang], value: t.pkPrice[lang] },
  ];
  const PrevI = lang === "en" ? ChevronLeft : ChevronRight, NextI = lang === "en" ? ChevronRight : ChevronLeft;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" ref={dialog} tabIndex={-1} style={{ outline: "none" }} aria-labelledby="pkg-title">
      <div className="fade-in absolute inset-0 bg-[#051127]/75" onClick={onClose} />

      {/* Previous / next package, outside the box */}
      {[{ go: onPrev, I: PrevI, side: "start-3 lg:start-6", l: "Previous" }, { go: onNext, I: NextI, side: "end-3 lg:end-6", l: "Next" }].map(({ go, I, side, l }) => go && (
        <button key={l} type="button" onClick={go} aria-label={l}
          className={`absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-card transition hover:scale-105 hover:bg-gold sm:grid ${side}`}>
          <I size={26} />
        </button>
      ))}

      <div className="sheet-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-card [will-change:transform] sm:mx-20 sm:max-w-5xl sm:rounded-[1.75rem]">
        {/* Banner */}
        <div className="relative h-48 shrink-0 sm:h-60">
          <Image key={pk.id} src={`/img/${pk.img}.jpg`} alt={card.n[lang]} fill sizes="(max-width:640px) 100vw, 1024px" className="fade-in object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051127]/90 via-[#051127]/25 to-transparent" />
          <span className="absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/70 sm:hidden" />
          <button type="button" onClick={onClose} aria-label="Close"
            className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white">
            <X size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{card.badge[lang]}</span>
            <h3 id="pkg-title" className="mt-2 text-3xl font-extrabold sm:text-5xl">{card.n[lang]}</h3>
            <p className="mt-1.5 max-w-2xl text-sm text-white/85 sm:text-base">{d.intro[lang]}</p>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          {/* Key facts */}
          <dl className={`grid grid-cols-2 border-b border-sand-300 ${facts.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
            {facts.map(({ Icon, label, value }, i) => (
              <div key={i} className={`p-4 sm:p-5 ${i % 2 ? "border-s border-sand-300" : ""} ${i > 1 ? "border-t border-sand-300 sm:border-t-0" : ""} ${i === 2 ? "sm:border-s" : ""}`}>
                <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft"><Icon size={15} className="text-gold-deep" />{label}</dt>
                <dd className="mt-1 text-sm font-extrabold leading-snug sm:text-[15px]">{value}</dd>
              </div>
            ))}
          </dl>

          <div key={pk.id} className="fade-in grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <div className="space-y-7">
              {/* Included */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold"><Check size={19} className="text-[#22A06B]" />{t.pkInc[lang]}</h4>
                <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                  {d.inc.map((x, i) => (
                    <li key={i} className="flex items-center gap-3 border-b border-sand-200 py-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#22A06B] text-white"><Check size={13} strokeWidth={3} /></span>
                      <span className="text-[15px] font-bold leading-snug">{x[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional experiences: top 4 */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold"><Sparkles size={19} className="text-gold-deep" />{t.pkPlan[lang]}</h4>
                <p className="mt-0.5 text-[13px] text-ink-soft">{t.pkNote[lang]}</p>
                <ol className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  {d.ideas.slice(0, 4).map((x, i) => (
                    <li key={i} className="flex items-center gap-3 border-b border-sand-200 py-3">
                      <span className="font-brand text-2xl font-light tabular-nums text-gold-deep" dir="ltr">0{i + 1}</span>
                      <span className="text-[15px] font-bold leading-snug">{x[lang]}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="space-y-4">
              {/* Not included */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold"><Minus size={19} className="text-ink-soft" />{t.pkExc[lang]}</h4>
                <ul className="mt-4 divide-y divide-sand-200 rounded-2xl ring-1 ring-sand-300">
                  {d.exc.map((x, i) => (
                    <li key={i} className="flex items-center gap-3 p-3.5 text-sm font-semibold text-ink-soft"><Minus size={15} className="shrink-0" />{x[lang]}</li>
                  ))}
                </ul>
              </div>
              {/* Price */}
              <div className="rounded-2xl bg-gradient-to-br from-[#16295A] to-[#051127] p-5 text-white">
                <p className="flex items-center gap-2 font-extrabold text-[#D7B576]"><Tag size={17} />{t.pkPrice[lang]}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{t.pkPriceL[lang]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 gap-2 border-t border-sand-300 bg-white p-4 pb-[max(env(safe-area-inset-bottom),16px)] sm:justify-end sm:px-8">
          <button type="button" onClick={quote}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-3.5 font-extrabold text-ink shadow-soft transition hover:brightness-105 sm:flex-none sm:px-8">
            <span className="whitespace-nowrap">{t.pkQuote[lang]}<span className="hidden sm:inline"> · {card.n[lang]}</span></span><Arrow size={18} />
          </button>
          {[{ go: onPrev, I: PrevI, l: "Previous" }, { go: onNext, I: NextI, l: "Next" }].map(({ go, I, l }) => (
            <button key={l} type="button" onClick={go} disabled={!go} aria-label={l} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-sand-300 disabled:opacity-30 sm:hidden"><I size={20} /></button>
          ))}
        </div>
      </div>
    </div>
  );
}

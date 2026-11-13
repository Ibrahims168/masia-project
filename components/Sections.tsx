"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, Plus, Instagram, ChevronDown, Sun, CloudSun, CloudRain, Heart, Hotel, Check, BadgeCheck, MapPinned, Package, PlaneTakeoff, MessageCircle, Facebook, X, Star, MapPin, Info as InfoIcon, CalendarDays, Wallet, Clock, PlaneLanding, Bus, Lightbulb, ChevronLeft, ChevronRight, HeartHandshake, PartyPopper, Users, Backpack, Plug, Languages, HandCoins } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import { WHATSAPP, FORM_ENDPOINT, SOCIAL } from "@/lib/config";
import { NAV } from "@/lib/reviews";
import { TRAVEL, tr as trT, GOOD, goodUi } from "@/lib/travel";
import { legalUi } from "@/lib/legal";
import { useLang } from "@/lib/lang";
import { Dropdown } from "@/components/Dropdown";
import { Mark, Wordmark } from "@/components/Top";
import { LocalTimes, useNow, timeIn, ZONES } from "@/components/LocalTime";
import baseCredits from "@/lib/photo-credits.json";
import sightCredits from "@/lib/sight-credits.json";
const credits = [...baseCredits, ...(sightCredits as typeof baseCredits)];


export function Head({ tag, h, l, className = "mb-8 sm:mb-10" }: { tag: string; h: string; l?: string; className?: string }) {
  return (
    <div data-reveal className={`mx-auto max-w-2xl text-center sm:mx-0 sm:text-start ${className}`}>
      <span className="inline-block rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand-50">{tag}</span>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{h}</h2>
      {l && <p className="mt-3 text-lg text-ink-soft">{l}</p>}
    </div>
  );
}
const wrap = "mx-auto max-w-6xl px-4 sm:px-6";

type Dest = (typeof t.dest)[number];

// Pop-up guide for one destination: bottom sheet on phones, centred window on larger screens.
// Currency symbol from the English currency name.
const CUR_SYM: Record<string, string> = { EUR: "€", THB: "฿", JPY: "¥", VND: "₫", CZK: "Kč", CHF: "₣", MVR: "Rf", LKR: "Rs" };
const curSymbol = (en: string) => CUR_SYM[en.match(/(([A-Z]{3}))/)?.[1] ?? ""] ?? "";

function DestModal({ d, lang, onClose, onPrev, onNext }: { d: Dest; lang: Lang; onClose: () => void; onPrev?: () => void; onNext?: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const now = useNow();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const fwd = lang === "en" ? "ArrowRight" : "ArrowLeft", back = lang === "en" ? "ArrowLeft" : "ArrowRight";
      if (e.key === fwd) onNext?.();
      if (e.key === back) onPrev?.();
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [onClose, onNext, onPrev, lang]);

  function plan() {
    onClose();
    window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: d.n[lang], dest: d.form } }));
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const tr = TRAVEL[d.k];
  const facts = [
    { Icon: CalendarDays, label: t.bestTime[lang], value: d.b[lang] },
    { Icon: Clock, label: t.ltLocal[lang], value: now ? `${timeIn(now, ZONES[d.k]).text} · ${d.tz}` : d.tz, ltr: true },
    { Icon: Wallet, label: t.planCurrency[lang], value: d.cur[lang], sym: curSymbol(d.cur.en) },
    ...(tr ? [{ Icon: PlaneTakeoff, label: trT.flightTitle[lang], value: `${trT.direct[tr.direct][lang]} · ~${tr.hours} ${trT.hours[lang]}` }] : []),
  ];
  const info = [
    { Icon: PlaneLanding, label: t.dmAirport[lang], value: d.airport, ltr: true },
    { Icon: Bus, label: t.dmAround[lang], value: d.around[lang] },
  ];
  const good = GOOD[d.k];
  const costs = tr ? [
    { l: trT.meal[lang], v: tr.meal }, { l: trT.taxi[lang], v: tr.taxi },
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" ref={dialog} tabIndex={-1} style={{ outline: "none" }} aria-labelledby="dest-title">
      <div className="fade-in absolute inset-0 bg-[#051127]/75 backdrop-blur-sm" onClick={onClose} />
      {/* Previous / next destination, outside the box */}
      {[{ go: onPrev, I: lang === "en" ? ChevronLeft : ChevronRight, side: "start-3 lg:start-6", l: "Previous" }, { go: onNext, I: lang === "en" ? ChevronRight : ChevronLeft, side: "end-3 lg:end-6", l: "Next" }].map(({ go, I, side, l }) => go && (
        <button key={l} type="button" onClick={go} aria-label={l}
          className={`absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-card transition hover:scale-105 hover:bg-gold sm:grid ${side}`}>
          <I size={26} />
        </button>
      ))}
      <div className="sheet-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-card [will-change:transform] sm:mx-20 sm:max-w-5xl sm:rounded-[1.75rem]">
        {/* Banner */}
        <div className="relative h-48 shrink-0 sm:h-60">
          <Image key={d.k} src={`/img/${d.img}.jpg`} alt={d.n[lang]} fill sizes="(max-width:640px) 100vw, 1024px" className="fade-in object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051127]/90 via-[#051127]/25 to-transparent" />
          <span className="absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/70 sm:hidden" />
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close"
            className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white">
            <X size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{d.c[lang]}</span>
            <h3 id="dest-title" className="mt-2 text-3xl font-extrabold sm:text-5xl">{d.n[lang]}</h3>
            <p className="mt-1.5 max-w-2xl text-sm text-white/85 sm:text-base">{d.d[lang]}</p>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          {/* Key facts */}
          <dl className="grid grid-cols-2 border-b border-sand-300 sm:grid-cols-4">
            {facts.map((f, i) => { const { Icon, label, value, ltr } = f as typeof f & { ltr?: boolean }; return (
              <div key={i} className={`p-4 sm:p-5 ${i % 2 ? "border-s border-sand-300" : ""} ${i > 1 ? "border-t border-sand-300 sm:border-t-0" : ""} ${i === 2 ? "sm:border-s" : ""}`}>
                <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft"><Icon size={15} className="text-gold-deep" />{label}</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-extrabold leading-snug sm:text-[15px]" dir={ltr ? "ltr" : undefined} style={ltr ? { justifyContent: lang === "en" ? "flex-start" : "flex-end" } : undefined}>
                  {"sym" in f && f.sym && <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D7B576] to-[#C2935F] px-1.5 text-[13px] font-extrabold text-ink">{f.sym}</span>}{value}
                </dd>
              </div>
            ); })}
          </dl>

          <div key={d.k} className="fade-in grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <div className="space-y-7">
              {/* Places to visit: top 4 */}
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold"><MapPin size={19} className="text-gold-deep" />{t.dmSights[lang]}</h4>
                <ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
                  {d.sights.slice(0, 4).map((x, i) => (
                    <li key={i} className="flex items-center gap-3 border-b border-sand-200 py-3.5">
                      <span className="font-brand text-2xl font-light tabular-nums text-gold-deep" dir="ltr">0{i + 1}</span>
                      <span className="text-[15px] font-bold leading-snug">{x[lang]}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Good to know */}
              {good && (
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-extrabold"><Lightbulb size={19} className="text-gold-deep" />{goodUi.title[lang]}</h4>
                  <dl className="mt-4 grid gap-2.5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-sand-200">
                      <dt className="flex items-center gap-1.5 text-xs font-bold text-ink-soft"><Plug size={14} className="text-gold-deep" />{goodUi.plug[lang]}</dt>
                      <dd className="mt-1 text-sm font-extrabold" dir="ltr" style={{ textAlign: lang === "en" ? "left" : "right" }}>{good.plug}</dd>
                      <dd className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${good.adapter ? "bg-[#FDECEA] text-[#B42318]" : "bg-[#E3F4EC] text-[#11663F]"}`}>{good.adapter ? goodUi.adapterYes[lang] : goodUi.adapterNo[lang]}</dd>
                    </div>
                    <div className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-sand-200">
                      <dt className="flex items-center gap-1.5 text-xs font-bold text-ink-soft"><Languages size={14} className="text-gold-deep" />{goodUi.lang[lang]}</dt>
                      <dd className="mt-1 text-sm font-bold leading-snug">{good.lang[lang]}</dd>
                    </div>
                    <div className="rounded-2xl bg-sand-50 p-3.5 ring-1 ring-sand-200">
                      <dt className="flex items-center gap-1.5 text-xs font-bold text-ink-soft"><HandCoins size={14} className="text-gold-deep" />{goodUi.tip[lang]}</dt>
                      <dd className="mt-1 text-sm font-bold leading-snug">{good.tip[lang]}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Practical info */}
            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold"><InfoIcon size={19} className="text-gold-deep" />{t.dmInfo[lang]}</h4>
                <dl className="mt-4 divide-y divide-sand-200 rounded-2xl ring-1 ring-sand-300">
                  {info.map(({ Icon, label, value, ltr }, i) => (
                    <div key={i} className="flex gap-3 p-3.5">
                      <Icon size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                      <div>
                        <dt className="text-xs font-bold text-ink-soft">{label}</dt>
                        <dd className="mt-0.5 text-sm font-semibold" dir={ltr ? "ltr" : undefined}>{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
              {costs.length > 0 && (
                <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-sand-200">
                  <p className="text-xs font-bold text-ink-soft">{trT.costTitle[lang]}</p>
                  <ul className="mt-2 grid grid-cols-2 gap-2 text-center">
                    {costs.map((c) => (
                      <li key={c.l} className="rounded-xl bg-white px-1.5 py-2.5 ring-1 ring-sand-200">
                        <p className="truncate text-[11px] text-ink-soft">{c.l}</p>
                        <p className="text-base font-extrabold" dir="ltr">{c.v === "—" ? "—" : `₪${c.v}`}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="flex gap-2.5 rounded-2xl bg-[#FDF3DC] p-3.5 text-sm leading-relaxed text-[#6B4708]">
                <Lightbulb size={17} className="mt-0.5 shrink-0" /><span><b>{t.dmTip[lang]}: </b>{d.tip[lang]}</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex shrink-0 gap-2 border-t border-sand-300 bg-white p-4 pb-[max(env(safe-area-inset-bottom),16px)] sm:justify-end sm:px-8">
          {[{ go: onPrev, I: lang === "en" ? ChevronLeft : ChevronRight, l: "Previous" }, { go: onNext, I: lang === "en" ? ChevronRight : ChevronLeft, l: "Next" }].map(({ go, I, l }) => (
            <button key={l} type="button" onClick={go} disabled={!go} aria-label={l} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-sand-300 disabled:opacity-30 sm:hidden"><I size={20} /></button>
          ))}
          <button type="button" onClick={plan}
            className="order-first flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-3.5 font-extrabold text-ink shadow-soft transition hover:brightness-105 sm:order-none sm:flex-none sm:px-8">
            <span className="whitespace-nowrap">{t.plan[lang]}<span className="hidden sm:inline"> · {d.n[lang]}</span></span><Arrow size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Destinations() {
  const { lang } = useLang();
  const Arr = lang === "en" ? ArrowUpRight : ArrowUpLeft;
  const [region, setRegion] = useState<"asia" | "europe">("europe");
  const list = t.dest.filter((d) => d.r === region);
  const [open, setOpen] = useState(0);
  const hoverT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverOpen = (i: number) => { clearTimeout(hoverT.current); hoverT.current = setTimeout(() => setOpen(i), 140); };
  const [sel, setSel] = useState<Dest | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const last = list.length - 1;
  // Cards mounted after a switch missed the scroll-reveal pass, so show them straight away.
  const [switched, setSwitched] = useState(false);
  const pick = (r: "asia" | "europe") => { setSwitched(true); setRegion(r); setOpen(0); row.current?.scrollTo({ left: 0 }); };

  // Arrows: open the next/previous destination and glide it into view (only the row scrolls).
  const go = (i: number) => {
    const n = Math.max(0, Math.min(last, i));
    setOpen(n);
    const el = row.current, card = el?.children[n] as HTMLElement | undefined;
    if (!el || !card) return;
    setTimeout(() => {
      const r = el.getBoundingClientRect(), c = card.getBoundingClientRect();
      el.scrollBy({ left: c.left - r.left - (r.width - c.width) / 2, behavior: "smooth" });
    }, 120);
  };
  const Prev = lang === "en" ? ChevronLeft : ChevronRight;
  const Next = lang === "en" ? ChevronRight : ChevronLeft;

  return (
    <section id="destinations" className={`${wrap} pt-16 sm:pt-24`}>
      <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Head tag={t.destTag[lang]} h={t.destH[lang]} l={t.destL[lang]} className="" />
        <div className="flex flex-col items-center gap-3 sm:items-start lg:items-end">
      <div data-reveal role="tablist" className="inline-flex rounded-full border border-sand-300 bg-white p-1 shadow-soft">
        {(["europe", "asia"] as const).map((r) => (
          <button key={r} type="button" role="tab" aria-selected={region === r} onClick={() => pick(r)}
            className={`rounded-full px-6 py-2 text-sm font-bold transition ${region === r ? "bg-[#0B1A3D] text-white shadow-soft" : "text-ink-soft hover:text-ink"}`}>
            {t.regions[r][lang]}
          </button>
        ))}
      </div>
      <LocalTimes region={region} />
        </div>
      </div>
      <div className="relative">
        {/* Arrows on both sides, vertically centred on the cards */}
        {[{ f: false, I: Prev, off: open === 0 }, { f: true, I: Next, off: open === last }].map(({ f, I, off }) => (
          <button key={String(f)} type="button" onClick={() => go(open + (f ? 1 : -1))} disabled={off} aria-label={f ? "Next" : "Previous"}
            className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-sand-300 bg-white/95 text-ink shadow-card backdrop-blur transition hover:scale-105 hover:border-gold hover:bg-gold disabled:pointer-events-none disabled:opacity-0 md:grid ${f ? "-end-5" : "-start-5"}`}>
            <I size={22} />
          </button>
        ))}
      <div ref={row}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 md:mx-0 md:h-[480px] md:snap-none md:gap-3 md:px-0">
        {list.map((d, i) => {
          const on = open === i;
          return (
            <button key={d.k} type="button" data-reveal data-in={switched ? "" : undefined} style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              onMouseEnter={() => hoverOpen(i)} onMouseLeave={() => clearTimeout(hoverT.current)} onFocus={() => setOpen(i)} onClick={() => setSel(d)} aria-haspopup="dialog"
              className={`group relative h-[380px] w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl text-start shadow-soft transition-[width,box-shadow] duration-[900ms] ease-[cubic-bezier(.65,0,.35,1)] hover:shadow-card md:h-full ${on ? "md:w-[46%]" : "md:w-[15.5%]"}`}>
              <Image src={`/img/${d.img}.jpg`} alt={d.n[lang]} fill sizes="(max-width:768px) 78vw, 50vw" className={`object-cover transition-transform duration-[1200ms] ease-out ${on ? "md:scale-105" : ""}`} />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/20 transition-opacity duration-500 ${on ? "" : "md:from-black/70 md:via-black/40"}`} />
              <span className={`absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink transition-opacity duration-300 ${on ? "" : "md:opacity-0"}`}>{d.c[lang]}</span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                <h3 className={`font-extrabold leading-tight transition-all duration-700 ease-[cubic-bezier(.65,0,.35,1)] ${on ? "text-3xl md:text-4xl" : "text-3xl md:text-xl"}`}>{d.n[lang]}</h3>
                <div className={`transition-all ${on ? "duration-700 delay-300 md:max-h-48 md:opacity-100" : "duration-300 md:max-h-0 md:opacity-0"} md:overflow-hidden`}>
                  <p className="mt-1 max-w-md text-sm text-white/85">{d.d[lang]}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">{t.bestTime[lang]}: {d.b[lang]}</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-white py-1.5 pe-1.5 ps-3.5 text-[13px] font-bold text-ink transition group-hover:bg-gold">
                      {t.dmOpen[lang]}<span className="grid h-7 w-7 place-items-center rounded-full bg-ink/10 transition duration-300 group-hover:rotate-45"><Arr size={15} /></span>
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      </div>
      {/* Dots under the cards */}
      <div className="mt-4 hidden justify-center md:flex">
        <div className="flex gap-1.5">
          {list.map((d, i) => (
            <button key={d.k} type="button" onClick={() => go(i)} aria-label={d.n[lang]} className="grid h-5 place-items-center px-0.5">
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === open ? "w-6 bg-gold" : "w-1.5 bg-sand-300 hover:bg-ink-soft"}`} />
            </button>
          ))}
        </div>
      </div>
      {sel && (() => {
        const i = list.findIndex((x) => x.k === sel.k);
        return <DestModal d={sel} lang={lang} onClose={() => setSel(null)}
          onPrev={i > 0 ? () => setSel(list[i - 1]) : undefined} onNext={i < list.length - 1 ? () => setSel(list[i + 1]) : undefined} />;
      })()}
    </section>
  );
}

const ttIcons = { honeymoon: Heart, couples: HeartHandshake, friends: PartyPopper, groups: Users, solo: Backpack } as const;
// Big background photo for each trip type (destination photos already on the site).
const ttBg = { honeymoon: "maldives", couples: "eu/santorini", friends: "krabi", groups: "eu/venice", solo: "eu/swiss" } as const;

export function Services() {
  const { lang } = useLang();
  const [cur, setCur] = useState(0);
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const x = t.tt[cur];
  const romantic = x.k === "honeymoon" || x.k === "couples";
  const accent = romantic ? "#E8799F" : "#C2935F";
  const plan = () => window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${x.h[lang]} · ${t.ttCta[lang]}`, dest: "" } }));

  return (
    <section id="services" className={`${wrap} pt-16 sm:pt-24`}>
      <Head tag={t.ttTag[lang]} h={t.ttH[lang]} l={t.ttL[lang]} className="mb-6 sm:mb-8 [&>p]:hidden sm:[&>p]:block" />

      {/* Trip-type picker: clean icon tabs, no photos */}
      <div data-reveal role="tablist" className="grid grid-cols-5 gap-1 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-sand-300 sm:gap-1.5">
        {t.tt.map((o, i) => {
          const Icon = ttIcons[o.k as keyof typeof ttIcons];
          const on = i === cur;
          return (
            <button key={o.k} type="button" role="tab" aria-selected={on} onClick={() => setCur(i)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[12px] font-bold transition duration-300 sm:flex-row sm:gap-2 sm:py-3 sm:text-[15px] ${on ? "bg-[#0B1A3D] text-white shadow-soft" : "text-ink-soft hover:bg-sand-50 hover:text-ink"}`}>
              <Icon size={18} style={{ color: on ? accent : undefined }} className={on ? "" : "text-gold-deep"} />{o.t[lang]}
            </button>
          );
        })}
      </div>

      {/* Selected trip */}
      <div key={x.k} data-reveal className="fade-up mt-4 grid overflow-hidden rounded-[1.75rem] bg-white shadow-card ring-1 ring-sand-300 sm:mt-5 lg:grid-cols-[1fr_1.15fr]">
        {/* Photo */}
        <div className="relative h-36 sm:h-64 lg:h-auto lg:min-h-[420px]">
          <Image src={`/img/travel/${x.img}.jpg`} alt={x.h[lang]} fill sizes="(max-width:1024px) 100vw, 520px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-none" />
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 sm:p-8">
          <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">{x.h[lang]}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{x.d[lang]}</p>

          <p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-ink-soft sm:mt-5">{t.ttWe[lang]}</p>
          <ul className="mt-2 grid sm:mt-3 sm:grid-cols-2 sm:gap-2">
            {x.pts.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 border-b border-sand-200 py-2 text-sm font-semibold leading-snug last:border-0 sm:rounded-xl sm:border-0 sm:bg-sand-50 sm:p-3 sm:ring-1 sm:ring-sand-200">
                <Check size={15} strokeWidth={3} className="mt-px shrink-0" style={{ color: accent }} />{pt[lang]}
              </li>
            ))}
          </ul>

          <a href="#contact" onClick={plan}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-extrabold shadow-soft transition hover:-translate-y-0.5 hover:brightness-105 sm:mt-6 lg:mt-auto ${romantic ? "bg-gradient-to-r from-[#F4A6C0] to-[#E8799F] text-[#3a0f22]" : "bg-gradient-to-r from-[#D7B576] to-[#C2935F] text-ink"}`}>
            {t.ttCta[lang]} · {x.t[lang]}<Arrow size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const { lang } = useLang();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  return (
    <section className={`${wrap} pt-16 sm:pt-24`}>
      {/* Why us */}
      <div data-reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] p-6 text-white shadow-card sm:p-8">
        <div className="pointer-events-none absolute -start-20 -top-24 h-72 w-72 rounded-full bg-[#D7B576]/15 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.2em] text-[#D7B576]">{t.whyTag[lang]}</span>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{t.whyH[lang]}</h3>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-3 text-sm font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105">
              {t.plan[lang]}<Arrow size={16} />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {t.why.map((w, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 transition hover:bg-white/10 sm:block sm:p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D7B576]/15 text-[#D7B576]"><BadgeCheck size={20} /></span>
                <div>
                  <h4 className="font-bold sm:mt-3">{w.t[lang]}</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/70">{w.d[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Season = keyof typeof t.season;
const seasonStyle: Record<Season, { bar: string; chip: string; Icon: React.ElementType }> = {
  b: { bar: "h-full bg-gradient-to-t from-[#C2935F] to-[#D7B576]", chip: "bg-[#D7B576] text-ink", Icon: Sun },
  g: { bar: "h-2/3 bg-gradient-to-t from-[#3E9C8F] to-[#7CC4B6]", chip: "bg-[#7CC4B6] text-ink", Icon: CloudSun },
  l: { bar: "h-1/3 bg-sand-300", chip: "bg-sand-300 text-ink", Icon: CloudRain },
};

export function Info() {
  const { lang } = useLang();
  const [di, setDi] = useState(0);
  // null until mounted: the current month is only known in the browser.
  const [month, setMonth] = useState<number | null>(null);
  useEffect(() => setMonth(new Date().getMonth()), []);

  // Phones: months are one swipe row; keep the selected month centred in it.
  // Only the row scrolls (never the page), so this is a no-op on wider screens.
  const monthRow = useRef<HTMLDivElement>(null);
  const firstCentre = useRef(true);
  useEffect(() => {
    const row = monthRow.current;
    const btn = month === null ? null : row?.children[month];
    if (!row || !btn) return;
    const r = row.getBoundingClientRect(), b = btn.getBoundingClientRect();
    row.scrollBy({ left: b.left - r.left - (r.width - b.width) / 2, behavior: firstCentre.current ? "auto" : "smooth" });
    firstCentre.current = false;
  }, [month]);

  const d = t.planner[di];
  const m = month ?? 0;
  const season = d.seasons[m] as Season;
  const { Icon } = seasonStyle[season];
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const facts = [
    { label: t.planBest[lang], value: d.best[lang] },
    { label: t.planCurrency[lang], value: d.cur[lang] },
    { label: t.planTz[lang], value: d.tz, ltr: true },
  ];

  function plan() {
    window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${d.n[lang]} · ${t.monthL[m][lang]}`, dest: d.form } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="info" className={`${wrap} pt-16 sm:pt-24`}>
      <Head tag={t.planTag[lang]} h={t.planH[lang]} l={t.planL[lang]} />
      <div data-reveal className="grid overflow-hidden rounded-[2rem] border border-sand-300 bg-white shadow-card lg:grid-cols-[1.05fr_1fr]">
        {/* Photo panel */}
        <div className="relative min-h-[340px] min-w-0 overflow-hidden lg:min-h-[560px]">
          {t.planner.map((x, i) => (
            <Image key={x.k} src={`/img/${x.img}.jpg`} alt={x.n[lang]} fill sizes="(max-width:1024px) 100vw, 50vw"
              className={`object-cover transition-[opacity,transform] duration-700 ${i === di ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
          <div key={d.k} className="fade-up absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <div className="flex flex-wrap gap-1.5">
              {d.tags.map((tag, i) => <span key={i} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">{tag[lang]}</span>)}
            </div>
            <h3 className="mt-3 text-4xl font-extrabold sm:text-5xl">{d.n[lang]}</h3>
            <dl className="mt-4 flex flex-wrap gap-2 text-[13px] sm:grid sm:grid-cols-3">
              {facts.map((f, i) => (
                <div key={i} className="rounded-2xl bg-white/10 px-3 py-2 ring-1 sm:p-3 ring-white/20 backdrop-blur-md">
                  <dt className="text-[11px] text-white/70">{f.label}</dt>
                  <dd className="mt-0.5 font-bold leading-snug" dir={f.ltr ? "ltr" : undefined}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Controls */}
        <div className="flex min-w-0 flex-col p-5 sm:p-7">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="tablist">
            {t.planner.map((x, i) => (
              <button key={x.k} type="button" role="tab" aria-selected={i === di} onClick={() => setDi(i)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border py-1.5 pe-4 ps-1.5 text-sm font-bold transition ${i === di ? "border-gold bg-sand-100 text-ink shadow-soft" : "border-sand-300 text-ink-soft hover:border-gold/60 hover:text-ink"}`}>
                <span className="relative h-7 w-7 overflow-hidden rounded-full"><Image src={`/img/${x.img}.jpg`} alt="" fill sizes="28px" className="object-cover" /></span>
                {x.n[lang]}
              </button>
            ))}
          </div>

          <div ref={monthRow} className="no-scrollbar -mx-5 mt-6 flex snap-x gap-1.5 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-2 sm:overflow-visible sm:px-0 sm:pb-0">
            {t.monthS.map((name, i) => {
              const s = d.seasons[i] as Season;
              const on = month === i;
              return (
                <button key={i} type="button" onClick={() => setMonth(i)} aria-pressed={on} aria-label={`${t.monthL[i][lang]}: ${t.season[s].t[lang]}`}
                  className={`flex w-[66px] shrink-0 snap-center flex-col items-center gap-1.5 rounded-2xl border p-2 transition sm:w-auto ${on ? "border-gold bg-sand-100 shadow-soft" : "border-transparent hover:bg-sand-50"}`}>
                  <span className="flex h-10 w-full items-end overflow-hidden rounded-lg bg-sand-50 sm:h-12">
                    <span className={`w-full rounded-lg transition-all duration-500 ${seasonStyle[s].bar}`} />
                  </span>
                  <span className={`whitespace-nowrap text-[12px] font-bold ${on ? "text-ink" : "text-ink-soft"}`}>{name[lang]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-soft">
            {(Object.keys(seasonStyle) as Season[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${seasonStyle[s].chip}`} />{t.season[s].t[lang]}</span>
            ))}
          </div>

          <div key={`${d.k}-${m}`} className="fade-up mt-6 flex gap-4 rounded-2xl border border-sand-300 bg-sand-50 p-5">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${seasonStyle[season].chip}`}><Icon size={24} /></span>
            <div>
              <p className="text-xs font-semibold text-ink-soft">{t.monthL[m][lang]} {t.planIn[lang]} {d.n[lang]}</p>
              <p className="text-lg font-extrabold">{t.season[season].t[lang]}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{t.season[season].d[lang]}</p>
            </div>
          </div>

          <button type="button" onClick={plan}
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-6 py-3.5 font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-card hover:brightness-105 active:translate-y-0 lg:mt-auto">
            {t.plan[lang]} · {d.n[lang]}{lang === "ar" ? "، " : ", "}{t.monthL[m][lang]}<Arrow size={18} />
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-soft">{t.infoNote[lang]}</p>
    </section>
  );
}

const howIcons = [MapPinned, Package, PlaneTakeoff];

export function How() {
  const { lang } = useLang();
  return (
    <section className={`${wrap} pt-16 sm:pt-24`}>
      <Head tag={t.howTag[lang]} h={t.howH[lang]} />
      <div className="relative">
        {/* dashed path linking the steps: vertical on phones, horizontal from md */}
        <div aria-hidden className="absolute bottom-8 start-8 top-8 border-s-2 border-dashed border-gold/40 md:hidden" />
        <div aria-hidden className="absolute inset-x-[17%] top-8 hidden border-t-2 border-dashed border-gold/40 md:block" />
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {t.how.map((step, i) => {
            const Icon = howIcons[i];
            return (
              <li key={i} data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties} className="group flex gap-5 md:block md:px-4 md:text-center">
                <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D7B576] to-[#C2935F] text-ink shadow-card ring-8 ring-[#F8F6F1] transition duration-300 group-hover:scale-105 md:mx-auto">
                  <Icon size={26} />
                  <span className="absolute -end-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-bold text-sand-50">{i + 1}</span>
                </span>
                <div className="pt-2 md:mt-5 md:pt-0">
                  <h3 className="text-xl font-extrabold">{step.t[lang]}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{step.d[lang]}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const { lang } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className={`${wrap} pt-16 sm:pt-24`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <div className="flex flex-col items-center sm:items-start lg:sticky lg:top-28 lg:self-start">
          <Head tag={t.faqTag[lang]} h={t.faqH[lang]} l={t.faqL[lang]} />
          <a href="#contact" data-reveal className="-mt-2 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-sand-50 shadow-soft transition hover:-translate-y-0.5 hover:bg-gold hover:text-ink">
            <MessageCircle size={17} />{t.faqAsk[lang]}
          </a>
        </div>
        <div className="space-y-3">
          {t.faq.map((x, i) => {
            const on = open === i;
            return (
              <div key={i} data-reveal style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
                className={`rounded-2xl border bg-white transition duration-300 ${on ? "border-gold/60 shadow-card" : "border-sand-300 shadow-soft hover:border-gold/40"}`}>
                <h3>
                  <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-[17px] font-bold sm:px-6">
                    {x.q[lang]}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${on ? "rotate-45 bg-gold text-ink" : "bg-sand-100 text-gold-deep"}`}><Plus size={18} /></span>
                  </button>
                </h3>
                <div id={`faq-${i}`} className={`grid transition-[grid-template-rows] duration-300 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-ink-soft sm:px-6">{x.a[lang]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { lang } = useLang();
  const [s, setS] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [dest, setDest] = useState("");
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail as { msg: string; dest: string };
      setMsg(d.msg);
      const m = t.destOpts.find((o) => d.dest && [o.en, o.ar, o.he].includes(d.dest));
      if (m) setDest(m.en);
    };
    window.addEventListener("tv-prefill", h);
    return () => window.removeEventListener("tv-prefill", h);
  }, []);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = Object.fromEntries(new FormData(form).entries());
    if (!FORM_ENDPOINT) return setS("err");
    setS("busy");
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...fd, _subject: "Masia: new trip request" }) });
      setS(r.ok ? "ok" : "err");
      if (r.ok) { form.reset(); setMsg(""); }
    } catch { setS("err"); }
  }
  const inp = "mt-1.5 w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 font-normal outline-none transition placeholder:text-ink-soft/50 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  return (
    <section id="contact" className={`${wrap} py-16 sm:py-24`}>
      <div data-reveal className="grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-[1fr_1.45fr]">
        {/* Side panel */}
        <div className="relative flex flex-col overflow-hidden bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] p-6 text-white sm:p-10">
          <Mark className="pointer-events-none absolute -bottom-10 -end-10 h-56 w-56 text-white/[.05]" />
          <div className="pointer-events-none absolute -start-16 -top-16 h-56 w-56 rounded-full bg-[#D7B576]/15 blur-3xl" />
          <span className="relative inline-block self-start rounded-full bg-[#D7B576] px-4 py-1.5 text-xs font-bold text-ink">{t.cTag[lang]}</span>
          <h2 className="relative mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{t.cH[lang]}</h2>
          <p className="relative mt-3 leading-relaxed text-white/75">{t.cL[lang]}</p>
          <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 lg:mt-auto lg:pt-8"><BadgeCheck size={17} className="text-[#D7B576]" />{t.certBadge[lang]}</span>
        </div>

        {/* Form */}
        <form onSubmit={go} className="grid content-start gap-4 p-6 sm:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">{t.fName[lang]}<input name="name" required autoComplete="name" className={inp} /></label>
            <label className="text-sm font-semibold">{t.fEmail[lang]}<input name="email" type="email" required autoComplete="email" dir="ltr" className={inp} /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">{t.fPhone[lang]}<input name="phone" type="tel" required autoComplete="tel" dir="ltr" placeholder="+972 50 000 0000" className={inp} /></label>
            <div className="text-sm font-semibold">{t.fDestination[lang]}
              <Dropdown name="destination" label={t.fDestination[lang]} value={dest} onChange={setDest}
                options={t.destOpts.map((o) => ({ value: o.en, label: o[lang] }))}
                className={`${inp} relative block pe-10 text-start aria-expanded:border-gold aria-expanded:bg-white aria-expanded:ring-4 aria-expanded:ring-gold/15`}>
                {(sel, open) => <>{sel ? sel.label : <span className="font-normal text-ink-soft/70">{t.fDestPh[lang]}</span>}<ChevronDown size={16} className={`absolute end-4 top-1/2 -translate-y-1/2 text-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`} /></>}
              </Dropdown>
            </div>
          </div>
          <label className="text-sm font-semibold">{t.fMsg[lang]}<textarea name="message" rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={dest === "Other destination" ? t.fOtherPh[lang] : undefined} className={`${inp} resize-none`} /></label>
          <button disabled={s === "busy"}
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-6 py-4 font-extrabold text-ink shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:brightness-105 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60">
            {s === "busy" ? t.fSending[lang] : t.fSend[lang]}
            {s !== "busy" && <Arrow size={18} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
          </button>
          <p className="-mt-1 text-center text-xs text-ink-soft">{legalUi.consent[lang]} <a href="/privacy" target="_blank" className="font-semibold text-gold-deep underline underline-offset-2">{legalUi.links.privacy[lang]}</a></p>
          {s === "ok" ? (
            <p role="status" className="pop-in flex items-center gap-2 rounded-xl bg-[#7CC4B6]/20 px-4 py-3 text-sm font-semibold text-[#1F6B60]"><Check size={18} />{t.sent[lang]}</p>
          ) : (
            <p role="status" className="min-h-6 text-sm font-semibold text-red-700">{s === "err" ? t.err[lang] : ""}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { lang } = useLang();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const social = [
    { href: SOCIAL.instagram, label: "Instagram", Icon: Instagram, bg: "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]" },
    { href: SOCIAL.facebook, label: "Facebook", Icon: Facebook, bg: "hover:bg-[#1877F2]" },
    ...(WHATSAPP ? [{ href: `https://wa.me/${WHATSAPP}`, label: "WhatsApp", Icon: MessageCircle, bg: "hover:bg-[#25D366]" }] : []),
  ].filter((x) => x.href);
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#D7B576]/10 blur-3xl" />
      <div className={`${wrap} relative pb-10 pt-12 sm:pt-16`}>
        {/* CTA */}
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/[.05] p-6 text-center backdrop-blur sm:flex-row sm:justify-between sm:p-8 sm:text-start">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t.footReady[lang]}</h2>
            <p className="mt-1.5 text-white/65">{t.footReadyL[lang]}</p>
          </div>
          <a href="#contact" className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-6 py-3.5 font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105 sm:w-auto">
            {t.plan[lang]}<Arrow size={18} />
          </a>
        </div>

        {/* Brand · links · social */}
        <div className="mt-12 grid gap-10 text-center md:grid-cols-[1.3fr_1fr_auto] md:items-start md:text-start">
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="inline-flex flex-col items-center pt-4 md:items-start" dir="ltr" aria-label="Masia">
              <Wordmark className="text-[44px] font-light" sizes="140px" />
              <span className="mt-2 font-brand text-[13px] font-light tracking-[.42em] text-[#D7B576]">global journey</span>
            </a>
            <p className="mt-3 max-w-xs text-white/65">{t.heroSub[lang]}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D7B576]/40 bg-[#D7B576]/10 px-3.5 py-1.5 text-xs font-bold text-[#D7B576]">
              <BadgeCheck size={15} />{t.certBadge[lang]}
            </span>
          </div>
          <nav>
            <h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#D7B576]">{t.footExplore[lang]}</h3>
            <ul className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-x-4 gap-y-3 text-[15px] md:mx-0 md:max-w-none md:grid-cols-2 md:gap-x-8 md:gap-y-2.5">
              {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="inline-block py-1 text-white/75 transition hover:text-[#D7B576]">{n.l[lang]}</a></li>)}
            </ul>
          </nav>
          {social.length > 0 && <div>
            <h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#D7B576]">{t.footFollow[lang]}</h3>
            <div className="mt-4 flex justify-center gap-3 md:justify-start">
              {social.map(({ href, label, Icon, bg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.06] transition duration-300 hover:-translate-y-0.5 hover:border-transparent ${bg}`}>
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className={`${wrap} flex flex-col items-center gap-1 py-5 text-center text-[13px] text-white/45 sm:flex-row sm:justify-between`}>
          <span>{t.footer[lang]}</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {(["accessibility", "privacy", "terms"] as const).map((k) => (
              <a key={k} href={`/${k}`} className="text-white/60 underline-offset-2 transition hover:text-[#D7B576] hover:underline">{legalUi.links[k][lang]}</a>
            ))}
          </span>
          <span dir="ltr">© {new Date().getFullYear()} Masia · Global Journey</span>
        </p>
        <details className={`${wrap} pb-5 text-[11px] text-white/40`} dir="ltr">
          <summary className="cursor-pointer text-center hover:text-white/70 sm:text-start">Photo credits</summary>
          <ul className="mt-2 space-y-0.5">
            {credits.map((c, i) => <li key={c.file + i}><a href={c.page} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{c.file.replace(/_/g, " ")}</a> · {c.artist} · {c.license} · Wikimedia Commons</li>)}
          </ul>
        </details>
      </div>
    </footer>
  );
}

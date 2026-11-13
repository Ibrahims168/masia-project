"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Info, MessageCircle, CalendarClock, ChevronDown, ExternalLink, BadgeCheck, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { Head } from "@/components/Sections";
import { Dropdown } from "@/components/Dropdown";
import { STYLE, Flag, ruleFor, savePassport, PASSPORT_KEY, type Status } from "@/components/visa-shared";

const ORDER: Status[] = ["free", "arrival", "voa", "evisa", "visa", "check", "no"];

// Pulls a price out of the rule text (e.g. "Standard fee $50", "About $25", "≈ $30"); "free" means no fee.
function feeOf(r: { note?: { en: string }; stay?: { en: string } }) {
  const txt = `${r.note?.en ?? ""} ${r.stay?.en ?? ""}`;
  if (/it's free/i.test(txt)) return null;
  return txt.match(/\$\s?\d[\d,.]*/)?.[0].replace(/\s/g, "") ?? null;
}

export function VisaCheck() {
  const { lang } = useLang();
  const [pp, setPp] = useState("il");
  useEffect(() => {
    try { const v = localStorage.getItem(PASSPORT_KEY); if (v && t.passports.some((x) => x.k === v)) setPp(v); } catch {}
    // the trip quiz can set the passport too
    const h = (e: Event) => setPp((e as CustomEvent<string>).detail);
    window.addEventListener("tv-passport", h);
    return () => window.removeEventListener("tv-passport", h);
  }, []);
  const [chip, setChip] = useState<Status | null>(null); // summary chip opened on phones
  useEffect(() => setChip(null), [pp]);
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const frame = useRef(0);
  // At most once per frame, and only re-render when an edge actually changes: keeps swiping smooth on phones.
  const measure = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = row.current; if (!el) return;
      const x = Math.abs(el.scrollLeft), max = el.scrollWidth - el.clientWidth;
      const start = x < 8, end = x > max - 8;
      setEdge((e) => (e.start === start && e.end === end ? e : { start, end }));
    });
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("resize", measure); cancelAnimationFrame(frame.current); };
  }, []);
  // forward = towards the end of the reading direction (left in Arabic/Hebrew)
  const slide = (forward: boolean) => {
    const el = row.current; if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 300) + 16;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: (forward ? 1 : -1) * (rtl ? -1 : 1) * step, behavior: "smooth" });
  };
  const Prev = lang === "en" ? ChevronLeft : ChevronRight;
  const Next = lang === "en" ? ChevronRight : ChevronLeft;
  const choose = (k: string) => savePassport(k);

  const rules = t.visaDest.map((d) => ruleFor(d, pp));
  const counts = ORDER.map((s) => ({ s, n: rules.filter((r) => r.s === s).length })).filter((c) => c.n);

  function ask() {
    const name = t.passports.find((x) => x.k === pp)!.n[lang];
    const lines = t.visaDest.map((d, i) => `${d.n[lang]}: ${t.visaStatus[rules[i].s][lang]}`);
    window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${t.visaTag[lang]} · ${name}\n${lines.join("\n")}`, dest: "" } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="visa" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      {/* Dark navy panel: breaks up the light sections; cards stay white */}
      <div className="relative rounded-[2rem] bg-[#0B1A3D] p-4 text-white shadow-card sm:p-8 lg:p-10">
      {/* soft glows in the corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-[#D7B576]/15 blur-3xl" />
        <div className="absolute -bottom-32 -start-24 h-80 w-80 rounded-full bg-[#3B5BA9]/25 blur-3xl" />
      </div>
      <div className="relative">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Head tag={t.visaTag[lang]} h={t.visaH[lang]} l={t.visaL[lang]} className="[&>p]:text-white/70 [&>span]:bg-[#D7B576] [&>span]:font-bold [&>span]:text-ink" />
        <div data-reveal className="w-full sm:w-72 lg:shrink-0">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[.16em] text-white/60">{t.visaPick[lang]}</p>
          <Dropdown value={pp} onChange={choose} label={t.visaPick[lang]}
            options={t.passports.map((x) => ({ value: x.k, label: x.n[lang], icon: <Flag k={x.k} size={16} /> }))}
            className="relative flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 text-start font-bold text-ink transition hover:border-gold/60 aria-expanded:border-gold aria-expanded:bg-white aria-expanded:ring-4 aria-expanded:ring-gold/15">
            {(s, open) => (
              <>
                <Flag k={s?.value ?? "jo"} />
                <span className="flex-1 truncate">{s?.label}</span>
                <ChevronDown size={18} className={`shrink-0 text-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </>
            )}
          </Dropdown>
        </div>
      </div>

      {pp === "other" && <p className="mb-3 text-sm font-semibold text-[#D7B576]">{t.visaOther[lang]}</p>}

      {/* Destinations slider */}
      <div className="flex items-center justify-between gap-3">
        <div key={pp} className="pop-in no-scrollbar -mx-4 flex min-w-0 items-center gap-2 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <span className="shrink-0 text-xs font-bold text-white/60">{t.visaWith[lang]}:</span>
          {/* Phones: icon + number only, tap to show the label. Tablets and up: always the full label. */}
          {counts.map(({ s, n }, i) => {
            const { Icon } = STYLE[s];
            // One label open at a time: the first by default, or the one tapped last.
            const on = chip ? chip === s : i === 0;
            return (
              <button key={s} type="button" onClick={() => setChip(s)} aria-expanded={on}
                aria-label={`${n} · ${t.visaStatus[s][lang]}`}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-bold ring-1 transition-all duration-200 sm:cursor-default ${STYLE[s].chip}`}>
                <Icon size={14} className="shrink-0" />{n}
                <span className={`${on ? "inline pop-in" : "hidden"} sm:inline`}>· {t.visaStatus[s][lang]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative">
        {/* Arrows on both sides, vertically centred on the cards (same as Destinations) */}
        {[{ f: false, I: Prev, off: edge.start }, { f: true, I: Next, off: edge.end }].map(({ f, I, off }) => (
          <button key={String(f)} type="button" onClick={() => slide(f)} disabled={off} aria-label={f ? "Next" : "Previous"}
            className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-sand-300 bg-white/95 text-ink shadow-card backdrop-blur transition hover:scale-105 hover:border-gold hover:bg-gold disabled:pointer-events-none disabled:opacity-0 md:grid ${f ? "-end-5" : "-start-5"}`}>
            <I size={22} />
          </button>
        ))}
      {/* Reveal the whole row at once: per-card reveal left off-screen cards hidden until swiped in */}
      <div ref={row} onScroll={measure} data-reveal
        className="no-scrollbar -mx-4 mt-3 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 sm:mx-0 sm:gap-4 sm:scroll-px-0 sm:px-0">
        {t.visaDest.map((d, i) => {
          const r = rules[i];
          const { chip, Icon } = STYLE[r.s];
          return (
            <article key={d.k}
              className="flex w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-soft sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
              {/* photo: tablets and up only */}
              <div className="relative hidden h-24 sm:block">
                <Image src={`/img/${d.img}.jpg`} alt="" fill sizes="33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/5" />
                <h3 className="absolute bottom-2.5 start-4 text-xl font-extrabold text-white">{d.n[lang]}</h3>
              </div>
              <div key={pp} className="pop-in flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-extrabold sm:hidden">{d.n[lang]}</h3>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ring-1 ${chip}`}><Icon size={15} />{t.visaStatus[r.s][lang]}</span>
                    {r.stay && <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1 text-sm font-bold ring-1 ring-sand-300"><CalendarClock size={14} className="text-gold-deep" />{r.stay[lang]}</span>}
                    {(() => {
                      const amt = feeOf(r);
                      return amt && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B42318] px-3 py-1 text-sm font-extrabold text-white shadow-[0_4px_12px_-4px_rgba(180,35,24,.6)]">
                          <CreditCard size={14} />{t.visaFee[lang]} · <span dir="ltr">{amt}</span>
                        </span>
                      );
                    })()}
                  </span>
                </div>
                {r.note && <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink-soft" title={r.note[lang]}>{r.note[lang]}</p>}
                {r.s !== "no" && (
                  <p className="mt-2.5 flex gap-2 text-[13px] leading-relaxed text-ink-soft" title={d.extra[lang]}>
                    <Info size={14} className="mt-0.5 shrink-0 text-gold-deep" /><span className={r.note ? "line-clamp-2" : "line-clamp-3"}>{d.extra[lang]}</span>
                  </p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                  {d.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" dir="ltr"
                      className="inline-flex items-center gap-1 rounded-full border border-sand-300 px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold-deep">
                      {l.l}<ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      </div>

      <div data-reveal className="mt-3 flex flex-col gap-3 rounded-2xl bg-white/[.06] p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 text-[13px] leading-relaxed text-white/70">
          <p className="flex gap-2 font-semibold text-white"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-[#D7B576]" />{t.visaTip[lang]}</p>
          <p><b className="text-white">{t.visaUpdated[lang]}.</b> {t.visaNote[lang]}</p>
        </div>
        <button type="button" onClick={ask}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-3 text-sm font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105">
          <MessageCircle size={17} />{t.visaAsk[lang]}
        </button>
      </div>
      </div>
      </div>
    </section>
  );
}

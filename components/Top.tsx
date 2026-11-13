"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowRight, ArrowLeft, Palmtree, BedDouble, CarFront, Heart, MapPin, PlaneTakeoff, CalendarDays, Users, Wallet, MessageCircle, Tag, ShieldCheck, CalendarCheck2, Percent, Mail, Star, Plane, Menu, X, BadgeCheck, LockKeyhole, ReceiptText, Moon, Globe, Check, Sparkles, HelpCircle, Compass, ChevronLeft, ChevronRight, Instagram, Facebook, Landmark, MessageSquareQuote } from "lucide-react";
import { t, LANGS, type Lang } from "@/lib/i18n";
import { NAV } from "@/lib/reviews";
import { useLang } from "@/lib/lang";
import { Quiz } from "@/components/Quiz";
import { useHeroSlides, HeroBackdrop, HeroDots } from "@/components/HeroSlides";
import { PackageModal } from "@/components/PackageModal";
import { Dropdown, type Opt } from "@/components/Dropdown";
import { Calendar, fmtRange } from "@/components/Calendar";
import { WHATSAPP, PACKAGES, PARTNERS, SHOW_PARTNERS, DEPARTURES, FORM_ENDPOINT, SOCIAL } from "@/lib/config";

const gold = "bg-gradient-to-r from-[#D7B576] to-[#C2935F]";
const navIcons = { flights: PlaneTakeoff, about: Users, packages: Palmtree, destinations: MapPin, services: Sparkles, info: CalendarDays, jewish: Landmark, reviews: MessageSquareQuote, faq: HelpCircle, contact: Mail } as const;
// Brand mark from the Masia logo: a jet climbing out of a swoosh.
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M4 62C14 44 28 31 44 23C31 33 19 46 11 62Z" fill="currentColor" opacity=".85" />
      <g transform="translate(37 1) scale(1.12)" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>
    </svg>
  );
}

// The real Masia wordmark (from public/brand/masia-logo.jpg, background removed).
// light = white letters for dark/photo backgrounds, dark = navy letters for the light header.
// Sized by font-size like text: height is 1.05em, so `text-[30px]` etc. keep working.
// Served through next/image (WebP/AVIF at the size shown) instead of the full 916px PNGs.
// `sizes` = rendered width; `priority` for the big hero logo (first thing people see).
// `withDark` = also load the navy version (only the header switches colours).
export function Wordmark({ dark = false, className = "", sizes = "160px", priority = false, withDark = false }: { dark?: boolean; className?: string; sizes?: string; priority?: boolean; withDark?: boolean }) {
  return (
    <span aria-hidden dir="ltr" className={`relative inline-block leading-none ${className}`}>
      <Image src="/brand/masia-mark-light.png" alt="" width={916} height={291} draggable={false} sizes={sizes} priority={priority}
        className={`block h-[1.05em] w-auto transition-opacity duration-300 ${dark ? "opacity-0" : "opacity-100"}`} />
      {withDark && (
        <Image src="/brand/masia-mark-dark.png" alt="" width={916} height={291} draggable={false} sizes={sizes}
          className={`absolute inset-0 h-[1.05em] w-auto transition-opacity duration-300 ${dark ? "opacity-100" : "opacity-0"}`} />
      )}
    </span>
  );
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#" className="flex items-center" dir="ltr" aria-label="Masia">
      <Wordmark dark={dark} withDark className="text-[30px]" sizes="100px" />
    </a>
  );
}

function PartnerLogo({ pk, hidden = false }: { pk: (typeof PARTNERS)[number]; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className={`${hidden ? "marquee-dup " : ""}grid h-[84px] w-[200px] shrink-0 place-items-center rounded-2xl border border-sand-300 bg-white px-5 shadow-[0_6px_20px_-14px_rgba(5,17,39,.35)] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-soft`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/partners/${pk.logo}.svg`} alt={hidden ? "" : pk.name} loading="lazy" style={{ height: pk.h }} className="w-auto max-w-full" />
    </li>
  );
}

function Partners() {
  const { lang } = useLang();
  return (
    <section data-reveal className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-gold-deep">
          <span className="h-px w-8 bg-gold/50" />{t.partnersTag[lang]}<span className="h-px w-8 bg-gold/50" />
        </span>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{t.partnersH[lang]}</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">{t.partnersL[lang]}</p>
      </div>
      <div className="marquee group relative mt-7 overflow-hidden py-3" dir="ltr">
        <ul className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]">
          {PARTNERS.map((pk) => <PartnerLogo key={pk.logo} pk={pk} />)}
          {PARTNERS.map((pk) => <PartnerLogo key={pk.logo + "-dup"} pk={pk} hidden />)}
        </ul>
      </div>
    </section>
  );
}

function Nav() {
  const { lang, setLang } = useLang();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const Chevron = lang === "en" ? ChevronRight : ChevronLeft;
  const [langDd, setLangDd] = useState(false);
  const langDdRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!langDd) return;
    const away = (e: Event) => { if (!langDdRef.current?.contains(e.target as Node)) setLangDd(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setLangDd(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [langDd]);
  const [active, setActive] = useState("");
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Highlight the nav link for the section currently under the header.
    // Reads first, writes last, at most once per frame: keeps scrolling smooth on phones.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY, vh = window.innerHeight, full = document.documentElement.scrollHeight;
        let cur = "";
        for (const n of NAV) {
          const el = document.getElementById(n.id);
          if (el && el.getBoundingClientRect().top <= 140) cur = n.id;
        }
        const max = full - vh;
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        setSolid(y > 40);
        setActive(y + vh >= full - 4 ? NAV[NAV.length - 1].id : cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // full-screen menu: freeze the page behind it
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [menu]);

  const dark = solid || menu;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,padding] duration-300 ${dark ? `${menu ? "bg-[#F8F6F1]" : "bg-[#F8F6F1]/90"} py-2.5 shadow-[0_1px_0_rgba(11,23,51,.08),0_8px_24px_-16px_rgba(5,17,39,.35)] backdrop-blur-md` : "py-4"}`}>
      <div ref={progress} aria-hidden className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#16295A] via-[#0B1A3D] to-[#16295A] transition-opacity duration-300 ltr:origin-left rtl:origin-right ${solid ? "opacity-100" : "opacity-0"}`} style={{ transform: "scaleX(0)" }} />
      {/* Same arrangement in every language: logo left, controls right */}
      {/* 3 columns (1fr | auto | 1fr) keep the nav truly centred whatever the logo/controls widths */}
      <div dir="ltr" className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-8 relative">
        <div className="justify-self-start"><Logo dark={dark} /></div>
        <nav dir={lang === "en" ? "ltr" : "rtl"} className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-full p-1 text-[14px] font-semibold ring-1 transition-colors duration-300 xl:flex ${dark ? "bg-white/70 text-ink ring-ink/[.06] shadow-[0_2px_10px_-6px_rgba(5,17,39,.25)]" : "bg-black/20 text-white ring-white/20 backdrop-blur-md"}`}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? "location" : undefined} className={`whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors duration-200 ${dark ? (active === n.id ? "bg-[#0B1A3D] text-white" : "hover:bg-sand-100 hover:text-gold-deep") : (active === n.id ? "bg-white text-ink" : "hover:bg-white/15")}`}>
              {n.l[lang]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          {/* Language dropdown */}
          <div ref={langDdRef} className="relative" dir="ltr">
            <button type="button" onClick={() => setLangDd(!langDd)} aria-haspopup="listbox" aria-expanded={langDd} aria-label="Language"
              className={`flex items-center gap-1.5 rounded-full border py-1.5 pe-2.5 ps-3 text-xs font-bold transition-colors ${dark ? "border-sand-300 bg-white text-ink hover:border-gold" : "border-white/40 bg-black/25 text-white hover:bg-black/25"}`}>
              <Globe size={15} />{LANGS.find((l) => l.k === lang)?.l}
              <ChevronDown size={14} className={`transition-transform duration-200 ${langDd ? "rotate-180" : ""}`} />
            </button>
            {langDd && (
              <ul role="listbox" className="pop-in absolute end-0 top-full z-50 mt-2 w-40 rounded-2xl border border-sand-300 bg-white p-1.5 text-ink shadow-card">
                {LANGS.map((l) => {
                  const on = l.k === lang;
                  return (
                    <li key={l.k} role="option" aria-selected={on}>
                      <button type="button" onClick={() => { setLang(l.k as Lang); setLangDd(false); }}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-sand-100 ${on ? "font-bold text-gold-deep" : "font-semibold"}`}>
                        <span dir={l.k === "en" ? "ltr" : "rtl"}>{({ ar: "العربية", he: "עברית", en: "English" } as Record<string, string>)[l.k]}</span>
                        <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">{l.l}{on && <Check size={14} className="text-gold-deep" />}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <a href="#contact" dir={lang === "en" ? "ltr" : "rtl"} className={`${gold} hidden items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:flex`}>
            {t.plan[lang]}<Arrow size={16} />
          </a>
          <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu"
            className={`grid h-10 w-10 place-items-center rounded-full transition focus-visible:outline-none xl:hidden ${dark ? "text-ink hover:bg-sand-100" : "bg-black/25 text-white hover:bg-black/25"}`}>
            {menu ? <X key="x" size={20} className="pop-in" /> : <Menu key="m" size={20} className="pop-in" />}
          </button>
        </div>
      </div>
      {menu && (
        <>
          {/* Full-screen sheet that continues the header surface: no card, no corners */}
          <nav dir={lang === "en" ? "ltr" : "rtl"} className="fade-in flex h-[calc(100dvh-60px)] flex-col overflow-y-auto overscroll-contain border-t border-ink/5 xl:hidden">
            <ul className="mx-auto w-full max-w-xl px-6 pt-2">
              {NAV.map((n, i) => {
                const Icon = navIcons[n.id as keyof typeof navIcons] ?? Compass;
                const on = active === n.id;
                return (
                  <li key={n.id} className="fade-up border-b border-ink/[.07]" style={{ "--d": `${i * 45}ms` } as React.CSSProperties}>
                    <a href={`#${n.id}`} onClick={() => setMenu(false)} aria-current={on ? "location" : undefined}
                      className="group flex items-center gap-4 py-[1.1rem]">
                      <Icon size={20} strokeWidth={1.75} className="shrink-0 text-gold-deep" />
                      <span className={`flex-1 text-lg font-bold transition ${on ? "text-gold-deep" : "text-ink group-hover:text-gold-deep"}`}>{n.l[lang]}</span>
                      {on
                        ? <span className="h-2 w-2 rounded-full bg-[#C2935F]" />
                        : <Chevron size={18} className="text-ink/25 transition group-hover:text-gold-deep" />}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mx-auto mt-auto w-full max-w-xl px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-6">
              <a href="#contact" onClick={() => setMenu(false)} className={`${gold} flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-extrabold text-ink shadow-soft transition active:scale-[.98]`}>
                {t.plan[lang]}<Arrow size={18} />
              </a>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft"><BadgeCheck size={15} className="text-gold-deep" />{t.certBadge[lang]}</span>
                <span className="flex gap-1">
                  {SOCIAL.instagram && <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-sand-100 hover:text-[#DD2A7B]"><Instagram size={18} /></a>}
                  {SOCIAL.facebook && <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-sand-100 hover:text-[#1877F2]"><Facebook size={18} /></a>}
                </span>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

const tabs = [
  { k: "packages", Icon: Palmtree },
  { k: "hotels", Icon: BedDouble },
  { k: "transfers", Icon: CarFront },
  { k: "honeymoon", Icon: Heart },
] as const;

function Select({ icon: Icon, label, opt, value, onChange, options, placeholder, wrap, align }: { icon: React.ElementType; label: string; opt?: string; value: string; onChange: (v: string) => void; options: Opt[]; placeholder?: string; wrap?: string; align?: "start" | "end" }) {
  return (
    <Dropdown value={value} onChange={onChange} options={options} rootClassName={wrap} align={align}
      className="relative block h-full w-full rounded-2xl border border-sand-300 bg-white px-4 py-2.5 text-start transition hover:border-gold/60 aria-expanded:border-gold aria-expanded:ring-2 aria-expanded:ring-gold/25">
      {(s, open) => (
        <>
          <span className="block truncate text-[12px] font-bold text-ink">{label} {opt && <span className="font-normal text-ink-soft">{opt}</span>}</span>
          <span className="mt-0.5 flex items-center gap-2 pe-4 text-ink-soft">
            <Icon size={17} className="shrink-0" />
            <span className={`truncate text-[13px] ${s ? "font-semibold text-ink" : ""}`}>{s?.label ?? placeholder}</span>
          </span>
          <ChevronDown size={15} className={`pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </>
      )}
    </Dropdown>
  );
}

function SearchCard() {
  const { lang } = useLang();
  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("packages");
  const [kind, setKind] = useState("0");
  const [f, setF] = useState({ dest: "", from: "", start: "", end: "", n: "2", budget: "" });
  const [open, setOpen] = useState(false);
  const pop = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (pop.current && !pop.current.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, []);

  const destLabel = (en: string) => t.destOpts.find((o) => o.en === en)?.[lang] ?? "";
  const budgetLabel = (i: string) => (i === "" ? "" : t.budgets[Number(i)][lang]);
  const dates = f.start ? fmtRange(f.start, f.end, lang) : t.fDatesPh[lang];

  function inquire() {
    const lines = [
      `Masia · ${t.tabs[tab][lang]} · ${t.tailor[Number(kind)][lang]}`,
      f.dest && `${t.fDestination[lang]}: ${destLabel(f.dest)}`,
      f.from && `${t.fFrom[lang]}: ${f.from}`,
      f.start && `${t.fDates[lang]}: ${f.start}${f.end ? " → " + f.end : ""}`,
      `${t.fTrav[lang]}: ${f.n}`,
      f.budget !== "" && `${t.fBudget[lang]}: ${budgetLabel(f.budget)}`,
    ].filter(Boolean) as string[];
    const msg = lines.join("\n");
    if (WHATSAPP) {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    } else {
      window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg, dest: f.dest } }));
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="fade-up relative z-20 mx-auto -mt-32 max-w-6xl px-3 sm:-mt-28 sm:px-6" style={{ "--d": "250ms" } as React.CSSProperties}>
      <div className="rounded-3xl border border-white/80 bg-white/95 p-4 shadow-card backdrop-blur sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-300 pb-3">
          <div className="no-scrollbar -mx-1 flex w-full gap-1 overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:gap-5 sm:overflow-visible sm:px-0">
            {tabs.map(({ k, Icon }) => (
              <button type="button" key={k} onClick={() => setTab(k)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-2 pb-2 pt-1 text-[15px] font-bold transition ${tab === k ? "border-gold text-ink" : "border-transparent text-ink-soft hover:text-ink"}`}>
                <Icon size={18} className={tab === k ? "text-gold-deep" : ""} />{t.tabs[k][lang]}
              </button>
            ))}
          </div>
          <Dropdown value={kind} onChange={setKind} align="end" options={t.tailor.map((x, i) => ({ value: String(i), label: x[lang] }))}
            rootClassName="hidden sm:block"
            className="flex items-center gap-2 rounded-xl border border-sand-300 bg-white py-2 pe-3 ps-4 text-sm font-bold transition hover:border-gold/60 aria-expanded:border-gold aria-expanded:ring-2 aria-expanded:ring-gold/25">
            {(s, open) => <>{s?.label}<ChevronDown size={15} className={`shrink-0 text-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`} /></>}
          </Dropdown>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <Select icon={MapPin} label={t.fDestination[lang]} value={f.dest} onChange={(v) => setF({ ...f, dest: v })}
            placeholder={t.fDestPh[lang]} options={t.destOpts.map((o) => ({ value: o.en, label: o[lang] }))} wrap="sm:col-span-2 lg:col-span-1" />
          {/* Phones only: trip type sits next to destination (the header dropdown is hidden there) */}
          <Select icon={Sparkles} label={t.fKind[lang]} value={kind} onChange={setKind} align="end"
            options={t.tailor.map((x, i) => ({ value: String(i), label: x[lang] }))} wrap="sm:hidden" />
          <Select icon={PlaneTakeoff} label={t.fFrom[lang]} value={f.from} onChange={(v) => setF({ ...f, from: v })}
            placeholder={t.fFromPh[lang]} options={DEPARTURES.map((d) => ({ value: d, label: d }))} />
          <div ref={pop} className="relative">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={`relative block h-full w-full rounded-2xl border bg-white px-4 py-2.5 text-start transition hover:border-gold/60 ${open ? "border-gold ring-2 ring-gold/25" : "border-sand-300"}`}>
              <span className="block truncate text-[12px] font-bold">{t.fDates[lang]}</span>
              <span className="mt-0.5 flex items-center gap-2 pe-4 text-ink-soft"><CalendarDays size={17} className="shrink-0" /><span className={`truncate text-[13px] ${f.start ? "font-semibold text-ink" : ""}`}>{dates}</span></span>
              <ChevronDown size={15} className={`absolute end-3 top-1/2 -translate-y-1/2 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="pop-in absolute end-0 top-full z-30 mt-2 rounded-3xl border border-sand-300 bg-white p-4 shadow-card">
                <Calendar start={f.start} end={f.end} lang={lang} onChange={(start, end) => setF({ ...f, start, end })} onDone={() => setOpen(false)} />
              </div>
            )}
          </div>
          <Select icon={Users} label={t.fTrav[lang]} value={f.n} onChange={(v) => setF({ ...f, n: v })}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: `${n} ${t.fTravN[lang]}` }))} />
          <Select icon={Wallet} label={t.fBudget[lang]} opt={t.optional[lang]} value={f.budget} onChange={(v) => setF({ ...f, budget: v })}
            placeholder={t.fBudgetPh[lang]} options={t.budgets.map((b, i) => ({ value: String(i), label: b[lang] }))} align="end" />
          <button type="button" onClick={inquire} className={`${gold} col-span-2 flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-[15px] font-extrabold leading-tight lg:col-span-1 lg:px-3 text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-card hover:brightness-105 active:translate-y-0`}>
            <MessageCircle size={20} className="shrink-0" /><span className="whitespace-nowrap xl:whitespace-normal xl:text-[14px] xl:[text-wrap:balance]">{t.wa[lang]}</span><span aria-hidden className="shrink-0 lg:hidden">{lang === "en" ? "→" : "←"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const featIcons = { tag: Tag, wa: MessageCircle, shield: ShieldCheck, cal: CalendarCheck2 } as const;
function Features() {
  const { lang } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      {/* Minimal row: line icon + title + one short line, thin dividers on desktop */}
      <ul data-reveal className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-sand-300 lg:rtl:divide-x-reverse">
        {t.features.map((x) => {
          const Icon = featIcons[x.k as keyof typeof featIcons];
          return (
            <li key={x.k} className="flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-b from-white to-white/40 px-3 py-4 text-center lg:flex-row lg:items-start lg:gap-3 lg:rounded-none lg:bg-none lg:px-6 lg:py-0 lg:text-start lg:first:ps-0 lg:last:pe-0">
              <Icon size={22} strokeWidth={1.5} className="shrink-0 text-gold-deep lg:mt-0.5" />
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-tight sm:text-[15px]">{x.t[lang]}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-soft sm:text-[13px]">{x.d[lang]}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Width of one slide in the packages row: most of the screen on phones, 2 per view on tablets, 4 on desktop.
const slideW = "w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]";

function PackagesRow() {
  const { lang } = useLang();
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = () => {
    const el = row.current; if (!el) return;
    const x = Math.abs(el.scrollLeft), max = el.scrollWidth - el.clientWidth;
    setEdge({ start: x < 8, end: x > max - 8 });
  };
  useEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, []);
  // forward = towards the end of the reading direction (left in Hebrew/Arabic)
  const slide = (forward: boolean) => {
    const el = row.current; if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 300) + 20;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: (forward ? 1 : -1) * (rtl ? -1 : 1) * step, behavior: "smooth" });
  };
  const Prev = lang === "en" ? ChevronLeft : ChevronRight;
  const Next = lang === "en" ? ChevronRight : ChevronLeft;
  return (
    <div className="relative mx-auto mt-7 max-w-6xl sm:mt-9 sm:px-6">
      {[{ f: false, I: Prev, off: edge.start }, { f: true, I: Next, off: edge.end }].map(({ f, I, off }) => (
        <button key={String(f)} type="button" onClick={() => slide(f)} disabled={off} aria-label={f ? "Next" : "Previous"}
          className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-sand-300 bg-white/95 text-ink shadow-card backdrop-blur transition hover:scale-105 hover:border-gold hover:bg-gold disabled:pointer-events-none disabled:opacity-0 md:grid ${f ? "end-0" : "start-0"}`}>
          <I size={22} />
        </button>
      ))}
      <div ref={row} onScroll={measure}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 py-2 sm:scroll-px-0 sm:gap-5 sm:px-0">
        {PACKAGES.map((pk) => <PackageCard key={pk.id} pk={pk} />)}
        <Exclusive />
      </div>
    </div>
  );
}

function PackageCard({ pk }: { pk: (typeof PACKAGES)[number] }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const d = t.pk[pk.id as keyof typeof t.pk];
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  return (
    <>
      <article data-reveal onClick={() => setOpen(true)} className={`group relative min-h-[400px] cursor-pointer overflow-hidden rounded-[1.75rem] shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-card lg:min-h-[440px] ${slideW}`}>
        <Image src={`/img/${pk.img}.jpg`} alt="" fill sizes="(max-width:640px) 82vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051127]/90 via-[#051127]/20 to-transparent" />
        <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-ink">{d.badge[lang]}</span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-start text-white">
          <h3 className="text-2xl font-extrabold leading-tight">{d.n[lang]}</h3>
          <p className="mt-1 text-sm text-white/80">{d.s[lang]}</p>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/15 pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/25 backdrop-blur"><Moon size={13} className="text-[#D7B576]" />{pk.nights} {t.pkNights[lang]}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(true); }} aria-haspopup="dialog"
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink transition hover:bg-[#D7B576]">{t.view[lang]}<Arrow size={14} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" /></button>
          </div>
        </div>
      </article>
      {open && <PackageModal pk={pk} onClose={() => setOpen(false)} />}
    </>
  );
}

function Exclusive() {
  const { lang } = useLang();
  const [s, setS] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (!FORM_ENDPOINT) return setS("err");
    setS("busy");
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, _subject: "Masia: exclusive offers signup" }) });
      setS(r.ok ? "ok" : "err");
    } catch { setS("err"); }
  }
  const icons = [Percent, Mail, Star];
  return (
    <div data-reveal className={`relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[1.75rem] text-start lg:min-h-[440px] bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] p-5 text-white shadow-soft ${slideW}`}>
      <Mark className="pointer-events-none absolute -bottom-6 -end-6 h-40 w-40 text-white/10" />
      <div className="relative">
        <h3 className="text-2xl font-extrabold">{t.exH[lang]}</h3>
        <p className="mt-1 text-[13px] text-white/80">{t.exD[lang]}</p>
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {t.exList.map((x, i) => { const I = icons[i]; return <li key={i} className="flex items-center gap-2"><I size={14} className="text-[#D7B576]" />{x[lang]}</li>; })}
        </ul>
      </div>
      <form onSubmit={go} className="relative mt-4">
        <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1 ring-1 ring-white/25 transition focus-within:ring-[#D7B576]">
          <input name="email" type="email" required dir="ltr" placeholder={t.email[lang]} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-white/55" />
          <button disabled={s === "busy"} aria-label="Subscribe" className={`${gold} grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition hover:scale-105 disabled:opacity-60`}><Arrow size={16} /></button>
        </div>
        <p role="status" className="mt-1 h-4 text-xs text-[#D7B576]">{s === "ok" ? t.sent[lang] : s === "err" ? t.err[lang] : ""}</p>
      </form>
    </div>
  );
}

const trustIcons = { cert: BadgeCheck, secure: LockKeyhole, price: ReceiptText } as const;

// Rotating "certified" seal with the Masia jet in the middle.
function Seal() {
  return (
    <div className="relative mx-auto hidden h-36 w-36 shrink-0 place-items-center sm:grid sm:h-44 sm:w-44">
      <div className="absolute inset-0 rounded-full bg-[#D7B576]/10 ring-1 ring-[#D7B576]/30" />
      <svg viewBox="0 0 200 200" style={{ direction: "ltr" }} className="seal-spin absolute inset-0 h-full w-full text-[#D7B576]" aria-hidden>
        <defs><path id="seal-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text className="fill-current font-brand text-[13px] font-semibold" textLength="488" lengthAdjust="spacing">
          <textPath href="#seal-ring">CERTIFIED TRAVEL AGENCY · MASIA · GLOBAL JOURNEY ·</textPath>
        </text>
      </svg>
      <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#D7B576] to-[#9C7442] shadow-[0_10px_40px_-8px_rgba(215,181,118,.6)] sm:h-24 sm:w-24">
        <Mark className="h-11 w-11 text-[#0B1A3D] sm:h-12 sm:w-12" />
      </div>
    </div>
  );
}

export function Trust() {
  const { lang } = useLang();
  return (
    <section id="trust" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Feature tile */}
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] p-6 text-white shadow-card sm:p-10">
          <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[#D7B576]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B576]/50 bg-[#D7B576]/10 px-3.5 py-1.5 text-xs font-bold text-[#D7B576]">
                  <ShieldCheck size={15} />{t.certBadge[lang]}
                </span>
                <span className="flex gap-0.5 text-[#D7B576]" aria-label="5 stars">
                  {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={17} fill="currentColor" strokeWidth={0} />)}
                </span>
              </div>
              <h2 className="mt-4 font-brand text-[1.75rem] font-semibold leading-[1.15] sm:mt-5 sm:text-[2.6rem]">{t.trustH[lang]}</h2>
              <p className="mt-3 max-w-lg text-white/70">{t.trustL[lang]}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/[.07] px-4 py-2.5 text-sm font-semibold ring-1 ring-white/10 sm:mt-6">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#D7B576] to-[#C2935F] text-ink"><Star size={14} fill="currentColor" strokeWidth={0} /></span>
                {t.trustStars[lang]}
              </p>
            </div>
            <Seal />
          </div>
        </div>

        {/* Promise tiles */}
        <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1">
          {t.trust.map((x, i) => {
            const Icon = trustIcons[x.k as keyof typeof trustIcons];
            return (
              <div key={x.k} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
                className="group flex items-center gap-4 rounded-2xl border border-sand-300 bg-white p-4 shadow-soft transition duration-300 sm:items-start sm:rounded-3xl sm:p-5 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-card sm:flex-col lg:flex-row lg:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#D7B576] to-[#C2935F] text-ink shadow-soft transition duration-300 group-hover:-rotate-6 sm:h-12 sm:w-12">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="font-extrabold">{x.t[lang]}</h3>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{x.d[lang]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Top() {
  const { lang } = useLang();
  const slides = useHeroSlides();
  return (
    <>
      <section className="relative h-[600px] overflow-hidden sm:h-[660px]">
        <HeroBackdrop cur={slides.cur} prev={slides.prev} />
        {/* Overlays: dark top for the menu, soft focus behind the title, vivid middle, short smooth fade into the page */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#051127]/70 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_42%,rgba(5,17,39,.4),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,rgba(5,17,39,.2))]" />
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-[#F8F6F1]" />
        <Nav />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-24 pt-14 text-center">
          
          <h1 style={{ "--d": "80ms" } as React.CSSProperties} className="fade-up text-[22vw] leading-none drop-shadow-[0_6px_28px_rgba(0,0,0,.45)] sm:text-[150px]">
            <Wordmark className="font-light" sizes="(max-width:640px) 70vw, 480px" priority /><span className="sr-only">Masia</span>
          </h1>
          <p style={{ "--d": "120ms" } as React.CSSProperties} className="fade-up mt-3 font-brand text-sm font-light tracking-[.5em] text-[#D7B576] drop-shadow-[0_1px_6px_rgba(0,0,0,.5)] sm:text-lg" dir="ltr">global journey</p>
          <p style={{ "--d": "160ms" } as React.CSSProperties} className="fade-up mt-2 max-w-xl text-base font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.55)] sm:text-xl">{t.heroSub[lang]}</p>
          <HeroDots cur={slides.cur} go={slides.go} />
        </div>
      </section>
      <SearchCard />
      <Features />
      <div id="packages" className="mx-auto max-w-6xl px-4 pt-10 text-center sm:px-6 sm:pt-14 sm:text-start">
        <div data-reveal className="mx-auto max-w-2xl sm:mx-0">
          <span className="inline-block rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand-50">{t.pkTag[lang]}</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{t.pkHead[lang]}</h2>
          <p className="mt-3 text-ink-soft sm:text-lg">{t.pkSub[lang]}</p>
        </div>
      </div>
      <PackagesRow />
      {SHOW_PARTNERS && <Partners />}
      <Quiz />
    </>
  );
}

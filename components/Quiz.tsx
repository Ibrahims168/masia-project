"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Check, CalendarClock, Info, Plus } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { STYLE, Flag, ruleFor, savePassport, PASSPORT_KEY } from "@/components/visa-shared";

// Quiz destination → visa-check destination
const VISA_OF: Record<string, string> = { bangkok: "thailand", phuket: "thailand", krabi: "thailand", japan: "japan", vietnam: "vietnam", maldives: "maldives",
  paris: "schengen", rome: "schengen", prague: "schengen", amsterdam: "schengen", swiss: "schengen", santorini: "schengen" };

type Season = keyof typeof t.season;

// How well each destination suits each answer (0–3). Order matches t.quizWho / quizVibe / quizLen / quizStay.
// minBudget = lowest t.budgets index that comfortably covers it. season = planner key for month ratings.
const FIT: Record<string, { who: number[]; vibe: number[]; len: number[]; stay: number[]; minBudget: number; season: string }> = {
  //            couple honey family friends solo group | beach city culture nature luxury night
  bangkok:  { who: [1, 0, 3, 3, 3, 3], vibe: [0, 3, 3, 1, 2, 3], len: [3, 2, 1, 1], stay: [3, 3, 3, 1], minBudget: 0, season: "thailand" },
  phuket:   { who: [2, 2, 3, 3, 2, 3], vibe: [3, 1, 1, 2, 2, 3], len: [2, 3, 2, 2], stay: [2, 3, 3, 3], minBudget: 0, season: "thailand" },
  krabi:    { who: [3, 3, 2, 2, 2, 2], vibe: [3, 0, 1, 3, 2, 1], len: [2, 3, 2, 1], stay: [2, 3, 3, 3], minBudget: 0, season: "thailand" },
  japan:    { who: [2, 2, 3, 2, 3, 2], vibe: [0, 3, 3, 2, 2, 2], len: [1, 2, 3, 3], stay: [2, 3, 3, 1], minBudget: 1, season: "japan" },
  vietnam:  { who: [2, 2, 2, 3, 3, 3], vibe: [2, 3, 3, 3, 1, 2], len: [1, 2, 3, 3], stay: [3, 3, 3, 2], minBudget: 0, season: "vietnam" },
  maldives: { who: [3, 3, 1, 1, 1, 1], vibe: [3, 0, 0, 1, 3, 0], len: [3, 3, 2, 1], stay: [0, 1, 3, 3], minBudget: 2, season: "maldives" },
  paris:     { who: [3, 3, 2, 2, 2, 2], vibe: [0, 3, 3, 0, 3, 3], len: [3, 3, 2, 1], stay: [2, 3, 3, 1], minBudget: 1, season: "france" },
  rome:      { who: [3, 2, 3, 2, 2, 3], vibe: [0, 3, 3, 0, 2, 2], len: [3, 3, 2, 1], stay: [2, 3, 3, 1], minBudget: 1, season: "italy" },
  prague:    { who: [2, 1, 2, 3, 3, 3], vibe: [0, 3, 3, 1, 1, 3], len: [3, 2, 1, 1], stay: [3, 3, 2, 0], minBudget: 0, season: "czechia" },
  amsterdam: { who: [2, 1, 2, 3, 3, 2], vibe: [0, 3, 2, 1, 1, 3], len: [3, 2, 1, 1], stay: [3, 3, 2, 0], minBudget: 1, season: "netherlands" },
  swiss:     { who: [3, 3, 3, 2, 2, 2], vibe: [0, 1, 1, 3, 3, 0], len: [1, 3, 3, 2], stay: [1, 2, 3, 2], minBudget: 2, season: "switzerland" },
  santorini: { who: [3, 3, 1, 2, 1, 1], vibe: [3, 0, 1, 1, 3, 1], len: [3, 3, 1, 1], stay: [1, 3, 3, 3], minBudget: 2, season: "greece" },
};
const seasonOf = (k: string, m: number): Season =>
  (t.planner.find((p) => p.k === FIT[k].season)?.seasons[m] ?? "g") as Season;

type Ans = { who: number; region: number; vibes: number[]; len: number; stay: number; budget: number; month: number; pp: number };

// Works on a partly answered quiz too (unanswered = neutral), which powers the live "leading" pill.
function rank(a: Partial<Ans>) {
  const region = a.region != null ? t.quizRegion[a.region].k : "";
  return t.dest
    .filter((d) => !region || d.r === region)
    .map((d) => {
      const f = FIT[d.k];
      const s: Season = a.month == null || a.month < 0 ? "b" : seasonOf(d.k, a.month);
      const vibes = a.vibes ?? [];
      const vibe = vibes.length ? vibes.reduce((n, v) => n + f.vibe[v], 0) / vibes.length : 2;
      let score = (a.who != null ? f.who[a.who] : 2) + vibe * 2 + (a.len != null ? f.len[a.len] : 2) + (a.stay != null ? f.stay[a.stay] : 2);
      score += a.month == null ? 1 : s === "b" ? 3 : s === "g" ? 1 : -1;
      score += a.budget == null ? 1 : a.budget < f.minBudget ? -3 * (f.minBudget - a.budget) : 1;
      const pct = Math.max(55, Math.min(98, Math.round(50 + (score / 19) * 48)));
      return { d, s, pct, fits: a.budget == null || a.budget >= f.minBudget };
    })
    .sort((x, y) => y.pct - x.pct);
}

// Animated number (match %): eases from the previous value to the new one.
function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(a + (target - a) * e));
      if (p < 1) raf = requestAnimationFrame(tick); else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const SAVE_KEY = "tv-quiz-v3"; // bump when the steps change, so old saves are ignored

// City + beach in Thailand pair well when there's time for both.
function comboFor(topKey: string, a: Ans) {
  if (a.len < 1) return null;
  const beach = ["phuket", "krabi"];
  if (beach.includes(topKey) && a.vibes.some((v) => v === 1 || v === 2 || v === 5)) return ["bangkok", topKey];
  if (topKey === "bangkok" && a.vibes.some((v) => v === 0)) return ["bangkok", a.vibes.includes(3) ? "krabi" : "phuket"];
  if (topKey === "phuket" && a.vibes.includes(3)) return ["phuket", "krabi"];
  return null;
}

// Step order. Use these names instead of raw numbers.
const S = { who: 0, region: 1, vibe: 2, len: 3, stay: 4, budget: 5, month: 6, pp: 7 } as const;
const STEPS = 8;

export function Quiz() {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Partial<Ans>>({ vibes: [] });
  const advance = useRef<ReturnType<typeof setTimeout>>(undefined);
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const Back = lang === "en" ? ArrowLeft : ArrowRight;

  const [pick, setPick] = useState(0); // which result is shown (tap a runner-up to switch)
  const [savedPp, setSavedPp] = useState(-1); // passport already chosen in the visa section
  const box = useRef<HTMLDivElement>(null);

  // Resume where the visitor left off; preselect their passport.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      // Only resume a save whose answers still exist (options can change between visits).
      const a = s?.ans as Partial<Ans> | undefined;
      const ok = (v: unknown, n: number, flex = false) => v == null || (Number.isInteger(v) && (v as number) < n && ((v as number) >= 0 || (flex && v === -1)));
      if (a && Number.isInteger(s.step) && s.step >= 0 && s.step <= STEPS
        && ok(a.who, t.quizWho.length) && ok(a.region, t.quizRegion.length) && ok(a.len, t.quizLen.length) && ok(a.stay, t.quizStay.length) && ok(a.budget, t.budgets.length)
        && ok(a.month, 12, true) && ok(a.pp, t.passports.length) && Array.isArray(a.vibes) && a.vibes.every((v) => ok(v, t.quizVibe.length))
        && (s.step < STEPS || (a.who != null && a.region != null && a.vibes.length && a.len != null && a.stay != null && a.budget != null && a.month != null && a.pp != null))) {
        setAns(a); setStep(s.step);
      }
      const pp = t.passports.findIndex((x) => x.k === (localStorage.getItem(PASSPORT_KEY) || "il")); // same default as the visa section
      setSavedPp(pp);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ step, ans })); } catch {}
  }, [step, ans]);

  // When the step changes (start over, result, back…) and the top of the quiz has scrolled
  // out of view, bring it back under the fixed header. Skipped on first load.
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) { firstStep.current = false; return; }
    const el = box.current;
    if (!el) return;
    const header = 84; // fixed header height + a little air
    const top = el.getBoundingClientRect().top;
    if (top < header || top > innerHeight * 0.6) {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: scrollY + top - header, behavior: reduce ? "auto" : "smooth" });
    }
  }, [step]);

  // Single-choice steps: show the pick for a beat, then move on.
  const set = (k: keyof Ans, v: number) => {
    clearTimeout(advance.current);
    setAns((a) => ({ ...a, [k]: v }));
    if (k === "pp") savePassport(t.passports[v].k); // keep the visa section in sync
    const from = step;
    advance.current = setTimeout(() => { setPick(0); setStep((s) => (s === from ? s + 1 : s)); }, 220);
  };
  const toggleVibe = (v: number) => {
    const cur = ans.vibes ?? [];
    clearTimeout(advance.current);
    if (cur.includes(v)) return setAns((a) => ({ ...a, vibes: cur.filter((x) => x !== v) }));
    if (cur.length >= 3) return;
    const next = [...cur, v];
    setAns((a) => ({ ...a, vibes: next }));
    // third pick: let the check mark show briefly, then move on
    if (next.length === 3) advance.current = setTimeout(() => setStep((s) => (s === S.vibe ? S.len : s)), 400);
  };
  const restart = () => { clearTimeout(advance.current); setAns({ vibes: [] }); setStep(0); setPick(0); };
  const back = () => { clearTimeout(advance.current); setStep((s) => Math.max(0, s - 1)); };

  const done = step >= STEPS;
  const compact = step > 0; // phones: slimmer header once the visitor has started
  const full = ans as Ans;
  const results = rank(ans);
  const top = results[Math.min(pick, 2)];
  const leader = results[0];
  const answered = (ans.who != null ? 1 : 0) + (ans.region != null ? 1 : 0) + ((ans.vibes ?? []).length ? 1 : 0) + ["len", "stay", "budget", "month"].filter((k) => ans[k as keyof Ans] != null).length;
  const pct = useCountUp(done ? top.pct : leader.pct);
  const combo = done && top ? comboFor(top.d.k, full) : null;
  const destBy = (k: string) => t.dest.find((d) => d.k === k)!;

  // Keyboard: 1–9 picks an option, Enter continues, Backspace goes back.
  // Only while the quiz is on screen and the visitor isn't typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable) return;
      const r = box.current?.getBoundingClientRect();
      if (!r || r.bottom < 120 || r.top > innerHeight - 120) return;
      if (e.key === "Backspace" && step > 0) { e.preventDefault(); return done ? restart() : back(); }
      if (done) return;
      if (e.key === "Enter" && step === S.vibe && (ans.vibes ?? []).length) { e.preventDefault(); return setStep(S.len); }
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1) return;
      const i = n - 1;
      const lists = [t.quizWho, t.quizRegion, t.quizVibe, t.quizLen, t.quizStay, t.budgets, t.monthL, t.passports];
      if (i >= lists[step].length) return;
      e.preventDefault();
      if (step === S.vibe) toggleVibe(i);
      else set((["who", "region", "vibes", "len", "stay", "budget", "month", "pp"] as const)[step], i);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  // Small number badge on each option (desktop only), matching the keyboard shortcut.
  const key = (n: number) => n > 9 ? null : (
    <span aria-hidden className="absolute start-2.5 top-2.5 hidden h-5 min-w-5 place-items-center rounded-md bg-white/10 px-1 text-[10px] font-bold text-white/45 lg:grid">{n}</span>
  );

  function plan() {
    if (!top) return;
    const parts = [
      t.quizWho[full.who].l[lang],
      t.quizRegion[full.region].l[lang],
      full.vibes.map((v) => t.quizVibe[v].l[lang]).join(" + "),
      t.quizLen[full.len].d[lang],
      t.quizStay[full.stay].l[lang],
      t.budgets[full.budget][lang],
      full.month < 0 ? t.quizFlexible[lang] : t.monthL[full.month][lang],
      t.passports[full.pp].n[lang],
    ];
    const where = combo ? combo.map((k) => destBy(k).n[lang]).join(" + ") : top.d.n[lang];
    window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${t.quizH[lang]}: ${parts.join(" · ")} → ${where}`, dest: combo ? "More than one" : top.d.form } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  // Colours are chosen per state (not stacked), so the picked look always wins.
  const tile = "group relative flex items-center gap-3 rounded-2xl border p-4 text-start font-bold transition duration-300 active:scale-[.98]";
  const picked = "border-[#D7B576] bg-[#D7B576]/15 shadow-[0_8px_24px_-14px_rgba(215,181,118,.9)]";
  const idle = "border-white/15 bg-white/[.07] hover:-translate-y-0.5 hover:border-[#D7B576]/70 hover:bg-white/[.12]";
  const card = (on: boolean, extra = "") => `${tile} ${on ? picked : idle} ${extra}`;

  return (
    <section id="quiz" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
      <div ref={box} data-reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] p-5 text-white shadow-card sm:p-10">
        <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-[#D7B576]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -start-20 h-72 w-72 rounded-full bg-[#7CC4B6]/15 blur-3xl" />

        <div className={`relative flex flex-wrap items-end justify-between ${compact ? "gap-2.5 lg:gap-4" : "gap-4"}`}>
          <div>
            <span className={`items-center gap-2 rounded-full bg-[#D7B576] px-3.5 py-1.5 text-xs font-bold text-ink ${compact ? "hidden lg:inline-flex" : "inline-flex"}`}><Sparkles size={14} />{t.quizTag[lang]}</span>
            <h2 className={`font-extrabold ${compact ? "text-2xl lg:mt-3 lg:text-4xl" : "mt-3 text-3xl sm:text-4xl"}`}>{t.quizH[lang]}</h2>
            <p className={`mt-1.5 max-w-2xl text-white/70 ${compact ? "hidden lg:block" : ""}`}>{t.quizL[lang]}</p>
          </div>
          {!done && (
            <div className="flex flex-wrap items-center gap-3">
              {answered > 0 && (
                <span key={leader.d.k} className="pop-in flex items-center gap-2 rounded-full bg-white/[.08] py-1 pe-3 ps-1 text-[13px] ring-1 sm:text-sm ring-white/15" aria-live="polite">
                  <span className="relative h-7 w-7 overflow-hidden rounded-full"><Image src={`/img/${leader.d.img}.jpg`} alt="" fill sizes="28px" className="object-cover" /></span>
                  <span className="text-white/55">{t.quizLeading[lang]}</span>
                  <b>{leader.d.n[lang]}</b>
                  <span className="font-extrabold tabular-nums text-[#D7B576]">{pct}%</span>
                </span>
              )}
              <p className="text-sm font-semibold text-white/60">{t.quizStep[lang]} {step + 1} {t.quizOf[lang]} {STEPS}</p>
            </div>
          )}
        </div>

        {/* progress: tap a finished step to go back to it */}
        <div className={`relative grid gap-1.5 ${compact ? "mt-2 lg:mt-4" : "mt-4"}`} style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0,1fr))` }}>
          {Array.from({ length: STEPS }, (_, i) => (
            <button key={i} type="button" disabled={i >= step} onClick={() => setStep(i)} aria-label={`${t.quizStep[lang]} ${i + 1}`}
              className="group/seg py-2 disabled:cursor-default">
              <span className="block h-1.5 overflow-hidden rounded-full bg-white/15"><span className={`block h-full rounded-full bg-gradient-to-r from-[#D7B576] to-[#C2935F] transition-all duration-500 ${i < step || done ? "w-full" : "w-0"}`} /></span>
            </button>
          ))}
        </div>

        <div key={step} className={`fade-up relative ${compact ? "mt-5 lg:mt-8" : "mt-8"}`}>
          {!done && <h3 className="mb-3.5 text-lg font-extrabold sm:mb-5 sm:text-2xl">{t.quizQ[step][lang]}</h3>}

          {step === 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
              {t.quizWho.map((o, i) => (
                <button key={i} type="button" onClick={() => set("who", i)} className={card(ans.who === i, "min-h-[128px] flex-col justify-center gap-2.5 px-1.5 py-6 text-center sm:min-h-0 sm:gap-3 sm:px-4 sm:py-7")}>
                  {key(i + 1)}<span className="text-3xl transition duration-300 group-hover:scale-110 sm:text-4xl">{o.e}</span>
                  <span className="flex min-h-[2.5em] items-center justify-center text-center text-[13px] leading-tight sm:min-h-0 sm:text-sm">{o.l[lang]}</span>
                </button>
              ))}
            </div>
          )}

          {step === S.region && (
            <div className="grid h-[264px] grid-cols-3 gap-2 sm:h-72 sm:gap-3 lg:h-56">
              {t.quizRegion.map((o, i) => {
                const list = t.dest.filter((d) => !o.k || d.r === o.k);
                const pics = o.k ? [list[0]] : [t.dest.find((d) => d.r === "asia")!, t.dest.find((d) => d.r === "europe")!];
                const on = ans.region === i;
                return (
                  <button key={i} type="button" onClick={() => set("region", i)} aria-pressed={on}
                    className={`group relative h-full overflow-hidden rounded-2xl text-start ring-2 transition duration-300 active:scale-[.98] ${on ? "ring-[#D7B576] shadow-[0_8px_24px_-12px_rgba(215,181,118,.9)]" : "ring-white/10 hover:-translate-y-0.5 hover:ring-[#D7B576]/60"}`}>
                    <span className="absolute inset-0 flex">
                      {pics.map((d) => (
                        <span key={d.k} className="relative h-full flex-1">
                          <Image src={`/img/${d.img}.jpg`} alt="" fill sizes="(max-width:640px) 100vw, 360px" className="object-cover transition duration-700 group-hover:scale-105" />
                        </span>
                      ))}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-t from-[#051127] via-[#051127]/45 to-transparent" />
                    {key(i + 1)}
                    {on && <span className="pop-in absolute end-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#D7B576] text-ink sm:end-3 sm:top-3 sm:h-6 sm:w-6"><Check size={13} strokeWidth={3} /></span>}
                    <span className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                      <span className="block text-base font-extrabold leading-tight sm:text-xl">{o.l[lang]}</span>
                      <span className="mt-0.5 hidden truncate text-[12px] text-white/70 sm:block">{list.slice(0, 4).map((d) => d.n[lang]).join(" · ")}{list.length > 4 ? ` +${list.length - 4}` : ""}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {step === S.vibe && (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
                {t.quizVibe.map((o, i) => {
                  const on = (ans.vibes ?? []).includes(i);
                  const full3 = (ans.vibes ?? []).length >= 3 && !on;
                  return (
                    <button key={i} type="button" onClick={() => toggleVibe(i)} aria-pressed={on} disabled={full3}
                      className={card(on, "min-h-[128px] flex-col justify-center gap-2.5 px-1.5 py-6 text-center disabled:opacity-40 sm:min-h-0 sm:gap-2.5 sm:px-3 sm:py-6")}>
                      {key(i + 1)}<span className="text-3xl transition duration-300 group-hover:scale-110">{o.e}</span>
                      <span className="flex min-h-[2.5em] items-center justify-center text-center text-[13px] leading-tight sm:min-h-0 sm:text-sm">{o.l[lang]}</span>
                      <span className={`absolute end-2 top-2 grid h-[18px] w-[18px] place-items-center rounded-full ring-1 transition sm:end-2.5 sm:top-2.5 ${on ? "bg-[#D7B576] text-ink ring-[#D7B576]" : "ring-white/30"}`}>
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm text-white/60">{(ans.vibes ?? []).length}/3 {t.quizPicked[lang]}</p>
                <button type="button" disabled={!(ans.vibes ?? []).length} onClick={() => setStep(S.len)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-6 py-3 font-extrabold text-ink shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40">
                  {t.quizNext[lang]}<Arrow size={17} />
                </button>
              </div>
            </>
          )}

          {(step === S.len || step === S.stay) && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
              {(step === S.len ? t.quizLen : t.quizStay).map((o, i) => (
                <button key={i} type="button" onClick={() => set(step === S.len ? "len" : "stay", i)}
                  className={card((step === S.len ? ans.len : ans.stay) === i, "min-h-[128px] flex-col justify-center gap-2 px-2 py-5 text-center sm:py-6")}>
                  {key(i + 1)}<span className="text-3xl transition duration-300 group-hover:scale-110">{o.e}</span>
                  <span className="text-[15px] leading-tight">{o.l[lang]}</span>
                  <span className="text-xs font-semibold text-white/60">{o.d[lang]}</span>
                </button>
              ))}
            </div>
          )}

          {step === S.budget && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {t.budgets.map((b, i) => (
                <button key={i} type="button" onClick={() => set("budget", i)} className={card(ans.budget === i, "justify-between py-5 lg:ps-10")}>{key(i + 1)}
                  <span dir="ltr">{b[lang]}</span>
                  <span className="text-[#D7B576]" aria-hidden>{"$".repeat(i + 1)}</span>
                </button>
              ))}
            </div>
          )}

          {step === S.month && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {t.monthL.map((m, i) => (
                <button key={i} type="button" onClick={() => set("month", i)} className={card(ans.month === i, "justify-center px-2 py-3.5 text-sm")}>{key(i + 1)}{m[lang]}</button>
              ))}
              <button type="button" onClick={() => set("month", -1)} className={card(ans.month === -1, "col-span-3 justify-center py-3.5 text-sm sm:col-span-4 lg:col-span-6")}>
                ✨ {t.quizFlexible[lang]}
              </button>
            </div>
          )}

          {step === S.pp && (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {t.passports.map((x, i) => (
                <button key={x.k} type="button" onClick={() => set("pp", i)} className={card(ans.pp === i || (ans.pp == null && savedPp === i), "px-3 py-3.5 text-sm lg:ps-10")}>{key(i + 1)}
                  <Flag k={x.k} size={18} /><span className="leading-tight">{x.n[lang]}</span>
                </button>
              ))}
            </div>
          )}

          {done && top && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-stretch lg:gap-6">
              <div className="flex flex-col gap-3">
                {pick === 0 && (
                  <p className="fade-up flex items-start gap-2 text-[15px] font-bold leading-snug text-[#D7B576] lg:text-base">
                    <Sparkles size={17} className="mt-0.5 shrink-0" />{t.quizBased[lang]}
                  </p>
                )}
                <div key={top.d.k} className="fade-in relative min-h-[230px] flex-1 overflow-hidden rounded-2xl lg:min-h-[300px] lg:rounded-3xl">
                  <Image src={`/img/${top.d.img}.jpg`} alt={top.d.n[lang]} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="pop-in absolute end-3 top-3 rounded-full bg-[#D7B576] px-3 py-1 text-xs font-extrabold lg:end-4 lg:top-4 lg:px-3.5 lg:py-1.5 lg:text-sm text-ink shadow-soft"><span className="tabular-nums">{pct}%</span> {t.quizMatch[lang]}</span>
                  <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
                    <h3 className="text-[34px] font-extrabold leading-tight lg:mt-1 lg:text-4xl">{top.d.n[lang]}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/85 lg:line-clamp-none">{top.d.d[lang]}</p>
                  </div>
                </div>
                {combo && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/[.07] p-2.5 ring-1 ring-[#D7B576]/40 lg:p-3">
                    <div className="flex shrink-0 items-center">
                      {combo.map((k, i) => (
                        <span key={k} className={`relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#0B1A3D] ${i ? "-ms-3" : ""}`}>
                          <Image src={`/img/${destBy(k).img}.jpg`} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-extrabold text-[#D7B576]"><Plus size={14} />{t.quizCombo[lang]}: {combo.map((k) => destBy(k).n[lang]).join(" + ")}</p>
                      <p className="hidden text-xs text-white/65 lg:block">{t.quizComboL[lang]}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-white/50">{t.quizYourTrip[lang]}</p>
                <ul className="no-scrollbar -mx-5 mt-2 flex gap-1.5 overflow-x-auto px-5 sm:-mx-10 sm:px-10 lg:mx-0 lg:mt-2.5 lg:flex-wrap lg:gap-2 lg:overflow-visible lg:px-0">
                  {[
                    `${t.quizWho[full.who].e} ${t.quizWho[full.who].l[lang]}`,
                    ...full.vibes.map((v) => `${t.quizVibe[v].e} ${t.quizVibe[v].l[lang]}`),
                    `${t.quizLen[full.len].e} ${t.quizLen[full.len].d[lang]}`,
                    `${t.quizStay[full.stay].e} ${t.quizStay[full.stay].l[lang]}`,
                    full.month < 0 ? `📅 ${t.bestTime[lang]}: ${top.d.b[lang]}` : `📅 ${t.monthL[full.month][lang]}: ${t.season[top.s].t[lang]}`,
                    ...(top.fits ? [`💰 ${t.quizFits[lang]}`] : []),
                  ].map((r, i) => (
                    <li key={i} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold ring-1 ring-white/15 lg:py-1.5 lg:text-sm">
                      <Check size={14} className="text-[#D7B576]" />{r}
                    </li>
                  ))}
                </ul>

                {(() => {
                  const vd = t.visaDest.find((v) => v.k === VISA_OF[top.d.k]);
                  if (!vd) return null;
                  const pk = t.passports[full.pp];
                  const r = ruleFor(vd, pk.k);
                  const { chip, Icon } = STYLE[r.s];
                  return (
                    <div className="mt-4 rounded-2xl bg-white p-4 text-ink shadow-soft lg:mt-5">
                      <p className="flex items-center gap-2 text-sm font-bold"><Flag k={pk.k} size={16} />{t.quizEntry[lang]} · {vd.n[lang]}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold ring-1 ${chip}`}><Icon size={15} />{t.visaStatus[r.s][lang]}</span>
                        {r.stay && <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-sm font-bold ring-1 ring-sand-300"><CalendarClock size={15} className="text-gold-deep" />{r.stay[lang]}</span>}
                      </div>
                      {r.note && <p className="mt-1.5 hidden text-[13px] leading-relaxed text-ink-soft lg:block">{r.note[lang]}</p>}
                      {r.s !== "no" && <p className="mt-1.5 hidden gap-1.5 text-[13px] leading-relaxed text-ink-soft lg:flex"><Info size={14} className="mt-0.5 shrink-0 text-gold-deep" />{vd.extra[lang]}</p>}
                      <a href="#visa" className="mt-2.5 inline-block text-[13px] font-bold text-gold-deep underline-offset-2 hover:underline">{t.quizSeeVisa[lang]} {lang === "en" ? "→" : "←"}</a>
                    </div>
                  );
                })()}

                <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-white/50 lg:mt-6">{t.quizAlso[lang]}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 lg:mt-3 lg:gap-3">
                  {results.slice(0, 3).map((r, i) => ({ r, i })).filter(({ i }) => i !== Math.min(pick, 2)).map(({ r, i }) => (
                    <button key={r.d.k} type="button" onClick={() => setPick(i)}
                      className="group flex items-center gap-2.5 rounded-2xl bg-white/[.07] p-2 text-start lg:gap-3 lg:p-2.5 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/[.12] hover:ring-[#D7B576]/50">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl lg:h-12 lg:w-12"><Image src={`/img/${r.d.img}.jpg`} alt="" fill sizes="48px" className="object-cover" /></span>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{r.d.n[lang]}</p>
                        <p className="whitespace-nowrap text-xs text-[#D7B576]">{r.pct}% {t.quizMatch[lang]}</p>
                      </div>
                      <Arrow size={15} className="ms-auto hidden shrink-0 text-white/30 transition group-hover:text-[#D7B576] lg:block" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-2 lg:mt-auto lg:gap-3 lg:pt-6">
                  <button type="button" onClick={plan}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-6 py-3.5 font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105">
                    {t.quizPlan[lang]}<Arrow size={18} />
                  </button>
                  <button type="button" onClick={restart}
                    aria-label={t.quizRestart[lang]} className="flex shrink-0 items-center gap-2 rounded-xl border border-white/20 px-4 py-3.5 font-bold text-white/85 transition hover:bg-white/10 lg:px-5">
                    <RotateCcw size={16} /><span className="hidden lg:inline">{t.quizRestart[lang]}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {step > 0 && !done && (
          <button type="button" onClick={back} className="relative mt-4 inline-flex sm:mt-6 items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white">
            <Back size={16} />{t.quizBack[lang]}
          </button>
        )}
      </div>
    </section>
  );
}

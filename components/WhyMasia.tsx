"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, ShieldCheck, MessagesSquare, Route, SlidersHorizontal, FileCheck2, Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

const flowIcons = [MessagesSquare, Route, SlidersHorizontal, FileCheck2, Plane];

// Why Masia: dark panel with the pitch + logo, six reasons, and a 5-step planning timeline.
export function WhyMasia() {
  const { lang } = useLang();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  // Timeline follows the scroll: p goes 0 → 1 as the steps move up through the screen (and back when scrolling up).
  const ol = useRef<HTMLOListElement>(null);
  const N = t.flow.length;
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ol.current; if (!el) return;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      // starts as soon as the steps enter the screen and finishes after a short scroll
      const v = (vh * 0.9 - r.top) / (r.height * 0.75 + vh * 0.25);
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  const at = p * (N - 1); // position along the steps: 0 = step 1, N-1 = last step

  return (
    <section id="trust" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0B1A3D] p-5 text-white shadow-card sm:p-8 lg:p-12">
        {/* soft gold glows */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -start-32 h-80 w-80 rounded-full bg-[#D7B576]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -end-24 h-96 w-96 rounded-full bg-[#3B5BA9]/25 blur-3xl" />

        <div className="relative">
          {/* Pitch + photo */}
          <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            <div data-reveal className="text-center sm:text-start">
              <span className="inline-block rounded-full bg-[#D7B576] px-4 py-1.5 text-xs font-bold text-ink">{t.whyTag[lang]}</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{t.whyH2[lang]}</h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/70 sm:mx-0 sm:text-lg">{t.whyL2[lang]}</p>
            </div>

            {/* Travel photo with the certified badge floating on it */}
            <div data-reveal className="relative mx-auto mb-6 w-full max-w-md lg:mb-0 lg:max-w-none">
              <div className="relative h-52 overflow-hidden rounded-3xl ring-1 ring-white/15 sm:h-60 lg:h-72">
                <Image src="/img/maldives.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 420px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A3D]/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-white p-2.5 pe-5 text-ink shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#D7B576] to-[#C2935F]"><ShieldCheck size={20} /></span>
                <span>
                  <b className="block text-sm leading-tight">{t.certBadge[lang]}</b>
                  <span className="mt-0.5 flex gap-0.5 text-[#C2935F]">{[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} fill="currentColor" strokeWidth={0} />)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Planning timeline */}
          <div className="mt-12 lg:mt-14">
            <div data-reveal className="text-center sm:text-start">
              <h3 className="text-2xl font-extrabold sm:text-3xl">{t.flowH[lang]}</h3>
              <p className="mt-1.5 text-white/60">{t.flowL[lang]}</p>
            </div>

            <ol ref={ol} className="relative mt-7 grid gap-0 lg:mt-9 lg:grid-cols-5 lg:gap-4">
              {/* desktop connector: faint track + gold fill that grows from step 1 to step 5 */}
              <span aria-hidden className="absolute inset-x-[10%] top-6 hidden h-px bg-white/15 lg:block" />
              <span aria-hidden style={{ transform: `translateY(-1px) scaleX(${p})` }}
                className="absolute inset-x-[10%] top-6 hidden h-0.5 bg-[#D7B576] shadow-[0_0_10px_rgba(215,181,118,.7)] transition-transform duration-150 ease-out motion-reduce:transition-none ltr:origin-left rtl:origin-right lg:block" />
              {t.flow.map((s, i) => {
                const Icon = flowIcons[i];
                const last = i === N - 1;
                const on = at >= i - 0.02 && p > 0;
                const seg = Math.min(1, Math.max(0, at - i)); // mobile: how much of the line below this step is filled
                return (
                  <li key={i} className="relative flex gap-4 pb-6 last:pb-0 lg:flex-col lg:items-center lg:pb-0 lg:text-center">
                    {/* mobile connector: track + gold fill down to the next step */}
                    {!last && (
                      <>
                        <span aria-hidden className="absolute start-6 top-12 bottom-0 w-px -translate-x-1/2 bg-white/15 rtl:translate-x-1/2 lg:hidden" />
                        <span aria-hidden style={{ transform: `translateX(var(--tw-translate-x)) scaleY(${seg})` }}
                          className="absolute start-6 top-12 bottom-0 w-0.5 origin-top -translate-x-1/2 bg-[#D7B576] transition-transform duration-150 ease-out motion-reduce:transition-none rtl:translate-x-1/2 lg:hidden" />
                      </>
                    )}
                    <span
                      className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 motion-reduce:transition-none ${on ? "scale-100 bg-[#D7B576] text-ink ring-[#D7B576] shadow-[0_0_0_6px_rgba(215,181,118,.15)]" : "scale-90 bg-[#0B1A3D] text-[#D7B576] ring-[#D7B576]/40"}`}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div className={`min-w-0 pt-1 transition-all duration-500 motion-reduce:transition-none lg:pt-0 ${on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-50"}`}>
                      <span className="text-xs font-bold tracking-widest text-[#D7B576]" dir="ltr">{String(i + 1).padStart(2, "0")}</span>
                      <b className="block leading-snug">{s.t[lang]}</b>
                      <span className="mt-1 block text-[13px] leading-relaxed text-white/60">{s.d[lang]}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div data-reveal className="mt-10 flex justify-center">
            <a href="#contact"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-7 py-3.5 font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105 sm:w-fit">
              {t.plan[lang]}<Arrow size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

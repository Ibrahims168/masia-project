"use client";
import { Star, Quote } from "lucide-react";
import { rv, REVIEWS, REVIEWS_ARE_SAMPLES } from "@/lib/reviews";
import { useLang } from "@/lib/lang";
import { Head } from "@/components/Sections";

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";

function Stars({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5 text-[#D7B576]" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} fill={i <= n ? "currentColor" : "none"} strokeWidth={i <= n ? 0 : 1.5} />)}
    </span>
  );
}

// Destination flag (public/flags/<code>.svg)
function DestFlag({ k }: { k: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/flags/${k}.svg`} alt="" width={22} height={16} className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/10" />;
}

export function Reviews() {
  const { lang } = useLang();
  if (!REVIEWS.length) return null;
  const month = (d: string) => new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, { month: "long", year: "numeric" }).format(new Date(`${d}-01`));

  const card = (r: (typeof REVIEWS)[number], i: number, dup = false) => (
    <figure key={(dup ? "d" : "") + i} aria-hidden={dup || undefined} dir={lang === "en" ? "ltr" : "rtl"}
      className={`${dup ? "marquee-dup " : ""}relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#071230] p-5 text-white shadow-soft ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-[#D7B576]/50 sm:w-[340px] sm:p-6`}>
      <span aria-hidden className="pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full bg-[#D7B576]/15 blur-2xl" />
      <Quote size={30} className="absolute end-5 top-5 text-[#D7B576]/40" />
      <Stars n={r.rating} size={16} />
      <blockquote dir={r.lang === "en" ? "ltr" : "rtl"} lang={r.lang} className="relative mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-white/90">{r.text}</blockquote>
      <figcaption className="relative mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#D7B576] to-[#C2935F] font-brand text-lg text-ink">{r.name.charAt(0)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold" dir="auto">{r.name} · <span className="font-semibold text-white/60">{r.from}</span></p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
            <span className="flex shrink-0 gap-1">{r.to.map((k) => <DestFlag key={k} k={k} />)}</span>
            <span className="truncate" dir="auto">{r.trip} · {month(r.date)}</span>
          </p>
        </div>
      </figcaption>
    </figure>
  );

  return (
    <section id="reviews" className="pt-16 sm:pt-24">
      <div className={`${wrap} mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10`}>
        <Head tag={rv.tag[lang]} h={rv.h[lang]} l={rv.l[lang]} className="" />
      </div>

      {/* Endless auto-slide (pauses on hover/focus; static row for reduced motion) */}
      <div className="marquee overflow-hidden py-3" dir="ltr">
        <div className="marquee-track flex w-max gap-4" style={{ animationDuration: `${REVIEWS.length * 8}s` }}>
          {REVIEWS.map((r, i) => card(r, i))}
          {REVIEWS.map((r, i) => card(r, i, true))}
        </div>
      </div>

      {REVIEWS_ARE_SAMPLES && (
        <p className={`${wrap} mt-3 text-center text-xs text-ink-soft/70`}>{rv.sample[lang]}</p>
      )}
    </section>
  );
}

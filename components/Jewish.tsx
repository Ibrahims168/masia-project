"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, UtensilsCrossed, Flame, Hotel, Users, BookOpen, Wine, MapPin, TrainFront, ExternalLink, BadgeCheck, Clock, Lightbulb, Landmark } from "lucide-react";
import { t } from "@/lib/i18n";
import { jw } from "@/lib/jewish";
import { PLACES, jwp } from "@/lib/jewish-places";
import { useLang } from "@/lib/lang";

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";
const svcIcons = { kosher: UtensilsCrossed, shabbat: Flame, hotel: Hotel, chabad: Users, guide: BookOpen, holiday: Wine } as const;
const gmaps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
// OpenStreetMap embed (no API key): a small box around the pin.
const osm = (lat: number, lon: number) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.009},${lat - 0.0045},${lon + 0.009},${lat + 0.0045}&layer=mapnik&marker=${lat},${lon}`;

// Magen David drawn as two interlocking triangles.
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
      <path d="M50 8 L88 74 H12 Z" />
      <path d="M50 92 L12 26 H88 Z" />
    </svg>
  );
}

type Tab = "sites" | "food" | "map";
const tabIcons = { food: UtensilsCrossed, map: MapPin, sites: Landmark } as const;

export function Jewish() {
  const { lang } = useLang();
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const [region, setRegion] = useState<"europe" | "asia">("europe");
  const cities = jw.cities.filter((c) => c.r === region);
  const [k, setK] = useState<string>(cities[0].k); // first city open by default
  const [tab, setTab] = useState<Tab>("food");
  const city = jw.cities.find((c) => c.k === k) ?? null;
  const pl = city ? PLACES[city.k] : null;
  const pickRegion = (r: "europe" | "asia") => { setRegion(r); setK(jw.cities.find((c) => c.r === r)!.k); };
  const plan = () => city && window.dispatchEvent(new CustomEvent("tv-prefill", { detail: { msg: `${jw.cta[lang]} · ${city.n[lang]} (${city.c[lang]})`, dest: city.form } }));

  return (
    <section id="jewish" className={`${wrap} pt-16 sm:pt-24`}>
      <div data-reveal className="overflow-hidden rounded-[2rem] border border-sand-300 bg-white shadow-soft">
        {/* Header */}
        <div className="px-5 pt-7 text-center sm:px-8 sm:pt-9 sm:text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand-50"><Star className="h-3.5 w-3.5 text-[#D7B576]" />{jw.tag[lang]}</span>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">{jw.h[lang]}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:mx-0 sm:text-base">{jw.l[lang]}</p>
          <ul className="mt-4 hidden flex-wrap gap-x-5 gap-y-2 sm:flex">
            {jw.services.map((x) => {
              const Icon = svcIcons[x.k as keyof typeof svcIcons];
              return (
                <li key={x.k} title={x.d[lang]} className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
                  <Icon size={14} className="text-gold-deep" />{x.t[lang]}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Region + city picker */}
        <div className="mt-6 flex flex-col items-center gap-3 border-t border-sand-300 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
          <div role="tablist" className="inline-flex shrink-0 rounded-full bg-sand-100 p-1">
            {(["europe", "asia"] as const).map((r) => (
              <button key={r} type="button" role="tab" aria-selected={region === r} onClick={() => pickRegion(r)}
                className={`rounded-full px-4 py-1 text-sm font-bold transition ${region === r ? "bg-[#0B1A3D] text-white" : "text-ink-soft hover:text-ink"}`}>
                {t.regions[r][lang]}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-5 flex max-w-[calc(100%+2.5rem)] gap-2 overflow-x-auto overscroll-x-contain px-5 sm:mx-0 sm:min-w-0 sm:max-w-none sm:flex-1 sm:px-0 sm:[mask-image:linear-gradient(to_left,#000_90%,transparent)] ltr:sm:[mask-image:linear-gradient(to_right,#000_90%,transparent)]">
            {cities.map((c) => {
              const on = c.k === k;
              return (
                <button key={c.k} type="button" onClick={() => setK(c.k)} aria-pressed={on}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold ring-1 transition ${on ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-sand-300 hover:ring-gold"}`}>
                  {c.n[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* City (opens on tap) */}
        {city && pl && (
        <div key={city.k} className="fade-up grid border-t border-sand-300 md:grid-cols-[0.85fr_1.15fr]">
          {/* Photo + essentials */}
          <div className="relative min-h-[220px] md:min-h-[400px]">
            <Image src={`/img/${pl.img}.jpg`} alt={pl.cap} fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051127]/95 via-[#051127]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p className="text-xs font-semibold text-[#D7B576]">{city.c[lang]}</p>
              <h3 className="text-3xl font-extrabold sm:text-4xl">{city.n[lang]}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/80">{city.q[lang]}</p>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-white/10 p-2.5 text-[13px] leading-relaxed ring-1 ring-white/15 backdrop-blur">
                <Lightbulb size={15} className="mt-0.5 shrink-0 text-[#D7B576]" />{city.tip[lang]}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex min-w-0 flex-col p-5 sm:p-6">
            <div role="tablist" className="grid grid-cols-3 gap-1 rounded-xl bg-sand-100 p-1">
              {(Object.keys(tabIcons) as Tab[]).map((x) => {
                const Icon = tabIcons[x];
                const on = tab === x;
                return (
                  <button key={x} type="button" role="tab" aria-selected={on} onClick={() => setTab(x)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-bold transition ${on ? "bg-white text-ink shadow-soft" : "text-ink-soft hover:text-ink"}`}>
                    <Icon size={15} className={on ? "text-gold-deep" : ""} /><span className="truncate">{jwp.tabs[x][lang]}</span>
                  </button>
                );
              })}
            </div>

            <div key={tab} className="fade-up mt-4 flex-1">
              {tab === "sites" && (
                <>
                <ul className="divide-y divide-sand-200">
                  {city.sites.map((x, i) => (
                    <li key={i}>
                      <a href={gmaps(`${x.n.en}, ${city.n.en}`)} target="_blank" rel="noopener noreferrer"
                        className="group flex items-start gap-3 py-3 transition hover:text-gold-deep">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sand-100 text-xs font-bold text-gold-deep">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold leading-snug">{x.n[lang]}</span>
                          <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">{x.d[lang]}</span>
                        </span>
                        <ExternalLink size={14} className="mt-1 shrink-0 text-ink-soft opacity-0 transition group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{jw.note[lang]}</p>
                </>
              )}

              {tab === "food" && (
                <>
                  <ul className="divide-y divide-sand-200">
                    {pl.food.map((f) => (
                      <li key={f.n}>
                        <a href={gmaps(`${f.n}, ${f.area}, ${city.n.en}`)} target="_blank" rel="noopener noreferrer"
                          className="group flex items-start gap-3 py-3">
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <bdi className="font-bold transition group-hover:text-gold-deep">{f.n}</bdi>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${f.tag === "k" ? "bg-[#E3F4EC] text-[#11663F]" : "bg-[#FDF3DC] text-[#8A5A06]"}`}>
                                {f.tag === "k" ? <BadgeCheck size={11} /> : <Clock size={11} />}{jwp.tags[f.tag][lang]}
                              </span>
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">{f.d[lang]}</span>
                          </span>
                          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-ink-soft" dir="ltr"><MapPin size={12} className="text-gold-deep" />{f.area}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{jwp.foodNote[lang]}</p>
                </>
              )}

              {tab === "map" && (
                <div className="flex flex-col gap-3">
                  <div className="relative h-44 overflow-hidden rounded-xl bg-sand-200 ring-1 ring-sand-300">
                    <iframe title={`${jwp.where.en} ${city.n.en}`} src={osm(pl.lat, pl.lon)} loading="lazy" className="absolute inset-0 h-full w-full border-0" />
                  </div>
                  <p className="text-sm leading-relaxed text-ink-soft">{pl.where[lang]}</p>
                  <p className="flex items-start gap-2 text-sm leading-relaxed">
                    <TrainFront size={16} className="mt-0.5 shrink-0 text-gold-deep" /><span><b>{jwp.go[lang]}: </b>{pl.go[lang]}</span>
                  </p>
                  <a href={gmaps(`${pl.lat},${pl.lon}`)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-gold-deep hover:underline">
                    <ExternalLink size={14} />{jwp.maps[lang]}
                  </a>
                </div>
              )}
            </div>

            <a href="#contact" onClick={plan}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-3 text-center text-sm font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:brightness-105">
              {jw.cta[lang]} · {city.n[lang]}<Arrow size={17} className="shrink-0" />
            </a>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

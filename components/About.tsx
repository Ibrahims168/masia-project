"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { ab, TEAM, TEAM_IS_SAMPLE } from "@/lib/team";
import { useLang } from "@/lib/lang";


export function About() {
  const { lang } = useLang();
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      {/* Header: title | story */}
      <div className="grid gap-5 border-b border-sand-300 pb-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14 lg:pb-10">
        <div data-reveal className="text-center sm:text-start">
          <span className="inline-block rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand-50">{ab.tag[lang]}</span>
          <h2 className="mt-3 text-3xl font-extrabold leading-[1.15] sm:text-[2.75rem]">{ab.h[lang]}</h2>
        </div>
        <p data-reveal className="text-center text-base leading-relaxed text-ink-soft sm:text-start sm:text-lg">{ab.l[lang]}</p>
      </div>

      {/* Team */}
      <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:mt-10">
        {TEAM.map((m, i) => {
          const title = m.name || m.role[lang];
          return (
            <li key={i} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#0B1A3D] shadow-soft ring-1 ring-sand-300 transition duration-500 hover:-translate-y-1 hover:shadow-card sm:w-auto">
              <div className="relative aspect-[4/5] overflow-hidden lg:aspect-square">
                {m.photo
                  ? <Image src={`/team/${m.photo}`} alt={title} fill sizes="(max-width:640px) 78vw, 360px" className="object-cover object-[50%_20%] transition duration-700 group-hover:scale-[1.05]" />
                  : <span className="absolute inset-0 grid place-items-center font-brand text-7xl font-light text-[#D7B576]/80">{title.charAt(0)}</span>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051127] via-[#051127]/35 to-transparent" />
                {m.years > 0 && (
                  <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-ink">
                    <span className="text-gold-deep">{m.years}+</span> {ab.years[lang]}
                  </span>
                )}
                {/* Text sits on the photo */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="mb-3 block h-[3px] w-8 rounded-full bg-gradient-to-r from-[#D7B576] to-[#C2935F] transition-all duration-500 group-hover:w-14" />
                  <p className="text-xl font-extrabold leading-tight"><bdi>{title}</bdi></p>
                  {m.name && <p className="mt-0.5 text-sm font-semibold text-[#D7B576]">{m.role[lang]}</p>}
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur">
                    <MapPin size={13} className="shrink-0 text-[#D7B576]" />{m.focus[lang]}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {TEAM_IS_SAMPLE && <p className="mt-2 text-center text-xs text-ink-soft/70">{ab.sample[lang]}</p>}

    </section>
  );
}

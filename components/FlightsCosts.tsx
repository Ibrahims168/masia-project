"use client";
import Image from "next/image";
import { useState } from "react";
import { Plane, Utensils, Car, BedDouble } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import { TRAVEL, tr, FLIGHTS_UPDATED } from "@/lib/travel";
import { useLang } from "@/lib/lang";
import { Head } from "@/components/Sections";

const DIRECT_STYLE = {
  yes: "bg-[#E3F4EC] text-[#11663F] ring-[#11663F]/15",
  seasonal: "bg-[#FDF3DC] text-[#8A5A06] ring-[#8A5A06]/15",
  no: "bg-sand-100 text-ink-soft ring-sand-300",
} as const;

function DirectChip({ k, lang }: { k: string; lang: Lang }) {
  const x = TRAVEL[k];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${DIRECT_STYLE[x.direct]}`}>
      <Plane size={12} className="-scale-x-100 rtl:scale-x-100" />{tr.direct[x.direct][lang]}
      {x.direct !== "yes" && x.via && <span className="font-semibold opacity-70" dir="ltr">· {x.via}</span>}
    </span>
  );
}
const Shekel = ({ v }: { v: string }) => <span dir="ltr" className="whitespace-nowrap">{v === "—" ? "—" : `₪${v}`}</span>;

// Compact version for the destination pop-up
export function TravelBox({ k, lang }: { k: string; lang: Lang }) {
  const x = TRAVEL[k];
  if (!x) return null;
  const costs = [
    { Icon: Utensils, l: tr.meal[lang], v: x.meal },
    { Icon: Car, l: tr.taxi[lang], v: x.taxi },
    { Icon: BedDouble, l: tr.hotel[lang], v: x.hotel },
  ];
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <div className="rounded-2xl border border-sand-300 p-3.5">
        <p className="text-xs font-bold text-ink-soft">{tr.flightTitle[lang]}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DirectChip k={k} lang={lang} />
          <span className="text-sm font-extrabold" ><bdi dir="ltr">~{x.hours}</bdi> {tr.hours[lang]}</span>
        </div>
        <p className="mt-2 text-[13px] text-ink-soft" dir="ltr" style={{ textAlign: lang === "en" ? "left" : "right" }}>{x.airlines.join(" · ")}</p>
      </div>
      <div className="rounded-2xl border border-sand-300 p-3.5">
        <p className="text-xs font-bold text-ink-soft">{tr.costTitle[lang]}</p>
        <ul className="mt-2 space-y-1">
          {costs.map(({ Icon, l, v }) => (
            <li key={l} className="flex items-center justify-between gap-2 text-[13px]">
              <span className="flex items-center gap-1.5 text-ink-soft"><Icon size={14} className="text-gold-deep" />{l}</span>
              <b><Shekel v={v} /></b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FlightsCosts() {
  const { lang } = useLang();
  const [region, setRegion] = useState<"asia" | "europe">("europe");
  const list = t.dest.filter((d) => d.r === region && TRAVEL[d.k]);
  const th = "px-4 py-3 text-start text-[12px] font-bold text-ink-soft";

  return (
    <section id="flights" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Head tag={tr.tag[lang]} h={tr.h[lang]} l={tr.l[lang]} className="" />
        <div role="tablist" className="inline-flex self-start rounded-full border border-sand-300 bg-white p-1 shadow-soft lg:self-auto">
          {(["europe", "asia"] as const).map((r) => (
            <button key={r} type="button" role="tab" aria-selected={region === r} onClick={() => setRegion(r)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition ${region === r ? "bg-[#0B1A3D] text-white shadow-soft" : "text-ink-soft hover:text-ink"}`}>
              {t.regions[r][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: table */}
      <div key={region} data-reveal className="fade-up hidden overflow-hidden rounded-3xl border border-sand-300 bg-white shadow-soft md:block">
        <table className="w-full border-collapse">
          <thead className="bg-sand-50">
            <tr className="border-b border-sand-300">
              <th className={th}>{tr.dest[lang]}</th>
              <th className={th}><span className="flex items-center gap-1.5"><Plane size={14} className="text-gold-deep" />{tr.flight[lang]}</span></th>
              <th className={th}>{tr.airlines[lang]}</th>
              <th className={th}><span className="flex items-center gap-1.5"><Utensils size={14} className="text-gold-deep" />{tr.meal[lang]}</span></th>
              <th className={th}><span className="flex items-center gap-1.5"><Car size={14} className="text-gold-deep" />{tr.taxi[lang]}</span></th>
              <th className={th}><span className="flex items-center gap-1.5"><BedDouble size={14} className="text-gold-deep" />{tr.hotel[lang]}</span></th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => {
              const x = TRAVEL[d.k];
              return (
                <tr key={d.k} className="border-b border-sand-200 transition last:border-0 hover:bg-sand-50/70">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl"><Image src={`/img/${d.img}.jpg`} alt="" fill sizes="40px" className="object-cover" /></span>
                      <span className="font-extrabold">{d.n[lang]}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <DirectChip k={d.k} lang={lang} />
                      <span className="text-sm font-bold" ><bdi dir="ltr">~{x.hours}</bdi> {tr.hours[lang]}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-soft" dir="ltr" style={{ textAlign: lang === "en" ? "left" : "right" }}>{x.airlines.join(" · ")}</td>
                  <td className="px-4 py-3 text-sm font-bold"><Shekel v={x.meal} /></td>
                  <td className="px-4 py-3 text-sm font-bold"><Shekel v={x.taxi} /></td>
                  <td className="px-4 py-3 text-sm font-bold"><Shekel v={x.hotel} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phones: compact cards */}
      <div key={region + "-m"} className="fade-up grid gap-3 md:hidden">
        {list.map((d) => {
          const x = TRAVEL[d.k];
          return (
            <div key={d.k} className="rounded-2xl border border-sand-300 bg-white p-3.5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl"><Image src={`/img/${d.img}.jpg`} alt="" fill sizes="44px" className="object-cover" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">{d.n[lang]}</p>
                  <p className="truncate text-[12px] text-ink-soft" dir="ltr" style={{ textAlign: lang === "en" ? "left" : "right" }}>{x.airlines.join(" · ")}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <DirectChip k={d.k} lang={lang} />
                  <span className="text-[13px] font-bold" ><bdi dir="ltr">~{x.hours}</bdi> {tr.hours[lang]}</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                {[{ Icon: Utensils, l: tr.meal[lang], v: x.meal }, { Icon: Car, l: tr.taxi[lang], v: x.taxi }, { Icon: BedDouble, l: tr.hotel[lang], v: x.hotel }].map(({ Icon, l, v }) => (
                  <div key={l} className="rounded-xl bg-sand-50 px-1.5 py-2">
                    <Icon size={14} className="mx-auto text-gold-deep" />
                    <p className="mt-0.5 truncate text-[10.5px] text-ink-soft">{l}</p>
                    <p className="text-[13px] font-extrabold"><Shekel v={v} /></p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-ink-soft">{tr.note[lang]} {FLIGHTS_UPDATED[lang]}.</p>
    </section>
  );
}

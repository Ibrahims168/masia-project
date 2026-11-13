"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

// IANA time zone for each destination key in t.dest.
export const ZONES: Record<string, string> = {
  bangkok: "Asia/Bangkok", phuket: "Asia/Bangkok", krabi: "Asia/Bangkok",
  japan: "Asia/Tokyo", vietnam: "Asia/Ho_Chi_Minh", maldives: "Indian/Maldives",
  paris: "Europe/Paris", rome: "Europe/Rome", prague: "Europe/Prague", amsterdam: "Europe/Amsterdam", swiss: "Europe/Zurich", santorini: "Europe/Athens",
};

/** Current time, ticking every 30 s. null until mounted (the server can't know the visitor's clock). */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function timeIn(now: Date, zone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { text: `${h}:${m}`, day: +h >= 6 && +h < 18 };
}

// Hours ahead of / behind Israel (handles DST on both sides).
function offsetH(now: Date, zone: string) {
  const at = (z: string) => new Date(now.toLocaleString("en-US", { timeZone: z })).getTime();
  return Math.round(((at(zone) - at("Asia/Jerusalem")) / 36e5) * 2) / 2;
}

// Three clocks per region: the zones our travellers actually fly to.
const CLOCKS: Record<"asia" | "europe", { zone: string; n: { en: string; ar: string; he: string } }[]> = {
  europe: [
    { zone: "Europe/London", n: { en: "London", ar: "لندن", he: "לונדון" } },
    { zone: "Europe/Paris", n: { en: "Central Europe", ar: "وسط أوروبا", he: "מרכז אירופה" } },
    { zone: "Europe/Athens", n: { en: "Santorini", ar: "سانتوريني", he: "סנטוריני" } },
  ],
  asia: [
    { zone: "Asia/Bangkok", n: { en: "Thailand", ar: "تايلاند", he: "תאילנד" } },
    { zone: "Asia/Tokyo", n: { en: "Japan", ar: "اليابان", he: "יפן" } },
    { zone: "Indian/Maldives", n: { en: "Maldives", ar: "المالديف", he: "המלדיביים" } },
  ],
};
const HOURS = { en: "h vs Israel", ar: "س عن إسرائيل", he: "שע׳ מישראל" };
const SAME = { en: "Same as Israel", ar: "نفس توقيت إسرائيل", he: "כמו בישראל" };

export function LocalTimes({ region = "europe" }: { region?: "asia" | "europe" }) {
  const { lang } = useLang();
  const now = useNow();
  return (
    <ul key={region} aria-label={t.ltNow[lang]} className="fade-up grid w-full max-w-md grid-cols-3 gap-2 sm:w-auto">
      {CLOCKS[region].map((c) => {
        const tm = now ? timeIn(now, c.zone) : null;
        const Icon = tm && !tm.day ? Moon : Sun;
        const d = now ? offsetH(now, c.zone) : null;
        return (
          <li key={c.zone} className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-soft ring-1 ring-sand-300 sm:min-w-[7.5rem]">
            <p className="flex items-center justify-center gap-1 truncate text-[12px] font-semibold text-ink-soft">
              <Icon size={12} className={tm && !tm.day ? "text-[#5B6FA8]" : "text-gold-deep"} />{c.n[lang]}
            </p>
            <p className="mt-0.5 text-xl font-extrabold tabular-nums leading-none" dir="ltr">{tm ? tm.text : "--:--"}</p>
            <p className="mt-1 truncate text-[11px] font-semibold text-gold-deep">{d == null ? " " : d === 0 ? SAME[lang] : <><bdi dir="ltr">{d > 0 ? "+" : "−"}{Math.abs(d)}</bdi> {HOURS[lang]}</>}</p>
          </li>
        );
      })}
    </ul>
  );
}

"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";

// Dates are kept as local "YYYY-MM-DD" strings, so they compare correctly as plain strings.
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

/** "30 Oct" / "30 أكتوبر" */
export function fmtDate(s: string, lang: Lang) {
  if (!s) return "";
  const d = parse(s);
  return `${d.getDate()} ${t.monthS[d.getMonth()][lang]}`;
}

/** "26 – 30 Oct" when both dates share a month, otherwise "26 Oct – 2 Nov" */
export function fmtRange(start: string, end: string, lang: Lang) {
  if (!end) return fmtDate(start, lang);
  if (start.slice(0, 7) === end.slice(0, 7)) return `${Number(start.slice(8))} – ${fmtDate(end, lang)}`;
  return `${fmtDate(start, lang)} – ${fmtDate(end, lang)}`;
}

// Range picker: first tap sets the start, second tap the end.
export function Calendar({ start, end, lang, onChange, onDone }: {
  start: string;
  end: string;
  lang: Lang;
  onChange: (start: string, end: string) => void;
  onDone: () => void;
}) {
  const today = useMemo(() => iso(new Date()), []);
  const [view, setView] = useState(() => { const b = start ? parse(start) : new Date(); return new Date(b.getFullYear(), b.getMonth(), 1); });
  const [hover, setHover] = useState("");

  const y = view.getFullYear(), m = view.getMonth();
  const lead = new Date(y, m, 1).getDay(); // weeks start on Sunday
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => iso(new Date(y, m, i + 1)))];
  const canPrev = iso(new Date(y, m, 1)) > today.slice(0, 8) + "01";
  const rtl = lang !== "en";
  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  // While choosing the end date, preview the range up to the hovered day.
  const rangeEnd = end || (start && hover > start ? hover : "");
  const picking = start && !end ? "end" : "start";

  function pick(s: string) {
    if (!start || end || s <= start) onChange(s, "");
    else { onChange(start, s); setTimeout(onDone, 280); }
  }

  const chip = (label: string, value: string, on: boolean) => (
    <div className={`rounded-xl border px-3 py-2 transition ${on ? "border-gold bg-sand-50 ring-2 ring-gold/20" : "border-sand-300"}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className={`text-sm font-bold ${value ? "text-ink" : "text-ink-soft/50"}`}>{value ? fmtDate(value, lang) : "—"}</p>
    </div>
  );

  return (
    <div className="w-[19rem] max-w-full" onMouseLeave={() => setHover("")}>
      <div className="grid grid-cols-2 gap-2">
        {chip(t.fStart[lang], start, picking === "start")}
        {chip(t.fEnd[lang], end, picking === "end")}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => setView(new Date(y, m - 1, 1))} disabled={!canPrev} aria-label="Previous month"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-sand-100 disabled:pointer-events-none disabled:opacity-25">
          <Prev size={18} />
        </button>
        <p key={`${y}-${m}`} className="pop-in text-[15px] font-extrabold">{t.monthL[m][lang]} <span className="font-semibold text-ink-soft">{y}</span></p>
        <button type="button" onClick={() => setView(new Date(y, m + 1, 1))} aria-label="Next month"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-sand-100">
          <Next size={18} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-bold text-ink-soft">
        {t.weekdays[lang].map((w, i) => <span key={i} className="py-1">{w}</span>)}
      </div>

      <div key={`${y}-${m}`} className="pop-in grid grid-cols-7 gap-y-1">
        {cells.map((s, i) => {
          if (!s) return <span key={`e${i}`} />;
          const past = s < today;
          const isStart = s === start, isEnd = s === rangeEnd;
          const inRange = !!rangeEnd && s > start && s < rangeEnd;
          const edge = isStart || (isEnd && !!end);
          return (
            <div key={s} className="relative grid place-items-center">
              {/* sand band joining start → end */}
              {inRange && <span className="absolute inset-y-0.5 inset-x-0 bg-sand-100" />}
              {isStart && rangeEnd && <span className="absolute inset-y-0.5 end-0 start-1/2 bg-sand-100" />}
              {isEnd && start && <span className="absolute inset-y-0.5 start-0 end-1/2 bg-sand-100" />}
              <button type="button" disabled={past} onClick={() => pick(s)} onMouseEnter={() => setHover(s)}
                aria-pressed={isStart || s === end}
                className={`relative grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold transition
                  ${edge ? "bg-gradient-to-br from-[#D7B576] to-[#C2935F] font-extrabold text-ink shadow-soft" : isEnd ? "bg-sand-200 text-ink" : ""}
                  ${!edge && !isEnd && !past ? "hover:bg-sand-100" : ""}
                  ${past ? "cursor-not-allowed text-ink-soft/30" : !edge ? "text-ink" : ""}`}>
                {Number(s.slice(8))}
                {s === today && !edge && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sand-300 pt-3">
        <button type="button" onClick={() => onChange("", "")} className="rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-soft transition hover:text-ink">
          {t.calClear[lang]}
        </button>
        <button type="button" onClick={onDone}
          className="rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] px-5 py-2 text-sm font-extrabold text-ink shadow-soft transition hover:brightness-105">
          {t.calDone[lang]}
        </button>
      </div>
    </div>
  );
}

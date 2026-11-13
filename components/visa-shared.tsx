"use client";
import { CheckCircle2, PlaneLanding, MonitorSmartphone, FileText, Ban, CircleHelp, Globe, Ticket } from "lucide-react";
import { t, type Pair } from "@/lib/i18n";

// Shared by the visa check section and the trip quiz.
export type Status = keyof typeof t.visaStatus;
export type Rule = { s: Status; stay?: Pair; note?: Pair };
export type VisaDest = (typeof t.visaDest)[number];

export const STYLE: Record<Status, { chip: string; dot: string; Icon: React.ElementType }> = {
  free:    { chip: "bg-[#E3F4EC] text-[#11663F] ring-[#11663F]/15", dot: "bg-[#22A06B]", Icon: CheckCircle2 },
  arrival: { chip: "bg-[#E2F3F1] text-[#0F6B63] ring-[#0F6B63]/15", dot: "bg-[#2BA89B]", Icon: PlaneLanding },
  voa:     { chip: "bg-[#E6EEF8] text-[#1D5C96] ring-[#1D5C96]/15", dot: "bg-[#3B82C4]", Icon: Ticket },
  evisa:   { chip: "bg-[#FDF3DC] text-[#8A5A06] ring-[#8A5A06]/15", dot: "bg-[#E0A526]", Icon: MonitorSmartphone },
  visa:    { chip: "bg-[#FCEBDD] text-[#9A4B0C] ring-[#9A4B0C]/15", dot: "bg-[#E07A26]", Icon: FileText },
  no:      { chip: "bg-[#FDE6E6] text-[#B42318] ring-[#B42318]/15", dot: "bg-[#D92D20]", Icon: Ban },
  check:   { chip: "bg-sand-100 text-ink-soft ring-ink/10", dot: "bg-ink-soft", Icon: CircleHelp },
};

export const ruleFor = (d: VisaDest, pp: string): Rule => (d.rules as Record<string, Rule>)[pp] ?? { s: "check" };

export function Flag({ k, size = 20 }: { k: string; size?: number }) {
  if (k === "other") return <Globe size={size} className="shrink-0 text-gold-deep" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/flags/${k}.svg`} alt="" width={size * 1.4} height={size} style={{ width: size * 1.4, height: size }} className="shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/10" />;
}

// Remembered passport, kept in sync between the quiz and the visa section.
export const PASSPORT_KEY = "tv-passport";
export function savePassport(k: string) {
  try { localStorage.setItem(PASSPORT_KEY, k); } catch {}
  window.dispatchEvent(new CustomEvent("tv-passport", { detail: k }));
}

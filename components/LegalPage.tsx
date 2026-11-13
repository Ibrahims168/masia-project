"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LEGAL, legalUi, type DocKey } from "@/lib/legal";
import { BUSINESS } from "@/lib/config";
import { useLang } from "@/lib/lang";
import { Wordmark } from "@/components/Top";

export function LegalPage({ doc }: { doc: DocKey }) {
  const { lang } = useLang();
  const v = lang === "en" ? "en" : "he"; // Hebrew is the binding text; Arabic visitors see it too
  const d = LEGAL[doc][v];
  const todo = legalUi.todo[lang];
  const fill = (s: string) => s
    .replace(/\{name\}/g, BUSINESS.legalName || "Masia")
    .replace(/\{reg\}/g, BUSINESS.regNumber || todo)
    .replace(/\{address\}/g, BUSINESS.address || todo)
    .replace(/\{email\}/g, BUSINESS.email || todo)
    .replace(/\{phone\}/g, BUSINESS.phone || todo)
    .replace(/\{contact\}/g, BUSINESS.a11yContact || todo);
  const Back = lang === "en" ? ArrowLeft : ArrowRight;
  const others = (Object.keys(LEGAL) as DocKey[]).filter((k) => k !== doc);

  return (
    <main dir={v === "en" ? "ltr" : "rtl"} lang={v} className="min-h-screen">
      <header className="bg-gradient-to-br from-[#16295A] via-[#0B1A3D] to-[#051127] text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <a href="/" aria-label="Masia" dir="ltr"><Wordmark className="text-[28px]" sizes="90px" /></a>
          <a href="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/20">
            <Back size={16} />{legalUi.back[lang]}
          </a>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-5xl">{d.title}</h1>
          <p className="mt-2 text-sm text-white/60">{legalUi.updated[lang]}: {BUSINESS.updated}</p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-lg leading-relaxed">{fill(d.intro)}</p>
        {d.sections.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-xl font-extrabold">{s.h}</h2>
            {s.p.length > 1
              ? <ul className="mt-3 list-disc space-y-2 ps-5 leading-relaxed text-ink-soft marker:text-gold-deep">{s.p.map((x) => <li key={x}>{fill(x)}</li>)}</ul>
              : <p className="mt-3 leading-relaxed text-ink-soft">{fill(s.p[0])}</p>}
          </section>
        ))}

        <nav className="mt-12 flex flex-wrap gap-2 border-t border-sand-300 pt-6">
          {others.map((k) => (
            <a key={k} href={`/${k}`} className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm font-bold transition hover:border-gold">{legalUi.links[k][lang]}</a>
          ))}
        </nav>
      </article>
    </main>
  );
}

"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import type { Lang } from "./i18n";

export const LANG_COOKIE = "tv";
const isLang = (v: unknown): v is Lang => v === "en" || v === "ar" || v === "he";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "he", setLang: () => {} });
export const useLang = () => useContext(Ctx);

// `initial` comes from the server (cookie), so the first paint is already in the saved language:
// no Hebrew flash before switching on refresh.
export function LangProvider({ children, initial = "he", fromCookie = false }: { children: ReactNode; initial?: Lang; fromCookie?: boolean }) {
  const [lang, setLang] = useState<Lang>(initial);
  const first = useRef(true);
  useEffect(() => {
    // One-time migration for visitors who saved a language before the cookie existed.
    if (fromCookie) return;
    try {
      const v = localStorage.getItem(LANG_COOKIE);
      if (isLang(v) && v !== initial) setLang(v);
    } catch {}
  }, [fromCookie, initial]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    // Don't persist the default on mount: it could overwrite a saved choice before it is read.
    if (first.current && !fromCookie) { first.current = false; return; }
    first.current = false;
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem(LANG_COOKIE, lang); } catch {}
  }, [lang, fromCookie]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

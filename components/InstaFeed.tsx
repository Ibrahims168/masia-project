"use client";
import Image from "next/image";
import { useState } from "react";
import { Instagram, Heart, MessageCircle, Send, Bookmark, MapPin, BadgeCheck } from "lucide-react";
import { p } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { SOCIAL } from "@/lib/config";

// Photos live in public/img/insta/. Add or swap posts here (portrait photos look best).
const POSTS = [
  { img: "phiphi-boats", place: p("Phi Phi Islands, Thailand", "جزر في في، تايلاند", "איי פי פי, תאילנד"),
    cap: p("Longtail boats waiting for the next island hop 🌴", "قوارب الذيل الطويل بانتظار الجولة القادمة بين الجزر 🌴", "סירות הזנב הארוך מחכות לקפיצה הבאה בין האיים 🌴") },
  { img: "phuket-street", place: p("Phuket, Thailand", "بوكيت، تايلاند", "פוקט, תאילנד"),
    cap: p("Golden hour, arches and good food. Every corner is a story ✨", "الساعة الذهبية وأقواس وأكل رائع. كل زاوية حكاية ✨", "שעת זהב, קשתות ואוכל טוב. כל פינה היא סיפור ✨") },
  { img: "songthaew", place: p("Patong, Phuket", "باتونغ، بوكيت", "פטונג, פוקט"),
    cap: p("Hop on a red songthaew and let the sunset do the rest 🧡", "اركب السونغثاو الأحمر ودع الغروب يكمل الباقي 🧡", "עולים על סונגטאו אדום ונותנים לשקיעה לעשות את השאר 🧡") },
];

const tx = {
  tag: p("Instagram", "إنستغرام", "אינסטגרם"),
  h: p("Follow the journey", "تابعوا الرحلة معنا", "עקבו אחרי המסע"),
  l: p("Real photos from our trips, new destinations and travel tips. Straight from the road.", "صور حقيقية من رحلاتنا، وجهات جديدة ونصائح سفر. مباشرة من الطريق.", "תמונות אמיתיות מהטיולים שלנו, יעדים חדשים וטיפים לטיול. ישר מהדרך."),
  follow: p("Follow us", "تابعونا", "עקבו אחרינו"),
};

const IG_GRADIENT = "bg-[linear-gradient(45deg,#F58529,#DD2A7B_45%,#8134AF_75%,#515BD4)]";

export function InstaFeed() {
  const { lang } = useLang();
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [burst, setBurst] = useState<number | null>(null);
  const url = SOCIAL.instagram;
  if (!url) return null;
  const handle = url.replace(/\/+$/, "").split("/").pop()!;
  const like = (i: number, on?: boolean) => {
    setLiked((s) => ({ ...s, [i]: on ?? !s[i] }));
    if (on !== false) { setBurst(i); setTimeout(() => setBurst((b) => (b === i ? null : b)), 700); }
  };

  return (
    <section id="instagram" className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      {/* Header: title | profile card */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div data-reveal className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-start">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white ${IG_GRADIENT}`}><Instagram size={14} />{tx.tag[lang]}</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{tx.h[lang]}</h2>
          <p className="mt-3 text-lg text-ink-soft">{tx.l[lang]}</p>
        </div>
        <a data-reveal href={url} target="_blank" rel="noopener noreferrer"
          className="group flex max-w-full items-center gap-2.5 self-center rounded-full bg-white py-2 pe-2 ps-2 shadow-soft ring-1 ring-sand-300 transition hover:-translate-y-0.5 hover:shadow-card sm:gap-3 sm:self-start lg:self-end">
          <span className={`rounded-full p-[2.5px] ${IG_GRADIENT}`}>
            <span className="block rounded-full bg-white p-[2px]">
              <Image src="/brand/masia-logo.jpg" alt="Masia" width={44} height={44} className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11" />
            </span>
          </span>
          <span dir="ltr" className="flex min-w-0 items-center gap-1 text-[14px] font-bold text-ink sm:text-[15px]"><span className="truncate">@{handle}</span><BadgeCheck size={15} className="hidden shrink-0 text-[#3897F0] sm:block" /></span>
          <span className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-extrabold sm:px-4 sm:text-sm text-white transition group-hover:brightness-110 ${IG_GRADIENT}`}>
            <Instagram size={16} />{tx.follow[lang]}
          </span>
        </a>
      </div>

      {/* Posts in Instagram frames: swipe on phones, fanned grid on desktop */}
      <ul data-reveal className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-4">
        {POSTS.map((post, i) => {
          const on = !!liked[i];
          const tilt = ["md:-rotate-2 md:translate-y-4", "md:-translate-y-2", "md:rotate-2 md:translate-y-4"][i % 3];
          return (
            <li key={post.img} className={`w-[80%] shrink-0 snap-start sm:w-[55%] md:w-auto md:transition md:duration-500 md:hover:z-10 md:hover:rotate-0 md:hover:translate-y-0 md:hover:scale-[1.03] ${tilt}`}>
              <article dir="ltr" className="overflow-hidden rounded-[1.6rem] bg-white text-ink shadow-card ring-1 ring-sand-300">
                {/* post header */}
                <div className="flex items-center gap-2.5 px-3.5 py-3">
                  <span className={`shrink-0 rounded-full p-[2px] ${IG_GRADIENT}`}>
                    <span className="block rounded-full bg-white p-[1.5px]">
                      <Image src="/brand/masia-logo.jpg" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-full object-cover" />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="flex items-center gap-1 text-[13px] font-bold">{handle}<BadgeCheck size={13} className="text-[#3897F0]" /></p>
                    <p dir={lang === "en" ? "ltr" : "rtl"} className="flex items-center gap-1 truncate text-[11.5px] text-ink-soft"><MapPin size={11} className="shrink-0" />{post.place[lang]}</p>
                  </div>
                  <span aria-hidden className="text-lg font-black leading-none tracking-tighter text-ink-soft">···</span>
                </div>
                {/* photo: double-tap to like, like the real app */}
                <div className="relative aspect-[4/5] cursor-pointer select-none overflow-hidden bg-sand-100" onDoubleClick={() => like(i, true)}>
                  <Image src={`/img/insta/${post.img}.jpg`} alt={post.place[lang]} fill sizes="(max-width:640px) 80vw, (max-width:768px) 55vw, 360px" className="object-cover transition duration-700 hover:scale-[1.04]" />
                  {burst === i && (
                    <Heart aria-hidden size={96} className="insta-burst absolute left-1/2 top-1/2 fill-white text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]" />
                  )}
                </div>
                {/* actions */}
                <div className="flex items-center gap-3.5 px-3.5 pt-3">
                  <button type="button" onClick={() => like(i)} aria-pressed={on} aria-label="Like" className="transition active:scale-90">
                    <Heart size={23} className={`transition ${on ? "fill-[#ED4956] text-[#ED4956] insta-pop" : "hover:text-ink-soft"}`} />
                  </button>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Comment on Instagram" className="transition hover:text-ink-soft"><MessageCircle size={23} className="-scale-x-100" /></a>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Share" className="transition hover:text-ink-soft"><Send size={22} /></a>
                  <Bookmark size={22} aria-hidden className="ms-auto" />
                </div>
                {/* caption */}
                <p dir={lang === "en" ? "ltr" : "rtl"} className="line-clamp-2 px-3.5 pb-4 pt-2 text-[13.5px] leading-snug">
                  <bdi className="font-bold">{handle}</bdi> {post.cap[lang]}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

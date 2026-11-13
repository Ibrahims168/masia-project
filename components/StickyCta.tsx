"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/lang";
import { WHATSAPP } from "@/lib/config";

// Phone-only bar that keeps "Plan my trip" one tap away: appears after the hero,
// hides again once the contact form or footer is on screen.
export function StickyCta() {
  const { lang } = useLang();
  const [show, setShow] = useState(false);
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    let contactVisible = false;
    const update = () => setShow(window.scrollY > 640 && !contactVisible);
    const targets = [document.getElementById("contact"), document.querySelector("footer")];
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      contactVisible = seen.size > 0;
      update();
    }, { rootMargin: "0px 0px 200px 0px" });
    targets.forEach((el) => el && io.observe(el));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { io.disconnect(); window.removeEventListener("scroll", update); };
  }, []);

  return (
    <div aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 transition duration-300 sm:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"}`}>
      <div className="flex gap-2 rounded-2xl border border-white/60 bg-white/85 p-2 shadow-card backdrop-blur-md">
        <a href="#contact" tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D7B576] to-[#C2935F] py-3 text-[15px] font-extrabold text-ink active:scale-[.98]">
          {t.plan[lang]}<Arrow size={17} />
        </a>
        {WHATSAPP && (
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" aria-label="WhatsApp" tabIndex={show ? 0 : -1}
            className="grid w-12 place-items-center rounded-xl bg-[#25D366] text-white active:scale-[.98]">
            <MessageCircle size={22} />
          </a>
        )}
      </div>
    </div>
  );
}

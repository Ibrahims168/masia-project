"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";

export type Opt = { value: string; label: string; icon?: React.ReactNode };

// Styled replacement for <select>: same keyboard behaviour, but the menu matches the site.
export function Dropdown({ value, onChange, options, name, label, align = "start", className = "", rootClassName = "", children }: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  name?: string;
  label?: string;
  align?: "start" | "end";
  className?: string;
  rootClassName?: string;
  children: (selected: Opt | undefined, open: boolean) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const sel = options.findIndex((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => { setActive(Math.max(sel, 0)); setOpen(true); };
  const pick = (i: number) => { onChange(options[i].value); setOpen(false); };

  function onKey(e: React.KeyboardEvent) {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); show(); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, last)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(last); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") setOpen(false);
  }

  return (
    <div ref={root} className={`relative h-full ${rootClassName}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={id} aria-label={label}
        onClick={() => (open ? setOpen(false) : show())} onKeyDown={onKey} className={className}>
        {children(options[sel], open)}
      </button>
      {open && (
        <ul id={id} ref={list} role="listbox"
          className={`pop-in absolute top-full z-40 mt-2 max-h-72 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-auto overscroll-contain rounded-2xl border border-sand-300 bg-white p-1.5 shadow-card ${align === "end" ? "end-0" : "start-0"}`}>
          {options.map((o, i) => (
            <li key={o.value} role="option" aria-selected={i === sel}
              onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(i)}
              className={`flex cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm transition-colors ${i === active ? "bg-sand-100" : ""} ${i === sel ? "font-bold text-gold-deep" : "text-ink"}`}>
              <span className="flex items-center gap-2.5">{o.icon}{o.label}</span>
              <Check size={16} className={`shrink-0 ${i === sel ? "" : "invisible"}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

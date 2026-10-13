import PageHero from "../components/common/PageHero";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---- Edit these in one place ---- */
const WHATSAPP_NUMBER = "966538821388";
const DETAIL_BASE = ""; // e.g. "/services" to show a "Read more" link to /services/<slug>. Empty = hidden until those pages exist.
const STICKY_BASE = 112; // px from the top where the first card sticks (clears the floating navbar)
const STICKY_STEP = 22; // px each next card sticks lower, so the stack shows a peek of the cards behind

const SERVICES = [
  {
    slug: "electrical-items-supply",
    group: "electrical",
    icon: "bolt",
    title: "Electrical Items Supply",
    text: "We provide everything from basic wiring accessories to industrial-grade components, ensuring reliable power distribution and efficient electrical installations.",
    tags: ["Wiring accessories", "Industrial-grade components", "Power distribution"],
  },
  {
    slug: "adhesives-bonding-solutions",
    group: "construction",
    icon: "drop",
    title: "Adhesives & Bonding Solutions (Bison Brand)",
    text: "We include Bison Kit, PolyMax High Tack, PolyMax Crystal, and other universal adhesives with strong bonding, moisture resistance, and multi-surface compatibility.",
    tags: ["Bison Kit", "PolyMax High Tack", "PolyMax Crystal", "Universal adhesives"],
  },
  {
    slug: "fencing-solutions",
    group: "construction",
    icon: "fence",
    title: "Fencing Solutions",
    text: "We provide chain-link fencing, PVC fencing, galvanized fencing, security mesh, and HCIS/Aramco-standard fencing solutions for airports, railways, oil & gas, and industrial facilities.",
    tags: ["Chain-link", "PVC", "Galvanized", "Security mesh", "HCIS / Aramco standard"],
  },
  {
    slug: "forklift-spare-parts-services",
    group: "industrial",
    icon: "cog",
    title: "Forklift Spare Parts & Services",
    text: "A complete range of forklift spare parts including electrical components, cooling systems, mast parts, engines, hydraulics, brakes, fuel systems, transmissions, and more.",
    tags: ["Electrical", "Cooling", "Mast parts", "Engines", "Hydraulics", "Brakes", "Fuel systems", "Transmissions"],
  },
  {
    slug: "welding-machines-accessories",
    group: "industrial",
    icon: "flame",
    title: "Welding Machines & Accessories",
    text: "We supply MIG, TIG, and ARC welding machines, plasma cutters, PPE, helmets, gloves, fume extractors, torches, gas management tools, and consumables. Brands include ESAB, Victor and more.",
    tags: ["MIG", "TIG", "ARC", "Plasma cutters", "PPE", "Consumables"],
  },
  {
    slug: "cable-management-structural-support-systems",
    group: "electrical",
    icon: "cable",
    title: "Cable Management & Structural Support Systems",
    text: "Our catalogue includes cable trays, ladders, trunking supports, C-channel strut systems, expanded metals, plaster beads, block reinforcement, steel lintels, drywall profiles, and garbage/linen chutes.",
    tags: ["Cable trays", "Ladders", "C-channel strut", "Expanded metals", "Steel lintels", "Drywall profiles"],
  },
  {
    slug: "pipe-hangers-support-systems",
    group: "industrial",
    icon: "pipe",
    title: "Pipe Hangers & Support Systems",
    text: "We offer pipe clamps, U-bolts, riser clamps, adjustable clamps, and heavy-duty supports for commercial and industrial piping systems. Brands include VOLTAIC, BOLLANT, ITCC, ETON, LIQUATITE and more.",
    tags: ["Pipe clamps", "U-bolts", "Riser clamps", "Adjustable clamps"],
  },
];

const FILTERS = [
  { id: "all", label: "All services" },
  { id: "electrical", label: "Electrical & cabling" },
  { id: "construction", label: "Construction" },
  { id: "industrial", label: "Industrial" },
];

const HEADING = [
  { t: "Our" },
  { t: "services,", g: true },
  { t: "supplied" },
  { t: "under" },
  { t: "one" },
  { t: "roof" },
];

/* ---------- helpers ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wa = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

function Ic({ name, size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "bolt" && <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />}
      {name === "drop" && <path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />}
      {name === "fence" && <path d="M5 4v16M12 4v16M19 4v16M3 9h18M3 15h18" />}
      {name === "cog" && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </>
      )}
      {name === "flame" && <path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />}
      {name === "cable" && <path d="M4 8h16v3H4zM4 14h16v3H4zM7 11v3M17 11v3" />}
      {name === "pipe" && <path d="M3 9h6v6H3zM15 9h6v6h-6zM9 11h6v2H9z" />}
      {name === "arrow" && <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  );
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const f = (e) => setReduce(e.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return reduce;
}

export default function ServicesPage() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const headRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const visible = useMemo(
    () =>
      SERVICES.map((s, i) => ({ ...s, n: i + 1 })).filter(
        (s) => filter === "all" || s.group === filter
      ),
    [filter]
  );

  /* Scroll-driven animation.
     --h  (heading)  how far the heading has been read: words light up one by one
     --e  (per card) how far the card has come up into view: it rises and fades in
     --c  (per card) how far the next card has covered it: it shrinks and darkens, like a stack */
  useEffect(() => {
    const items = () => itemRefs.current.slice(0, visible.length).filter(Boolean);

    const resetAll = () => {
      headRef.current?.style.setProperty("--h", "1");
      items().forEach((li) => {
        li.style.setProperty("--e", "1");
        li.style.setProperty("--c", "0");
      });
    };

    if (reduce) {
      resetAll();
      return;
    }

    const stackMq = window.matchMedia("(min-width: 768px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      /* heading */
      if (headRef.current) {
        const r = headRef.current.getBoundingClientRect();
        const h = clamp((vh * 0.9 - r.top) / (vh * 0.5), 0, 1);
        headRef.current.style.setProperty("--h", h.toFixed(3));
      }

      /* cards */
      const list = items();
      list.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const e = clamp((vh - r.top - 80) / (vh * 0.5), 0, 1);
        li.style.setProperty("--e", e.toFixed(3));

        let c = 0;
        const next = list[i + 1];
        if (stackMq.matches && next) {
          const stuck = STICKY_BASE + i * STICKY_STEP;
          const nextStuck = STICKY_BASE + (i + 1) * STICKY_STEP;
          const bottom = stuck + li.offsetHeight;
          const travel = bottom - nextStuck;
          if (travel > 0) c = clamp((bottom - next.getBoundingClientRect().top) / travel, 0, 1);
        }
        li.style.setProperty("--c", c.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, visible]);

  /* soft light that follows the pointer inside a card */
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const groupLabel = (id) => FILTERS.find((f) => f.id === id)?.label ?? "";

  return (
    <>
      <PageHero
        eyebrow="What we supply"
        title="Services"
        description="We provide trusted industrial and construction materials for projects across the Kingdom, with sourcing, pricing, and support tailored to your requirements."
      />

      <section
        id="services"
        aria-labelledby="services-title"
        className="bg-slate-50 px-6 pb-24 pt-20 font-sans text-primary sm:px-8 lg:pb-32 lg:pt-28"
      >
        <style>{`
          .sp-word { opacity: clamp(0.18, calc(var(--h, 1) * 8 - var(--i)), 1); }
          .sp-lead { opacity: clamp(0.18, calc(var(--h, 1) * 8 - 6), 1); }
          .sp-card { transform-origin: 50% 0; transform: translate3d(0, calc((1 - var(--e, 1)) * 70px), 0) scale(calc(1 - var(--c, 0) * 0.06)); opacity: calc(0.15 + var(--e, 1) * 0.85); will-change: transform, opacity; }
          .sp-cover { opacity: calc(var(--c, 0) * 0.5); }
          .sp-num { transform: translate3d(0, calc((1 - var(--e, 1)) * -36px), 0); }
          @media (prefers-reduced-motion: reduce) {
            .sp-word, .sp-lead, .sp-card, .sp-cover, .sp-num { opacity: 1; transform: none; }
            .sp-cover { opacity: 0; }
          }
        `}</style>

        <div className="mx-auto max-w-6xl">
          {/* ---------- Heading: words light up as you scroll ---------- */}
          <div ref={headRef} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2
                id="services-title"
                className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
              >
                {HEADING.map((w, i) => (
                  <span
                    key={w.t}
                    className={`sp-word inline-block ${
                      w.g ? "bg-brand-gradient bg-clip-text text-transparent" : ""
                    }`}
                    style={{ "--i": i }}
                  >
                    {w.t}
                    {i < HEADING.length - 1 && "\u00A0"}
                  </span>
                ))}
              </h2>
              <p className="sp-lead mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                From electrical items to forklift parts, we supply the materials
                and equipment your projects depend on.
              </p>
            </div>

            <div role="group" aria-label="Filter services" className="flex flex-wrap gap-2.5">
              {FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      on
                        ? "border-transparent bg-brand-gradient text-primary shadow-md shadow-[#00E599]/25"
                        : "border-slate-300 bg-white hover:-translate-y-0.5 hover:border-primary"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p aria-live="polite" className="mt-4 text-sm tabular-nums text-slate-500">
            Showing {visible.length} of {SERVICES.length} services
          </p>

          {/* ---------- Stacking cards ---------- */}
          <ul ref={listRef} className="mt-10">
            {visible.map((s, i) => {
              const dark = i % 2 === 1;
              return (
                <li
                  key={`${filter}-${s.slug}`}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className="mb-8 md:sticky md:top-[var(--st)] md:mb-[14vh] last:mb-0 md:last:mb-0"
                  style={{ "--st": `${STICKY_BASE + i * STICKY_STEP}px`, zIndex: i + 1 }}
                >
                  <article
                    onPointerMove={onMove}
                    className={`sp-card group relative overflow-hidden rounded-3xl border p-6 shadow-xl sm:p-8 md:min-h-[340px] md:p-10 ${
                      dark
                        ? "border-white/10 bg-primary text-white shadow-primary/25"
                        : "border-slate-200 bg-white text-primary shadow-primary/10"
                    }`}
                  >
                    {/* pointer-following light */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(0,229,153,0.14), transparent 70%)",
                      }}
                    />
                    {/* gradient edge */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />

                    <div className="relative grid gap-8 md:grid-cols-[0.7fr_2fr] md:gap-12">
                      {/* number + icon */}
                      <div className="flex items-center justify-between gap-4 md:flex-col md:items-start md:justify-start md:gap-8">
                        <span
                          aria-hidden="true"
                          className="sp-num bg-brand-gradient bg-clip-text text-6xl font-semibold leading-none text-transparent md:text-8xl"
                        >
                          {String(s.n).padStart(2, "0")}
                        </span>
                        <span
                          className={`grid h-14 w-14 place-items-center rounded-2xl md:h-16 md:w-16 ${
                            dark ? "bg-brand-gradient text-primary" : "bg-primary text-[#00E599]"
                          }`}
                        >
                          <Ic name={s.icon} size={30} />
                        </span>
                      </div>

                      {/* text */}
                      <div>
                        <p
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            dark ? "text-white/60" : "text-slate-500"
                          }`}
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#00E599]" />
                          {groupLabel(s.group)}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">
                          {s.title}
                        </h3>
                        <p
                          className={`mt-4 max-w-2xl text-base leading-relaxed ${
                            dark ? "text-white/75" : "text-slate-600"
                          }`}
                        >
                          {s.text}
                        </p>

                        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title} includes`}>
                          {s.tags.map((t) => (
                            <li
                              key={t}
                              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                                dark
                                  ? "border-white/15 bg-white/5 text-white/80"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {t}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                          <a
                            href={wa(`Hello Aral Desert Trading, I need a quotation for: ${s.title}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                              dark
                                ? "bg-brand-gradient text-primary hover:brightness-110 focus-visible:outline-white"
                                : "bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary"
                            }`}
                          >
                            Get a quote
                            <span className="sr-only"> for {s.title}</span>
                            <span className="rtl:-scale-x-100">
                              <Ic name="arrow" size={18} />
                            </span>
                          </a>
                          {DETAIL_BASE && (
                            <Link
                              to={`${DETAIL_BASE}/${s.slug}`}
                              className={`text-sm font-medium underline-offset-4 hover:underline ${
                                dark ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-primary"
                              }`}
                            >
                              Read more
                              <span className="sr-only"> about {s.title}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* darkens as the next card slides over this one */}
                    <div aria-hidden="true" className="sp-cover pointer-events-none absolute inset-0 rounded-3xl bg-primary" />
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
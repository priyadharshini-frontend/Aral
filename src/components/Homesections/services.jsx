import { useEffect, useRef, useState } from "react";

/* ---- Edit these in one place ----
   SUPPLY: each item can have an optional photo:  image: "/images/about/welding.jpg"
   STATS: add only real numbers, e.g. [{ value: "10+", label: "Years in business" }]. Empty = hidden. */
const WHATSAPP_NUMBER = "966538821388";
const AUTOPLAY_MS = 4500;
const STATS = [];

const SUPPLY = [
  { name: "Safety materials", text: "Helmets, gloves, eyewear, footwear and protective gear for site teams." },
  { name: "Electrical materials", text: "Cables, switches, lighting and fittings for installation and maintenance." },
  { name: "Welding materials", text: "Welding machines, electrodes, torches and accessories." },
  { name: "Plumbing materials", text: "Pipes, fittings, fixtures and accessories for plumbing works." },
  { name: "Power and hand tools", text: "Drills, grinders, saws, wrenches, pliers and measuring tools." },
  { name: "Building materials", text: "General construction materials for civil and finishing works." },
  { name: "Industrial valves", text: "Gate, ball and check valves for plant and pipeline use." },
  { name: "Stationery and office items", text: "Office supplies and stationery for your site and head office." },
];

/* ---------- small helpers ---------- */
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

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/* counts up to the number in "10+", "500+" and so on */
function CountUp({ value, run, reduce }) {
  const m = /^(\d+)(.*)$/.exec(String(value));
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!m || !run) return;
    const to = Number(m[1]);
    if (reduce) return setN(to);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, value]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return value;
  return (
    <>
      {n}
      {m[2]}
    </>
  );
}

export default function Services() {
  const [sectionRef, seen] = useInView();
  const reduce = useReducedMotion();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [picked, setPicked] = useState(false); // stop auto-advance once the visitor chooses
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const tabRefs = useRef([]);

  const n = SUPPLY.length;
  const item = SUPPLY[active];
  const autoplay = seen && !picked && !reduce;

  const select = (i) => {
    setActive(i);
    setPicked(true);
  };

  const onTabKeyDown = (e) => {
    let i = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (active + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (active - 1 + n) % n;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else return;
    e.preventDefault();
    select(i);
    tabRefs.current[i]?.focus();
  };

  /* tilt + spotlight following the mouse */
  const onMove = (e) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    card.style.transition = "transform 80ms linear";
    card.style.transform = `rotateX(${((0.5 - py) * 8).toFixed(2)}deg) rotateY(${((px - 0.5) * 10).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 500ms ease";
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  const pauseProps = {
    onPointerEnter: () => setPaused(true),
    onPointerLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  /* scroll-reveal helper: props for a staggered fade-up */
  const rv = (delay = 0, extra = "") => ({
    className: `transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } ${extra}`,
    style: { transitionDelay: `${delay}ms` },
  });

  const quoteHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Aral Desert Trading, I need a quotation for: ${item.name}`
  )}`;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="overflow-hidden bg-white px-6 py-20 font-sans text-primary sm:px-8 lg:py-28"
    >
      <style>{`
        @keyframes ab-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes ab-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes ab-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ab-orb { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(26px, -20px); } }
        @media (prefers-reduced-motion: reduce) { .ab-anim { animation: none !important; } }
      `}</style>

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        {/* ---------- Visual: interactive card ---------- */}
        <div {...rv(0, "relative pb-8")}>
          <div
            ref={wrapRef}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ perspective: 1100 }}
            {...pauseProps}
          >
            <div
              ref={cardRef}
              className="relative min-h-[460px] overflow-hidden rounded-3xl bg-primary text-white shadow-2xl shadow-primary/30 sm:min-h-[520px]"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {/* background layers */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div
                aria-hidden="true"
                className="ab-anim absolute -top-16 h-64 w-64 rounded-full bg-brand-gradient opacity-30 blur-3xl ltr:-right-10 rtl:-left-10"
                style={{ animation: "ab-orb 9s ease-in-out infinite" }}
              />
              <div
                aria-hidden="true"
                className="ab-anim absolute -bottom-20 h-72 w-72 rounded-full bg-brand-gradient opacity-15 blur-3xl ltr:-left-16 rtl:-right-16"
                style={{ animation: "ab-orb 12s ease-in-out infinite reverse" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(0,229,153,0.22), transparent 60%)",
                }}
              />

              {/* content, replays its entrance every time the item changes */}
              <div
                role="tabpanel"
                id="about-panel"
                aria-labelledby={`about-tab-${active}`}
                className="relative flex min-h-[inherit] flex-col justify-between p-7 sm:p-9"
              >
                <div className="flex items-center justify-between text-sm tabular-nums text-white/60">
                  <span>What we supply</span>
                  <span>
                    {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                </div>

                <div
                  key={active}
                  className="ab-anim"
                  style={{ animation: reduce ? "none" : "ab-in 0.55s ease both" }}
                >
                  <span className="bg-brand-gradient bg-clip-text text-6xl font-semibold text-transparent sm:text-7xl">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                    {item.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-white/75">
                    {item.text}
                  </p>
                </div>

                <a
                  href={quoteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center self-start rounded-full bg-brand-gradient px-7 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
                >
                  Get a quote for this
                </a>
              </div>
            </div>
          </div>

          {/* floating credibility badge */}
          <div
            className="ab-anim absolute -bottom-0 start-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-primary shadow-xl shadow-primary/15 ring-1 ring-slate-200"
            style={{ animation: "ab-float 5s ease-in-out infinite" }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#051329" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-semibold">Aramco Vendor</span>
              <span className="block text-xs text-slate-500">
                ISO 9001 and UL &amp; 9Com certified products
              </span>
            </span>
          </div>
        </div>

        {/* ---------- Text ---------- */}
        <div>
          <h2
            id="about-title"
            {...rv(100, "text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]")}
          >
            Your partner for industrial and{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              construction supplies
            </span>
          </h2>

          <p {...rv(200, "mt-5 text-base leading-relaxed text-slate-600 sm:text-lg")}>
            Aral Desert Trading Est. is a Saudi supplier of industrial,
            electrical and construction materials. We help contractors,
            factories and facilities find the right products from trusted
            brands, and deliver them where the work happens.
          </p>
          <p {...rv(280, "mt-4 text-base leading-relaxed text-slate-600 sm:text-lg")}>
            Our team focuses on clear communication, accurate quotations and
            reliable supply, so your projects keep moving.
          </p>

          {/* interactive supply tabs */}
          <div {...rv(360, "mt-8")}>
            <h3 className="font-semibold">Explore what we supply</h3>
            <div
              role="tablist"
              aria-label="What we supply"
              onKeyDown={onTabKeyDown}
              className="mt-4 flex flex-wrap gap-2.5"
              {...pauseProps}
            >
              {SUPPLY.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.name}
                    ref={(el) => (tabRefs.current[i] = el)}
                    id={`about-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="about-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    className={`relative overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      on
                        ? "border-transparent bg-brand-gradient text-primary shadow-md shadow-[#00E599]/25"
                        : "border-slate-300 bg-white text-primary hover:-translate-y-0.5 hover:border-primary"
                    }`}
                  >
                    {s.name}
                    {on && autoplay && (
                      <span
                        key={active}
                        aria-hidden="true"
                        onAnimationEnd={() => setActive((a) => (a + 1) % n)}
                        className="ab-anim absolute inset-x-0 bottom-0 h-1 origin-left bg-primary/35"
                        style={{
                          animation: `ab-progress ${AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {STATS.length > 0 && (
            <dl
              {...rv(440, "mt-10 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-3")}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-sm text-slate-500">{s.label}</dt>
                  <dd className="mt-1 bg-brand-gradient bg-clip-text text-3xl font-semibold text-transparent">
                    <CountUp value={s.value} run={seen} reduce={reduce} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div {...rv(520, "mt-10 flex flex-wrap gap-3")}>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-sm:w-full"
            >
              Contact our team
            </a>
            <a
              href="#products"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-8 py-3 font-medium transition hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-sm:w-full"
            >
              Browse products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
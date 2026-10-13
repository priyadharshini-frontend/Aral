import { useEffect, useRef, useState } from "react";

/* ---- Edit these in one place ---- */
const WHATSAPP_NUMBER = "966538821388";

const PORTFOLIO = [
  "Safety equipment",
  "Electrical supplies",
  "Welding tools",
  "Plumbing materials",
  "Power tools",
  "Hand tools",
  "Stationery",
  "Coffee supplies",
  "Building materials",
  "Industrial valves",
  "Specialized fabrication components",
];

/* heading words: g = gradient colour */
const HEADING = [
  { t: "Your" },
  { t: "Vision," },
  { t: "Our", g: true },
  { t: "Expertise", g: true },
];

/* ---------- helpers ---------- */
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

function useInView(threshold = 0.2) {
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

export default function About() {
  const [sectionRef, seen] = useInView();
  const reduce = useReducedMotion();
  const on = seen || reduce; // show everything straight away if motion is reduced

  const wrapRef = useRef(null);
  const cardRef = useRef(null);

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

  /* fade-up helper */
  const rv = (delay = 0, extra = "") => ({
    className: `${reduce ? "" : "transition duration-700 ease-out"} ${
      on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } ${extra}`,
    style: { transitionDelay: `${delay}ms` },
  });

  const quoteHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Aral Desert Trading, I would like a quotation."
  )}`;

  /* shield drawing */
  const draw = (delay, dur = 1.1) => ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    style: {
      transition: reduce ? "none" : `stroke-dashoffset ${dur}s ease ${delay}s`,
    },
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="overflow-hidden bg-white px-6 py-20 font-sans text-primary sm:px-8 lg:py-28"
    >
      <style>{`
        @keyframes ab-ping { 0% { transform: scale(0.7); opacity: 0.5; } 100% { transform: scale(1.7); opacity: 0; } }
        @keyframes ab-orb { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(26px, -20px); } }
        @keyframes ab-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @media (prefers-reduced-motion: reduce) { .ab-anim { animation: none !important; } }
      `}</style>

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* ---------- Quality card ---------- */}
        <div {...rv(150, "order-2 lg:order-1")}>
          <div
            ref={wrapRef}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ perspective: 1100 }}
          >
            <div
              ref={cardRef}
              className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-primary p-8 text-center text-white shadow-2xl shadow-primary/30 sm:min-h-[500px] sm:p-10"
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
                    "radial-gradient(420px circle at var(--mx, 50%) var(--my, 35%), rgba(0,229,153,0.22), transparent 60%)",
                }}
              />

              {/* shield that draws itself */}
              <div className="relative grid h-40 w-40 place-items-center">
                {[0, 1.4].map((d) => (
                  <span
                    key={d}
                    aria-hidden="true"
                    className="ab-anim absolute inset-4 rounded-full border border-[#00E599]/50"
                    style={{
                      animation: on ? `ab-ping 2.8s ease-out ${d + 1.4}s infinite` : "none",
                      opacity: 0,
                    }}
                  />
                ))}
                <svg
                  viewBox="0 0 64 64"
                  width="132"
                  height="132"
                  fill="none"
                  aria-hidden="true"
                  className="relative"
                >
                  <defs>
                    <linearGradient id="ab-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00E599" />
                      <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M32 4l24 8v18c0 15-10 26-24 30C18 56 8 45 8 30V12z"
                    fill="url(#ab-grad)"
                    fillOpacity={on ? 0.14 : 0}
                    style={{ transition: reduce ? "none" : "fill-opacity 0.8s ease 1.1s" }}
                  />
                  <path
                    d="M32 4l24 8v18c0 15-10 26-24 30C18 56 8 45 8 30V12z"
                    stroke="url(#ab-grad)"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    {...draw(0.3, 1.3)}
                  />
                  <path
                    d="M21 32.5l8 8 15-17"
                    stroke="#fff"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...draw(1.3, 0.7)}
                  />
                </svg>
              </div>

              <div {...rv(900, "relative mt-6")}>
                <h3 className="text-3xl font-semibold sm:text-4xl">
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    Best Quality
                  </span>
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-white/80">
                  We have completed and achieved the Certificate of Quality
                  Management System.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Text ---------- */}
        <div className="order-1 lg:order-2">
          <p {...rv(0, "flex items-center gap-3 text-base font-medium text-slate-600 sm:text-lg")}>
            <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-brand-gradient" />
            Welcome to Aral Desert Trading
          </p>

          <h2
            id="about-title"
            className="mt-4 text-4xl font-medium leading-[1.15] sm:text-5xl lg:text-[3.4rem]"
          >
            {HEADING.map((w, i) => (
              <span key={w.t} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
                <span
                  className={`inline-block ${w.g ? "bg-brand-gradient bg-clip-text text-transparent" : ""}`}
                  style={{
                    transform: on ? "translateY(0)" : "translateY(115%)",
                    transition: reduce
                      ? "none"
                      : `transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${150 + i * 110}ms`,
                  }}
                >
                  {w.t}
                </span>
                {i < HEADING.length - 1 && "\u00A0"}
              </span>
            ))}
          </h2>

          <p {...rv(450, "mt-6 text-base leading-relaxed text-slate-600 sm:text-lg")}>
            Aral Desert Trading (ADT) is a trusted and diversified supplier
            based in the Kingdom of Saudi Arabia, serving commercial,
            construction, and industrial sectors with a comprehensive range of
            high-quality materials.
          </p>

          <h3 {...rv(550, "mt-8 font-semibold")}>Our portfolio includes</h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {PORTFOLIO.map((p, i) => (
              <li key={p} {...rv(620 + i * 70)}>
                <span className="group inline-flex cursor-default items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-gradient hover:shadow-md hover:shadow-[#00E599]/25">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-brand-gradient transition-colors group-hover:bg-primary"
                  />
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <div {...rv(620 + PORTFOLIO.length * 70, "mt-10 flex flex-wrap gap-3")}>
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-sm:w-full"
            >
              Get a quote on WhatsApp
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
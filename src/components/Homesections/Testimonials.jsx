import { useEffect, useRef, useState } from "react";

/* ================================================================
   PLACEHOLDER CONTENT: the names, quotes and numbers below are samples.
   Replace them with the client's real testimonials and real figures
   (with permission) before launch. Do not publish invented reviews.
   ================================================================ */
const STATS = [
  { value: 500, suffix: "K", label: "Completed Projects" },
  { value: 2000, suffix: "", label: "Running Projects", format: true },
  { value: 110, suffix: "+", label: "Expert Team" },
  { value: 50, suffix: "+", label: "Winning Awards" },
];

const FEATURED = {
  quote:
    "They took our scattered ideas and shipped a product our customers actually enjoy using. Every milestone landed on the date they promised, and the team stayed available long after launch.",
  name: "Ananya Raghavan",
  role: "Founder, Kaveri Retail",
};

const REVIEWS = [
  {
    quote:
      "Clear communication from day one. We always knew what was done, what was next, and what it would cost.",
    name: "Rohan Mehta",
    role: "Operations Head, Brightline Logistics",
    rating: 5,
  },
  {
    quote:
      "Our site loads twice as fast and enquiries have gone up every month since the redesign.",
    name: "Priya Subramanian",
    role: "Marketing Lead, Orchid Health",
    rating: 5,
  },
  {
    quote:
      "The designers listened before they drew anything. The final result looks like us, only sharper.",
    name: "Daniel Ortiz",
    role: "Co-founder, Fieldnote",
    rating: 5,
  },
  {
    quote:
      "Reliable, honest and quick to fix things. We have moved all our ongoing work to this team.",
    name: "Meera Iyer",
    role: "Director, Sunrise Academy",
    rating: 4,
  },
];

const SPEED_A = "46s"; // time for one full loop (higher = slower)
const REPEAT = 2; // times the list repeats inside each half; raise if a gap shows on very wide screens

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

function useInView(threshold = 0.25) {
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

function useCountUp(target, start, reduce) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduce) return setN(target);
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, reduce]);
  return n;
}

/* ---------- small pieces ---------- */
function Stat({ value, suffix, label, format, start, reduce }) {
  const n = useCountUp(value, start, reduce);
  return (
    <div className="flex flex-col gap-1 px-6 py-8 sm:px-8">
      <p className="tm-shimmer text-4xl font-bold sm:text-5xl">
        {format ? n.toLocaleString("en-US") : n}
        {suffix}
      </p>
      <p className="text-sm font-medium text-white/70">{label}</p>
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i <= rating ? "text-brand-from" : "text-primary/15"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, dark }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        dark ? "bg-brand-gradient text-primary" : "bg-primary text-white"
      }`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* One scrolling row. The second copy is hidden from screen readers and the tab key. */
function MarqueeRow({ items, speed, reverse = false, label, hidden = false }) {
  const list = (duplicate) => (
    <ul
      className={`${duplicate ? "tm-dup" : ""} flex shrink-0`}
      aria-hidden={duplicate ? "true" : undefined}
      aria-label={duplicate ? undefined : label}
    >
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        items.map((rv, i) => (
          <li key={`${r}-${i}`} className="shrink-0 pe-6">
            <figure className="flex h-full w-[300px] flex-col justify-between rounded-3xl border border-primary/10 bg-white p-6 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:border-[#00E599]/60 hover:shadow-xl hover:shadow-primary/10 sm:w-[360px]">
              <div>
                <Stars rating={rv.rating} />
                <blockquote className="mt-4 text-[15px] leading-relaxed text-primary/80">
                  {rv.quote}
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={rv.name} />
                <div>
                  <p className="text-sm font-semibold text-primary">{rv.name}</p>
                  <p className="text-xs text-primary/60">{rv.role}</p>
                </div>
              </figcaption>
            </figure>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div
      aria-hidden={hidden ? "true" : undefined}
      className="tm-row overflow-hidden py-3"
      style={{
        "--tm-speed": speed,
        maskImage: "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
      }}
    >
      <div
        dir="ltr"
        className="tm-track flex w-max"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const [headRef, headSeen] = useInView(0.2);
  const [statsRef, statsSeen] = useInView(0.3);
  const on = headSeen || reduce;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="overflow-hidden bg-slate-50 py-20 font-sans text-primary sm:py-28"
    >
      <style>{`
        @keyframes tm-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes tm-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes tm-shine { 0% { transform: translateX(-120%); } 55%, 100% { transform: translateX(120%); } }
        @keyframes tm-shimmer { from { background-position: 0% 50%; } to { background-position: 300% 50%; } }
        @keyframes tm-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-4deg); } }
        @keyframes tm-orb { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -20px) scale(1.15); } }
        @keyframes tm-live { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,153,.5); } 50% { box-shadow: 0 0 0 8px rgba(0,229,153,0); } }

        .tm-track { animation: tm-scroll var(--tm-speed, 46s) linear infinite; will-change: transform; }
        .tm-row:hover .tm-track, .tm-row:focus-within .tm-track { animation-play-state: paused; }
        .tm-flow { background-image: linear-gradient(120deg, #00E599, #2DD4BF, #00E599, #2DD4BF); background-size: 250% 250%; animation: tm-flow 9s ease-in-out infinite; }
        .tm-shine { animation: tm-shine 6s ease-in-out infinite; }
        .tm-shimmer {
          background-image: linear-gradient(90deg, #00E599, #2DD4BF, #ffffff, #2DD4BF, #00E599);
          background-size: 300% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: tm-shimmer 6s linear infinite;
        }
        .tm-bob { animation: tm-bob 5s ease-in-out infinite; }
        .tm-orb { animation: tm-orb 12s ease-in-out infinite; }
        .tm-live { animation: tm-live 2.2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .tm-track, .tm-flow, .tm-shine, .tm-shimmer, .tm-bob, .tm-orb, .tm-live { animation: none !important; }
          .tm-row { overflow-x: auto; }
          .tm-dup { display: none; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* ---------- Heading ---------- */}
        <div
          ref={headRef}
          className={`max-w-2xl ${reduce ? "" : "transition duration-700 ease-out"} ${
            on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="tm-live h-2 w-2 rounded-full bg-brand-gradient" />
            Customer feedback
          </p>
          <h2
            id="testimonials-title"
            className="mt-4 text-3xl font-bold leading-tight sm:text-5xl"
          >
            What Our Happy{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Customers</span>{" "}
            Say
          </h2>
        </div>

        {/* ---------- Stats band ---------- */}
        <div
          ref={statsRef}
          className="relative isolate mt-12 grid grid-cols-2 overflow-hidden rounded-3xl bg-primary lg:grid-cols-4 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-white/10 lg:[&>*:nth-child(n+3)]:border-t-0 [&>*:nth-child(even)]:border-s [&>*:nth-child(even)]:border-white/10 lg:[&>*:nth-child(n+2)]:border-s lg:[&>*:nth-child(n+2)]:border-white/10"
        >
          <div
            aria-hidden="true"
            className="tm-orb absolute -top-24 -z-10 h-64 w-64 rounded-full bg-brand-gradient opacity-25 blur-3xl ltr:left-1/4 rtl:right-1/4"
          />
          <div
            aria-hidden="true"
            className="tm-orb absolute -bottom-24 -z-10 h-56 w-56 rounded-full bg-brand-gradient opacity-15 blur-3xl ltr:right-1/5 rtl:left-1/5"
            style={{ animationDelay: "-6s" }}
          />
          {STATS.map((s) => (
            <Stat key={s.label} {...s} start={statsSeen} reduce={reduce} />
          ))}
        </div>

        {/* ---------- Featured review ---------- */}
        <figure className="tm-flow relative mt-6 flex flex-col justify-between overflow-hidden rounded-3xl p-8 text-primary sm:p-10 lg:flex-row lg:items-center lg:gap-12">
          {/* light sweeping across the card */}
          <span
            aria-hidden="true"
            className="tm-shine pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />
          <svg
            viewBox="0 0 32 32"
            className="tm-bob relative h-14 w-14 shrink-0 text-primary/25"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M13 6C7.5 8 4 12.5 4 18.5V26h9v-9H8.6c.2-3 2-5.2 4.4-6.3L13 6zm15 0c-5.5 2-9 6.5-9 12.5V26h9v-9h-4.4c.2-3 2-5.2 4.4-6.3L28 6z" />
          </svg>
          <blockquote className="relative mt-6 flex-1 text-lg font-medium leading-relaxed sm:text-2xl lg:mt-0">
            {FEATURED.quote}
          </blockquote>
          <figcaption className="relative mt-8 flex shrink-0 items-center gap-3 lg:mt-0">
            <Avatar name={FEATURED.name} />
            <div>
              <p className="font-semibold">{FEATURED.name}</p>
              <p className="text-sm text-primary/70">{FEATURED.role}</p>
            </div>
          </figcaption>
        </figure>
      </div>

      {/* ---------- Review row ---------- */}
      <div className="mt-8">
        <MarqueeRow items={REVIEWS} speed={SPEED_A} label="Customer reviews" />
      </div>
    </section>
  );
}
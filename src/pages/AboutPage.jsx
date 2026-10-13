import PageHero from "../components/common/PageHero";
import { useEffect, useRef, useState } from "react";

/* Put your photos in /public/images/about/ (or change these paths).
   If a file is missing, a navy placeholder shows instead of a broken image. */
const IMAGES = {
  warehouse:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  products:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
  supply:
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
  achievements:
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
};

const achievements = [
  { value: 20, suffix: "+", label: "Years of Industry Experience" },
  { value: 1500, suffix: "+", label: "Products Across Multiple Categories", format: true },
  { value: 100, suffix: "+", label: "Satisfied Clients Across the Kingdom" },
];

const categories = [
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
  "Fabrication components",
];

/* ---------- scroll helpers ---------- */

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Fade + slide up when scrolled into view */
function Reveal({ children, delay = 0, y = 32, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translate3d(0, ${y}px, 0)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Moves its content slower/faster than the page while scrolling.
   The outer box is measured; only the inner box is transformed. */
function Parallax({ speed = 0.08, className = "", innerClassName = "", children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i || reducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = o.getBoundingClientRect();
      const offset = r.top + r.height / 2 - window.innerHeight / 2;
      i.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={`will-change-transform ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/* Image that uncovers from top to bottom while it settles from a slight zoom */
function ImageReveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`overflow-hidden transition-[clip-path] duration-1000 ease-out motion-reduce:transition-none ${className}`}
      style={{
        clipPath: inView ? "inset(0 0 0 0 round 1.5rem)" : "inset(0 0 100% 0 round 1.5rem)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="h-full w-full transition-transform duration-[1400ms] ease-out motion-reduce:transition-none"
        style={{ transform: inView ? "scale(1)" : "scale(1.15)", transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}

function SmartImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-linear-to-br from-primary to-[#0d3057] ${className}`}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ---------- count-up stat ---------- */

function Achievement({ value, suffix, label, format, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) {
      setCount(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  return (
    <div className="px-2 py-8 sm:px-10 sm:py-4">
      <p className="bg-brand-gradient bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
        {format ? count.toLocaleString("en-US") : count}
        {suffix}
      </p>
      <p className="mt-4 max-w-56 text-sm font-medium leading-relaxed text-white/80">
        {label}
      </p>
    </div>
  );
}

/* ---------- page ---------- */

export default function AboutPage() {
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <>
      <PageHero
        eyebrow="Our company"
        title="About Us"
        description="Aral Desert Trading Est. supports contractors, maintenance teams, and industrial buyers with dependable supply, fast response times, and quality-driven service."
      />

      {/* About */}
      <section id="about" className="overflow-hidden bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-brand-gradient" />
                About
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-5xl">
                Welcome to Aral Desert Trading
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-3 text-lg font-semibold text-primary/60">
                Your Vision, Our Expertise
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 max-w-xl leading-relaxed text-primary/80">
                Aral Desert Trading (ADT) is a trusted and diversified supplier based in the
                Kingdom of Saudi Arabia, serving commercial, construction, and industrial
                sectors with a comprehensive range of high-quality materials. Our portfolio
                includes safety equipment, electrical supplies, welding tools, plumbing
                materials, power tools, hand tools, stationery, coffee supplies, building
                materials, industrial valves, and specialized fabrication components.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex max-w-xl items-start gap-4 rounded-2xl border border-primary/10 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold text-primary">Best Quality</h3>
                  <p className="mt-1 text-sm leading-relaxed text-primary/70">
                    We have completed and achieved the Certificate of Quality Management System.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Image collage with parallax */}
          <div className="relative mx-auto h-[420px] w-full max-w-xl sm:h-[540px]">
            <Parallax speed={0.06} className="absolute right-0 top-0 h-[78%] w-[80%]" innerClassName="h-full w-full">
              <ImageReveal className="h-full w-full">
                <SmartImage src={IMAGES.warehouse} alt="Aral Desert Trading warehouse" className="h-full w-full" />
              </ImageReveal>
            </Parallax>

            <Parallax speed={-0.07} className="absolute bottom-0 left-0 h-[48%] w-[56%]" innerClassName="h-full w-full">
              <ImageReveal delay={250} className="h-full w-full bg-white p-2 sm:p-3">
                <SmartImage
                  src={IMAGES.products}
                  alt="Tools and industrial supplies"
                  className="h-full w-full rounded-2xl"
                />
              </ImageReveal>
            </Parallax>

            <div className="absolute bottom-6 right-0 sm:bottom-10">
              <Reveal delay={600} y={20}>
                <div className="rounded-2xl bg-primary px-5 py-4 text-white shadow-xl">
                  <p className="bg-brand-gradient bg-clip-text text-2xl font-bold text-transparent">
                    Trusted supplier
                  </p>
                  <p className="text-xs text-white/70">across the Kingdom of Saudi Arabia</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* What we supply */}
      <section className="overflow-hidden bg-[#f3f6fa] py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <ImageReveal className="aspect-[4/5] w-full">
              <SmartImage src={IMAGES.supply} alt="Range of supplies" className="h-full w-full" />
            </ImageReveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
                What we supply
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-3 max-w-lg text-primary/70">
                Eleven categories for commercial, construction and industrial buyers.
              </p>
            </Reveal>
            <ul className="mt-8 flex flex-wrap gap-3">
              {categories.map((c, i) => (
                <li key={c}>
                  <Reveal delay={150 + i * 60} y={16}>
                    <span className="flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-medium text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
                      {c}
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="relative overflow-hidden bg-primary py-20 sm:py-28">
        <Parallax
          speed={0.12}
          className="absolute inset-0"
          innerClassName="absolute -inset-y-[20%] inset-x-0"
        >
          <SmartImage src={IMAGES.achievements} alt="" className="h-full w-full opacity-40" />
        </Parallax>
        <div className="absolute inset-0 bg-primary/75" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-brand-gradient" />
              Achievements
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">Our Achievements</h2>
          </Reveal>

          <div
            ref={statsRef}
            className="mt-12 grid divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {achievements.map((a, i) => (
              <Reveal key={a.label} delay={i * 150}>
                <Achievement {...a} start={statsInView} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
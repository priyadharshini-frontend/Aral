import { useEffect, useRef, useState } from "react";

/* ---- Edit these in one place ---- */
const WHATSAPP_NUMBER = "966538821388";
const PHONE_DISPLAY = "+966 53 882 1388";
const EMAIL = "sales1@adtrdco.com";

const STEPS = [
  {
    icon: "send",
    title: "Send your list",
    text: "Share item names, sizes and quantities by WhatsApp, phone or email. A photo is enough if you do not have the exact name.",
  },
  {
    icon: "quote",
    title: "Get your quotation",
    text: "Our team checks availability and sends you prices for your items.",
  },
  {
    icon: "confirm",
    title: "Confirm your order",
    text: "Approve the quotation, then confirm quantities, delivery location and payment details with our team.",
  },
  {
    icon: "truck",
    title: "Receive your delivery",
    text: "We arrange delivery to your site or warehouse across Saudi Arabia.",
  },
];

const CIRCLE = 48; // timeline circle size in px (h-12 w-12)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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

/* fades its children up the first time they scroll into view */
function Reveal({ children, delay = 0, className = "", reduce }) {
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
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const on = seen || reduce;
  return (
    <div
      ref={ref}
      className={`${reduce ? "" : "transition duration-700 ease-out"} ${
        on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* line icons that draw themselves each time they mount */
function StepIcon({ name, size = 64 }) {
  const p = { pathLength: 1, className: "ps-draw" };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "send" && <path {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />}
      {name === "quote" && (
        <>
          <path {...p} d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
          <path {...p} d="M14 3v5h5M9 13h6M9 17h6" />
        </>
      )}
      {name === "confirm" && (
        <>
          <circle {...p} cx="12" cy="12" r="9" />
          <path {...p} d="M8 12.5l3 3 5-6" />
        </>
      )}
      {name === "truck" && (
        <g className="ps-drive">
          <path {...p} d="M3 6.5h11v9.5H3z" />
          <path {...p} d="M14 10h4l3 3v3h-7" />
          <circle {...p} cx="7" cy="17.5" r="1.8" />
          <circle {...p} cx="17" cy="17.5" r="1.8" />
        </g>
      )}
    </svg>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const olRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [channel, setChannel] = useState("whatsapp");

  const n = STEPS.length;

  /* scroll-driven timeline: fills the line and finds the current step */
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const ol = olRef.current;
      const last = itemRefs.current[n - 1];
      if (!ol || !last) return;

      const lineY = window.innerHeight * 0.5; // the "reading line" in the middle of the screen
      const top = ol.getBoundingClientRect().top;
      const lineLen = last.offsetTop; // first circle centre to last circle centre

      ol.style.setProperty("--line-h", `${lineLen}px`);
      ol.style.setProperty("--fill", `${clamp(lineY - top - CIRCLE / 2, 0, lineLen)}px`);

      let idx = 0;
      itemRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top + CIRCLE / 2 <= lineY) idx = i;
      });
      setActive((prev) => (prev === idx ? prev : idx));
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
  }, [n]);

  const goTo = (i) => {
    const el = itemRefs.current[i];
    if (!el) return;
    setActive(i);
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  /* ways to send the list (step 1 picker) */
  const CHANNELS = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      cta: "Open WhatsApp",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello Aral Desert Trading, I would like to send my list for a quotation."
      )}`,
      external: true,
    },
    { id: "call", label: "Call", cta: PHONE_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}` },
    {
      id: "email",
      label: "Email",
      cta: EMAIL,
      href: `mailto:${EMAIL}?subject=${encodeURIComponent("Request for quotation")}`,
    },
  ];
  const ch = CHANNELS.find((c) => c.id === channel);
  const whatsappHref = CHANNELS[0].href;

  const step = STEPS[active];

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="bg-white px-6 py-20 font-sans text-primary sm:px-8 lg:py-28"
    >
      <style>{`
        @keyframes ps-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ps-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes ps-pulse { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(1.7); opacity: 0; } }
        @keyframes ps-drive { from { transform: translateX(-5px); } to { transform: translateX(0); } }
        @keyframes ps-orb { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-22px, 16px); } }
        .ps-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ps-draw 0.9s ease 0.1s forwards; }
        .ps-drive { animation: ps-drive 0.9s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .ps-draw { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
          .ps-anim, .ps-drive { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <Reveal reduce={reduce} className="max-w-2xl">
          <h2
            id="process-title"
            className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
          >
            From your list to your site in{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              four simple steps
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            No accounts, no long forms. Tell us what you need and we handle the
            rest. Scroll through the steps, or tap one to jump to it.
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* ---------- Sticky panel: follows the active step ---------- */}
          <div className="hidden lg:sticky lg:top-24 lg:block">
            <div className="relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-9 text-white shadow-2xl shadow-primary/25">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div
                aria-hidden="true"
                className="ps-anim absolute -top-20 -z-10 h-72 w-72 rounded-full bg-brand-gradient opacity-25 blur-3xl ltr:-right-16 rtl:-left-16"
                style={{ animation: "ps-orb 10s ease-in-out infinite" }}
              />

              <p className="text-sm tabular-nums text-white/60">
                Step {active + 1} of {n}
              </p>

              <div key={active} className="ps-anim" style={{ animation: "ps-in 0.5s ease both" }}>
                <span className="relative grid h-28 w-28 place-items-center rounded-3xl bg-brand-gradient text-primary">
                  <StepIcon name={step.icon} size={64} />
                </span>
                <h3 className="mt-6 text-3xl font-semibold leading-tight">{step.title}</h3>
              </div>

              {/* progress segments double as step buttons */}
              <div className="flex gap-2">
                {STEPS.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to step ${i + 1}: ${s.title}`}
                    aria-current={i === active ? "step" : undefined}
                    className="group flex-1 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="block h-1.5 overflow-hidden rounded-full bg-white/15">
                      <span
                        className="block h-full rounded-full bg-brand-gradient transition-all duration-500"
                        style={{ width: i <= active ? "100%" : "0%" }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Timeline ---------- */}
          <ol ref={olRef} className="relative">
            {/* track + scroll-driven fill */}
            <div
              aria-hidden="true"
              className="absolute top-6 w-0.5 rounded-full bg-slate-200 ltr:left-[23px] rtl:right-[23px]"
              style={{ height: "var(--line-h, 0px)" }}
            >
              <div className="w-full rounded-full bg-brand-gradient" style={{ height: "var(--fill, 0px)" }} />
            </div>

            {STEPS.map((s, i) => {
              const done = i < active;
              const current = i === active;
              return (
                <li
                  key={s.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  aria-current={current ? "step" : undefined}
                  className="relative pb-8 last:pb-0 ltr:pl-16 rtl:pr-16"
                >
                  {/* circle */}
                  <span
                    className={`absolute top-0 grid h-12 w-12 place-items-center rounded-full text-lg font-semibold transition-all duration-500 ltr:left-0 rtl:right-0 ${
                      done || current
                        ? "bg-brand-gradient text-primary shadow-lg shadow-[#00E599]/30"
                        : "border-2 border-slate-300 bg-white text-slate-500"
                    } ${current ? "scale-110" : ""}`}
                  >
                    {current && !reduce && (
                      <span
                        aria-hidden="true"
                        className="ps-anim absolute inset-0 rounded-full bg-[#00E599]"
                        style={{ animation: "ps-pulse 2s ease-out infinite" }}
                      />
                    )}
                    <span className="relative">
                      {done ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                  </span>

                  <Reveal reduce={reduce} delay={i * 60}>
                    <article
                      onClick={() => goTo(i)}
                      className={`cursor-pointer rounded-2xl border p-6 transition duration-500 ${
                        current
                          ? "border-[#00E599] bg-white shadow-xl shadow-primary/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      } ${!current && !done ? "opacity-70 hover:opacity-100" : ""}`}
                    >
                      <h3 className="text-lg font-semibold">
                        <button
                          type="button"
                          className="text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          {s.title}
                        </button>
                      </h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{s.text}</p>

                      {/* step 1: choose how to send the list */}
                      {i === 0 && (
                        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
                          <div role="radiogroup" aria-label="How do you want to send your list?" className="flex flex-wrap gap-2">
                            {CHANNELS.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                role="radio"
                                aria-checked={channel === c.id}
                                onClick={() => setChannel(c.id)}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                                  channel === c.id
                                    ? "border-transparent bg-brand-gradient text-primary"
                                    : "border-slate-300 bg-white hover:border-primary"
                                }`}
                              >
                                {c.label}
                              </button>
                            ))}
                          </div>
                          <a
                            href={ch.href}
                            {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            dir="auto"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                          >
                            {ch.cta}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---------- Closing call-to-action ---------- */}
        <Reveal reduce={reduce} className="mt-16">
          <div className="relative isolate overflow-hidden rounded-3xl bg-primary px-6 py-10 text-white sm:px-10 sm:py-12">
            <div
              aria-hidden="true"
              className="ps-anim absolute -top-24 -z-10 h-64 w-64 rounded-full bg-brand-gradient opacity-25 blur-3xl ltr:-right-10 rtl:-left-10"
              style={{ animation: "ps-orb 9s ease-in-out infinite" }}
            />
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className="text-2xl font-semibold sm:text-3xl">
                  Ready to start? Send your list now.
                </h3>
                <p className="mt-2 text-white/75">
                  Or call us on{" "}
                  <a
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    dir="ltr"
                    className="font-semibold text-white underline underline-offset-4"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
              >
                Get a quote on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
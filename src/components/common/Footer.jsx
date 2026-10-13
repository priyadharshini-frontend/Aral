import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ---- Edit these in one place ----
   Leave CR_NUMBER or VAT_NUMBER empty ("") to hide them. */
const WHATSAPP_NUMBER = "966538821388";
const PHONE_DISPLAY = "+966 53 882 1388";
const PHONE_ALT_NUMBER = "966532444200";
const PHONE_DISPLAY_ALT = "+966 53 244 4200";
const EMAIL = "sales1@adtrdco.com";
const EMAIL_ALT = "info@adtrdco.com";
const ADDRESS = "9th Street, Al Souq, Dammam – 32241, KSA";
const CR_NUMBER = "";
const VAT_NUMBER = "";

const QUICK_LINKS = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Services", to: "/services", icon: "grid" },
  { label: "About", to: "/about", icon: "info" },
  { label: "Contact", to: "/contact", icon: "mail" },
];

const CATEGORIES = [
  "Industrial Fasteners",
  "Power Tools",
  "Hand Tools",
  "Welding Equipment",
  "Safety Materials",
  "Industrial Valves",
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- icons ---------- */
function Ic({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "pin" && (
        <>
          <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
      {name === "chat" && <path d="M4 5h16v11H9l-5 4V5z" />}
      {name === "phone" && (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
      )}
      {name === "mail" && (
        <>
          <path d="M3 6h18v12H3z" />
          <path d="M3 7l9 6 9-6" />
        </>
      )}
      {name === "home" && <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />}
      {name === "grid" && <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />}
      {name === "info" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8v.01" />
        </>
      )}
      {name === "chevron" && <path d="M9 6l6 6-6 6" />}
      {name === "up" && <path d="M12 19V5M5 12l7-7 7 7" />}
      {name === "upright" && <path d="M7 17L17 7M8 7h9v9" />}
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

function FooterHeading({ children }) {
  return (
    <h2 className="ft-heading relative w-fit pb-3 font-semibold">{children}</h2>
  );
}

/* Back to top: the ring fills as the whole page is scrolled */
function BackToTop({ reduce }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
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
  }, []);

  const C = 2 * Math.PI * 22;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
      aria-label="Back to top"
      className="ft-ic group relative grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white transition hover:bg-brand-gradient hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2.5" />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="#00E599"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
        />
      </svg>
      <span className="relative transition-transform duration-300 group-hover:-translate-y-0.5">
        <Ic name="up" size={20} />
      </span>
    </button>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();
  const footerRef = useRef(null);
  const ctaBtnRef = useRef(null);
  const [seen, setSeen] = useState(false);

  const legal = [
    CR_NUMBER && `CR No. ${CR_NUMBER}`,
    VAT_NUMBER && `VAT No. ${VAT_NUMBER}`,
  ].filter(Boolean);

  /* reveal when the footer first comes into view */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scroll progress through the footer drives the big wordmark fill (0 to 1) */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    if (reduce) {
      el.style.setProperty("--fp", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / r.height, 0, 1);
      el.style.setProperty("--fp", p.toFixed(4));
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
  }, [reduce]);

  /* magnetic call-to-action button */
  const onMagnetMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
  };
  const onMagnetLeave = () => {
    if (ctaBtnRef.current) ctaBtnRef.current.style.transform = "translate(0, 0)";
  };

  /* fade-up helper */
  const rv = (delay = 0, extra = "") => ({
    className: `${reduce ? "" : "transition duration-700 ease-out"} ${
      seen || reduce ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } ${extra}`,
    style: { transitionDelay: `${delay}ms` },
  });

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Aral Desert Trading, I would like a quotation."
  )}`;

  const contactItems = [
    { icon: "pin", label: "Address", value: ADDRESS },
    { icon: "chat", label: "WhatsApp", value: PHONE_DISPLAY, href: `https://wa.me/${WHATSAPP_NUMBER}`, external: true, ltr: true },
    { icon: "phone", label: "Call", value: PHONE_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}`, ltr: true },
    { icon: "phone", label: "Call", value: PHONE_DISPLAY_ALT, href: `tel:+${PHONE_ALT_NUMBER}`, ltr: true },
    { icon: "mail", label: "Sales", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: "mail", label: "General", value: EMAIL_ALT, href: `mailto:${EMAIL_ALT}` },
  ];

  const linkClass =
    "ft-link inline-flex items-center gap-2 text-[0.95rem] text-white/70 transition-colors hover:text-[#00E599] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer
      ref={footerRef}
      className="ft relative isolate overflow-hidden bg-primary px-6 pb-6 pt-16 font-sans text-white sm:px-8 sm:pt-20"
    >
      <style>{`
        .ft { --fp: 0; }
        @keyframes ft-spin { to { transform: rotate(360deg); } }
        @keyframes ft-ping { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.7); opacity: 0; } }
        @keyframes ft-glow { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-26px,18px,0) scale(1.12); } }
        @keyframes ft-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,153,.45); } 50% { box-shadow: 0 0 0 7px rgba(0,229,153,0); } }

        .ft-border-spin { animation: ft-spin 7s linear infinite; }
        .ft-glow { animation: ft-glow 12s ease-in-out infinite alternate; }
        .ft-dot { animation: ft-dot 2.6s ease-in-out infinite; }

        /* ring that pulses outward when an icon button is hovered */
        .ft-ic { position: relative; }
        .ft-ic::after { content: ""; position: absolute; inset: 0; border-radius: inherit; border: 1px solid #00E599; opacity: 0; pointer-events: none; }
        .ft-ic:hover::after { animation: ft-ping .8s ease-out; }

        .ft-heading::after { content: ""; position: absolute; bottom: 0; inset-inline-start: 0; height: 2px; width: 26px; border-radius: 999px; background: #00E599; transition: width .3s ease; }
        .ft-heading:hover::after { width: 100%; }

        .ft-link .ft-chev { transition: transform .2s ease, opacity .2s ease; opacity: .45; }
        .ft-link:hover .ft-chev { transform: translateX(4px); opacity: 1; color: #00E599; }
        [dir="rtl"] .ft-link .ft-chev { transform: scaleX(-1); }
        [dir="rtl"] .ft-link:hover .ft-chev { transform: scaleX(-1) translateX(4px); }

        /* giant wordmark: outline always, gradient fill follows scroll */
        .ft-word { font-size: clamp(2.4rem, 9.5vw, 8.5rem); line-height: .95; letter-spacing: -0.02em; white-space: nowrap; }
        .ft-word-outline { color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.2); }
        .ft-word-fill {
          position: absolute; inset: 0;
          background-image: linear-gradient(90deg, #00E599, #2DD4BF);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          clip-path: inset(0 calc((1 - var(--fp)) * 100%) 0 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-border-spin, .ft-glow, .ft-dot { animation: none !important; }
          .ft-ic:hover::after { animation: none; }
        }
      `}</style>

      {/* background glow */}
      <div
        aria-hidden="true"
        className="ft-glow pointer-events-none absolute -top-40 -z-10 h-80 w-80 rounded-full bg-brand-gradient opacity-[.1] blur-3xl ltr:-right-24 rtl:-left-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-40 -z-10 h-56 w-56 rounded-full bg-[#00E599] opacity-[.04] blur-3xl ltr:-left-32 rtl:-right-32"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ---------- Call-to-action card with a spinning gradient border ---------- */}
        <div {...rv(0, "relative overflow-hidden rounded-3xl p-px")}>
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="ft-border-spin h-full w-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #00E599 60deg, #2DD4BF 100deg, transparent 160deg, transparent 360deg)",
              }}
            />
          </div>
          <div
            className="relative flex flex-col gap-6 rounded-[calc(1.5rem-1px)] bg-primary px-6 py-9 sm:px-10 md:flex-row md:items-center md:justify-between"
            onPointerMove={onMagnetMove}
            onPointerLeave={onMagnetLeave}
          >
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                Need materials for your next{" "}
                <span className="bg-brand-gradient bg-clip-text text-transparent">project?</span>
              </h2>
              <p className="mt-2 text-white/70">
                Send your list and our team will reply with prices and availability.
              </p>
            </div>
            <a
              ref={ctaBtnRef}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary shadow-lg shadow-[#00E599]/25 transition-[transform,filter] duration-200 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              Get a quote on WhatsApp
              <Ic name="upright" size={18} />
            </a>
          </div>
        </div>

        {/* ---------- Columns ---------- */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.5fr] lg:gap-8">
          {/* Brand */}
          <div {...rv(120)}>
            <Link to="/" className="inline-flex items-start gap-3 text-xl font-semibold leading-tight">
              <span aria-hidden="true" className="ft-dot mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#00E599]" />
              <span>
                Aral Desert
                <span className="block text-xs font-normal tracking-wide text-white/60">Trading Est.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-white/70">
              Industrial and construction materials supplier serving contractors,
              factories and facilities across Saudi Arabia.
            </p>

            {/* quick contact icons */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: "chat", label: "WhatsApp", href: whatsappHref, external: true },
                { icon: "phone", label: "Call us", href: `tel:+${WHATSAPP_NUMBER}` },
                { icon: "mail", label: "Email sales", href: `mailto:${EMAIL}` },
              ].map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  aria-label={b.label}
                  {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="ft-ic grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-[#00E599] transition duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-brand-gradient hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Ic name={b.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" {...rv(200)}>
            <FooterHeading>Quick links</FooterHeading>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>
                    <span className="text-[#00E599]">
                      <Ic name={l.icon} size={18} />
                    </span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products */}
          <div {...rv(280)}>
            <FooterHeading>Products</FooterHeading>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link to="/services" className={linkClass}>
                    <span className="ft-chev">
                      <Ic name="chevron" size={16} />
                    </span>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div {...rv(360)}>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-4 space-y-3">
              {contactItems.map((c) => {
                const inner = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-[#00E599] transition duration-300 group-hover:border-transparent group-hover:bg-brand-gradient group-hover:text-primary">
                      <Ic name={c.icon} size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-white/45">{c.label}</span>
                      <span
                        {...(c.ltr ? { dir: "ltr" } : {})}
                        className="block break-words text-[0.95rem] text-white/80 transition-colors group-hover:text-white"
                      >
                        {c.value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={`${c.label}-${c.value}`}>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="ft-ic-row group flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-3">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div
          {...rv(440, "mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between")}
        >
          <div className="flex flex-col gap-1">
            <p>
              &copy; {new Date().getFullYear()} Aral Desert Trading Est. All rights reserved.
            </p>
            {legal.length > 0 && <p>{legal.join("  |  ")}</p>}
          </div>
          <BackToTop reduce={reduce} />
        </div>

        {/* ---------- Giant wordmark: fills with gradient as you scroll ---------- */}
        <div aria-hidden="true" dir="ltr" className="mt-10 select-none overflow-hidden text-center">
          <div className="relative inline-block">
            <p className="ft-word ft-word-outline font-bold uppercase">Aral Desert</p>
            <p className="ft-word ft-word-fill font-bold uppercase">Aral Desert</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
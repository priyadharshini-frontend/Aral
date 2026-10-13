import { useEffect, useMemo, useRef, useState } from "react";

/* ---- Edit these in one place ----
   Confirm every answer with the client before launch. */
const WHATSAPP_NUMBER = "966538821388";

const FAQS = [
  {
    q: "How do I get a quotation?",
    a: "Send your item list, sizes and quantities by WhatsApp, phone or email. You can also send a photo of the item. Our team will reply with prices and availability.",
  },
  {
    q: "Do you deliver across Saudi Arabia?",
    a: "Yes. We arrange delivery to project sites and warehouses across the Kingdom. Tell us your location and we will confirm delivery time and cost with your quotation.",
  },
  {
    q: "Which brands do you supply?",
    a: "We supply Stanley, DeWalt, Milwaukee, Bosch, Hilti, Knipex, Ridgid, ESAB and many more. If you need a specific brand, ask us and we will confirm availability.",
  },
  {
    q: "Can you supply items that are not on your website?",
    a: "Yes. Our range is wide and we also source items on request. Send us the name, a photo or the specification and we will check for you.",
  },
  {
    q: "Do you provide certificates and technical documents?",
    a: "Tell us which documents your project requires, such as datasheets or certificates. We will confirm what is available for the products you request.",
  },
  {
    q: "Is there a minimum order quantity?",
    a: "It depends on the item. Contact us with your requirement and we will confirm any minimum quantity in your quotation.",
  },
];

/* ---------- helpers ---------- */
const wa = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* wraps the searched words in a highlight */
function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRe(q)})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded bg-[#00E599]/25 px-0.5 text-white">
        {p}
      </mark>
    ) : (
      p
    )
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

function useInView(threshold = 0.1) {
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

export default function FAQ() {
  const reduce = useReducedMotion();
  const [sectionRef, seen] = useInView();
  const on = seen || reduce;

  const [settled, setSettled] = useState(false); // entrance finished: drop the stagger delay
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setSettled(true), 1200);
    return () => clearTimeout(t);
  }, [on]);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(0); // index in FAQS, or -1 for none
  const btnRefs = useRef({});

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, i })).filter(
      (f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  /* while searching, open the best match */
  useEffect(() => {
    if (query.trim() && results.length) setOpen(results[0].i);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  /* arrow keys move between questions */
  const onKey = (e, pos) => {
    const len = results.length;
    let t = null;
    if (e.key === "ArrowDown") t = (pos + 1) % len;
    else if (e.key === "ArrowUp") t = (pos - 1 + len) % len;
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = len - 1;
    if (t === null) return;
    e.preventDefault();
    btnRefs.current[results[t].i]?.focus();
  };

  /* light that follows the pointer inside each question */
  const onItemMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  /* Helps Google show these answers in search results */
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-title"
      className="relative isolate overflow-hidden bg-primary px-6 py-20 font-sans text-white sm:px-8 lg:py-28"
    >
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <style>{`
        @keyframes fq-orb { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(24px, -18px); } }
        @keyframes fq-pop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .fq-anim { animation: none !important; } }
      `}</style>

      {/* background: grid + drifting glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fq-anim absolute -top-32 -z-10 h-96 w-96 rounded-full bg-brand-gradient opacity-20 blur-3xl ltr:-right-24 rtl:-left-24"
        style={{ animation: "fq-orb 11s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="fq-anim absolute -bottom-40 -z-10 h-96 w-96 rounded-full bg-brand-gradient opacity-10 blur-3xl ltr:-left-24 rtl:-right-24"
        style={{ animation: "fq-orb 14s ease-in-out infinite reverse" }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* ---------- Left: heading, search, help card ---------- */}
        <div
          className={`lg:sticky lg:top-8 lg:self-start ${
            reduce ? "" : "transition duration-700 ease-out"
          } ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <h2
            id="faq-title"
            className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
          >
            Questions buyers{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              ask us
            </span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Quick answers about quotations, delivery and products. Type a word
            to find the answer faster.
          </p>

          {/* live search */}
          <div className="relative mt-7 max-w-md">
            <label htmlFor="faq-search" className="sr-only">
              Search the questions
            </label>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/50 ltr:left-4 rtl:right-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, for example delivery"
              autoComplete="off"
              className="w-full rounded-full border border-white/15 bg-white/5 px-12 py-3.5 text-white placeholder:text-white/40 focus:border-[#00E599] focus:outline-none focus:ring-2 focus:ring-[#00E599]/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ltr:right-3 rtl:left-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
          <p aria-live="polite" className="mt-3 text-sm tabular-nums text-white/50">
            Showing {results.length} of {FAQS.length} questions
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">Still have a question?</h3>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/70">
              Message our team and we will reply as soon as we can.
            </p>
            <a
              href={wa("Hello Aral Desert Trading, I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-7 py-3 font-semibold text-primary transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* ---------- Right: accordion ---------- */}
        <div className="space-y-3">
          {results.map((f, pos) => {
            const isOpen = open === f.i;
            return (
              <div
                key={f.i}
                onPointerMove={onItemMove}
                className={`group relative overflow-hidden rounded-2xl border transition duration-300 ${
                  reduce ? "" : "ease-out"
                } ${
                  isOpen
                    ? "border-[#00E599]/60 bg-white/10 shadow-xl shadow-black/20"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                } ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{
                  transitionDelay: settled ? "0ms" : `${pos * 70}ms`,
                  animation: !reduce && query ? "fq-pop 0.35s ease both" : "none",
                }}
              >
                {/* pointer-following light */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(0,229,153,0.14), transparent 70%)",
                  }}
                />
                {/* gradient edge that fills when open */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 w-1 bg-brand-gradient transition-transform duration-300 ltr:left-0 rtl:right-0 ${
                    isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                <h3>
                  <button
                    ref={(el) => (btnRefs.current[f.i] = el)}
                    id={`faq-btn-${f.i}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${f.i}`}
                    onClick={() => setOpen(isOpen ? -1 : f.i)}
                    onKeyDown={(e) => onKey(e, pos)}
                    className="relative flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-start font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#00E599]"
                  >
                    <span
                      aria-hidden="true"
                      className={`w-8 shrink-0 text-sm font-semibold tabular-nums transition-colors duration-300 ${
                        isOpen ? "text-[#00E599]" : "text-white/40"
                      }`}
                    >
                      {String(f.i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <Highlight text={f.q} query={query} />
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${
                        isOpen
                          ? "rotate-45 bg-brand-gradient text-primary"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>

                {/* smooth height animation */}
                <div
                  id={`faq-panel-${f.i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${f.i}`}
                  aria-hidden={!isOpen}
                  className={`relative grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 ltr:pl-[4.5rem] rtl:pr-[4.5rem]">
                      <p className="text-[0.95rem] leading-relaxed text-white/75">
                        <Highlight text={f.a} query={query} />
                      </p>
                      <a
                        href={wa(`Hello Aral Desert Trading, I have a question about: ${f.q}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isOpen ? 0 : -1}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00E599] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E599]"
                      >
                        Ask about this on WhatsApp
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* nothing found: hand the visitor to the team */}
          {results.length === 0 && (
            <div
              className="fq-anim rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center"
              style={{ animation: "fq-pop 0.35s ease both" }}
            >
              <p className="text-lg font-semibold">No answer found for &ldquo;{query.trim()}&rdquo;</p>
              <p className="mx-auto mt-2 max-w-sm text-[0.95rem] leading-relaxed text-white/70">
                Ask our team directly and we will get back to you.
              </p>
              <a
                href={wa(`Hello Aral Desert Trading, I have a question: ${query.trim()}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-7 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Send your question on WhatsApp
              </a>
              <div>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 text-sm text-white/60 underline underline-offset-4 hover:text-white"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
import { useEffect, useRef, useState } from "react";

/* ---- Edit these in one place ---- */
const WHATSAPP_NUMBER = "966538821388";
const PHONE_DISPLAY = "+966 53 882 1388";
const AUTOPLAY_MS = 5200;

const Icon = ({ children }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#051329"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const FEATURES = [
  {
    short: "Wide range",
    title: "One supplier, wide range",
    text: "Safety, electrical, welding, plumbing, tools, building materials and valves. Fewer vendors to manage for your projects.",
    icon: (
      <Icon>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 12.5l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </Icon>
    ),
  },
  {
    short: "Certified",
    title: "Certified and approved",
    text: "Aramco vendor, ISO 9001 and UL & 9Com certified products you can submit to your client with confidence.",
    icon: (
      <Icon>
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </Icon>
    ),
  },
  {
    short: "Global brands",
    title: "Trusted global brands",
    text: "Genuine products from Stanley, DeWalt, Milwaukee, Bosch, Hilti and other names your teams already know.",
    icon: (
      <Icon>
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
      </Icon>
    ),
  },
  {
    short: "KSA delivery",
    title: "Delivery across Saudi Arabia",
    text: "We arrange delivery to your site or warehouse, so materials arrive when your work needs them.",
    icon: (
      <Icon>
        <path d="M3 6.5h11v9.5H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </Icon>
    ),
  },
];

const N = FEATURES.length;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mod = (v, m) => ((v % m) + m) % m;

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

export default function WhyUs() {
  const reduce = useReducedMotion();
  const [sectionRef, seen] = useInView();
  const on = seen || reduce;

  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false); // visitor has interacted: stop auto-rotating
  const [paused, setPaused] = useState(false);

  const stageRef = useRef(null);
  const cubeRef = useRef(null);
  const activeRef = useRef(0);
  const st = useRef({
    rotY: 0,
    rotX: -8,
    tiltX: 0,
    tiltY: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    startRotY: 0,
    startRotX: 0,
  });

  /* write the cube transform straight to the DOM (smooth, no re-render) */
  const apply = (mode) => {
    const el = cubeRef.current;
    if (!el) return;
    const s = st.current;
    el.style.transition =
      reduce || mode === "drag"
        ? "none"
        : mode === "tilt"
        ? "transform 0.25s ease-out"
        : "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = `rotateX(${s.rotX + s.tiltX}deg) rotateY(${s.rotY + s.tiltY}deg)`;
  };

  useEffect(() => {
    apply("snap");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* turn the prism so face i points at the viewer (shortest way round) */
  const goTo = (i) => {
    const s = st.current;
    let target = -i * 90;
    target += 360 * Math.round((s.rotY - target) / 360);
    s.rotY = target;
    s.rotX = -8;
    apply("snap");
    activeRef.current = i;
    setActive(i);
  };

  /* auto-rotate until the visitor takes over */
  useEffect(() => {
    if (!seen || picked || paused || reduce) return;
    const id = setTimeout(() => goTo((activeRef.current + 1) % N), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [seen, picked, paused, reduce, active]); // eslint-disable-line react-hooks/exhaustive-deps

  /* drag to rotate, hover to tilt */
  const onDown = (e) => {
    const s = st.current;
    s.dragging = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.startRotY = s.rotY;
    s.startRotX = s.rotX;
    s.tiltX = 0;
    s.tiltY = 0;
    setPicked(true);
    stageRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    const s = st.current;
    if (s.dragging) {
      s.rotY = s.startRotY + (e.clientX - s.startX) * 0.45;
      s.rotX = clamp(s.startRotX - (e.clientY - s.startY) * 0.25, -24, 24);
      apply("drag");
      return;
    }
    if (e.pointerType !== "mouse" || reduce) return;
    const r = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    s.tiltY = (px - 0.5) * 14;
    s.tiltX = -(py - 0.5) * 10;
    apply("tilt");
  };

  const onUp = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    stageRef.current?.releasePointerCapture?.(e.pointerId);
    goTo(mod(Math.round(-s.rotY / 90), N)); // snap to the nearest face
  };

  const onLeave = () => {
    const s = st.current;
    setPaused(false);
    if (s.dragging) return;
    s.tiltX = 0;
    s.tiltY = 0;
    apply("snap");
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setPicked(true);
    goTo(mod(active + (e.key === "ArrowRight" ? 1 : -1), N));
  };

  /* fade-up helper for the text column */
  const rv = (delay = 0, extra = "") => ({
    className: `${reduce ? "" : "transition duration-700 ease-out"} ${
      on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    } ${extra}`,
    style: { transitionDelay: `${delay}ms` },
  });

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Aral Desert Trading, I would like to discuss my requirements."
  )}`;

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-labelledby="why-title"
      className="relative isolate overflow-hidden bg-primary px-6 py-20 font-sans text-white sm:px-8 lg:py-28"
    >
      <style>{`
        @keyframes wu-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes wu-glow { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.12); } }
        @media (prefers-reduced-motion: reduce) { .wu-anim { animation: none !important; } }
      `}</style>

      {/* soft gradient glow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -z-10 h-96 w-96 rounded-full bg-brand-gradient opacity-15 blur-3xl ltr:-left-24 rtl:-right-24"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* ---- Left: message and call-to-action ---- */}
        <div>
          <h2
            id="why-title"
            {...rv(0, "text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]")}
          >
            A supplier your project team can{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              rely on
            </span>
          </h2>
          <p {...rv(120, "mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg")}>
            Aral Desert Trading Est. supplies industrial and construction
            materials to contractors, factories and facilities across the
            Kingdom.
          </p>

          <div {...rv(240, "mt-8 flex flex-wrap gap-3")}>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              Talk to our team on WhatsApp
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-8 py-3 font-medium text-white transition hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* ---- Right: interactive 3D prism ---- */}
        <div
          className={reduce ? "" : "transition duration-1000 ease-out"}
          style={{
            opacity: on ? 1 : 0,
            transform: on
              ? "none"
              : "perspective(900px) rotateX(-28deg) translateY(50px) scale(0.9)",
            transitionDelay: "200ms",
            "--s": "clamp(270px, 78vw, 340px)",
            "--h": "calc(var(--s) * 1.1)",
          }}
        >
          <div
            ref={stageRef}
            tabIndex={0}
            role="group"
            aria-roledescription="3D carousel"
            aria-label="Why choose us. Drag to rotate, or use the arrow keys."
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={onLeave}
            onKeyDown={onKeyDown}
            className="relative flex touch-pan-y cursor-grab select-none items-center justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#00E599] active:cursor-grabbing"
            style={{ perspective: 1100, minHeight: "calc(var(--h) + 90px)" }}
          >
            {/* glow platform under the prism */}
            <div
              aria-hidden="true"
              className="wu-anim absolute bottom-3 h-10 rounded-[50%] bg-brand-gradient blur-2xl"
              style={{ width: "calc(var(--s) * 0.9)", animation: "wu-glow 4s ease-in-out infinite" }}
            />

            {/* float wrapper */}
            <div
              className="wu-anim"
              style={{ animation: "wu-float 6s ease-in-out infinite", transformStyle: "preserve-3d" }}
            >
              {/* the prism */}
              <div
                ref={cubeRef}
                className="relative"
                style={{
                  width: "var(--s)",
                  height: "var(--h)",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                {/* four side faces */}
                {FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    id={`wu-face-${i}`}
                    role={i === active ? "tabpanel" : undefined}
                    aria-labelledby={i === active ? `wu-tab-${i}` : undefined}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-[#00E599]/30 p-7 text-white shadow-2xl shadow-black/40"
                    style={{
                      transform: `rotateY(${i * 90}deg) translateZ(calc(var(--s) / 2))`,
                      backfaceVisibility: "hidden",
                      background:
                        "linear-gradient(145deg, #0e2a52 0%, #071a35 55%, #051329 100%)",
                    }}
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />
                    <div className="flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient">
                        {f.icon}
                      </span>
                      <span className="bg-brand-gradient bg-clip-text text-3xl font-semibold text-transparent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold leading-snug">{f.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-white/75">{f.text}</p>
                  </div>
                ))}

                {/* top and bottom caps so the prism looks solid when tilted */}
                {[-1, 1].map((dir) => (
                  <div
                    key={dir}
                    aria-hidden="true"
                    className="absolute rounded-3xl border border-[#00E599]/20"
                    style={{
                      left: 0,
                      width: "var(--s)",
                      height: "var(--s)",
                      top: "calc(var(--h) / 2 - var(--s) / 2)",
                      transform: `rotateX(${dir * 90}deg) translateZ(calc(var(--h) / 2))`,
                      background: "linear-gradient(145deg, #0e2a52, #051329)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* tabs: click to turn the prism */}
          <div
            role="tablist"
            aria-label="Why choose us"
            className="mt-6 flex flex-wrap justify-center gap-2.5"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            {FEATURES.map((f, i) => (
              <button
                key={f.short}
                id={`wu-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`wu-face-${i}`}
                onClick={() => {
                  setPicked(true);
                  goTo(i);
                }}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i === active
                    ? "border-transparent bg-brand-gradient text-primary shadow-md shadow-[#00E599]/25"
                    : "border-white/25 text-white/85 hover:border-[#00E599]/60 hover:text-white"
                }`}
              >
                {f.short}
              </button>
            ))}
          </div>

          <p
            className={`mt-4 text-center text-sm text-white/50 transition-opacity duration-500 ${
              picked ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden="true"
          >
            Drag the prism to rotate it
          </p>
        </div>
      </div>
    </section>
  );
}
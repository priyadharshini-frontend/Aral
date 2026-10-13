import { useEffect, useRef, useState } from "react";

/* ---- Edit these in one place ---- */
const WHATSAPP_NUMBER = "966538821388";
const PHONE_DISPLAY = "+966 53 882 1388";
const HERO_IMAGE =
  "https://adtrdco.com/wp-content/uploads/2026/03/high-angle-tools-table-workshop-scaled.jpg";

/* The three collage images.
   For now all three use the client's workshop photo, cropped differently (pos + zoom).
   Replace with real photos when you have them, e.g.  src: "/images/hero/power-tools.jpg", zoom: 1
   If a file is missing, a branded panel is shown instead. */
const IMAGES = {
  main: {
    src: HERO_IMAGE,
    alt: "Industrial tools laid out on a workshop table",
    pos: "50% 50%",
    zoom: 1,
    label: "Tools",
  },
  top: { src: HERO_IMAGE, pos: "12% 22%", zoom: 2.3, label: "Fasteners" },
  bottom: { src: HERO_IMAGE, pos: "88% 86%", zoom: 2.3, label: "Welding" },
};

const TRUST = ["Aramco Vendor", "ISO 9001", "UL & 9Com Certified"];

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Aral Desert Trading, I would like a quotation."
)}`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#00E599" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke="#051329"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Photo that can be a crop of a larger image; falls back to a branded panel */
function HeroImage({ img, className = "", priority = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-primary ${className}`}>
      {failed ? (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#0d3b66] to-[#051329]">
          <span className="bg-brand-gradient bg-clip-text text-xl font-semibold text-transparent">
            {img.label}
          </span>
        </div>
      ) : (
        <img
          src={img.src}
          alt={img.alt || ""}
          loading={priority ? "eager" : "lazy"}
          draggable={false}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={{
            objectPosition: img.pos,
            transform: `scale(${img.zoom})`,
            transformOrigin: img.pos,
          }}
        />
      )}
      {/* subtle navy wash so every image sits in the theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);

  /* Scroll progress: 0 when the hero is at the top of the page, 1 once it has scrolled away.
     It is written to a CSS variable, and every layer below moves from that one number. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < -50) return; // already scrolled past
      const p = clamp(-r.top / (r.height * 0.9), 0, 1);
      el.style.setProperty("--p", p.toFixed(4));
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

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-title"
      className="hs relative isolate overflow-hidden bg-primary font-sans text-white"
    >
      <style>{`
        .hs { --p: 0; }
        .hs-photo   { transform: translate3d(0, calc(var(--p) * 6%), 0) scale(calc(1.1 + var(--p) * .1)); will-change: transform; }
        .hs-grid    { background-position: 0 calc(var(--p) * -120px); }
        .hs-orb     { transform: translate3d(calc(var(--p) * -90px), calc(var(--p) * 140px), 0); will-change: transform; }
        .hs-content { transform: translate3d(0, calc(var(--p) * -70px), 0); opacity: calc(1 - var(--p) * 1.3); will-change: transform, opacity; }
        .hs-a       { transform: translate3d(0, calc(var(--p) * -60px), 0) rotate(calc(var(--p) * 3deg)); will-change: transform; }
        .hs-b       { transform: translate3d(calc(var(--p) * -40px), calc(var(--p) * -150px), 0) rotate(calc(-5deg + var(--p) * -6deg)); will-change: transform; }
        .hs-c       { transform: translate3d(calc(var(--p) * 30px), calc(var(--p) * 110px), 0) rotate(calc(4deg + var(--p) * 7deg)); will-change: transform; }
        .hs-badge   { transform: translate3d(calc(var(--p) * 50px), calc(var(--p) * -90px), 0); will-change: transform; }
        .hs-cue     { opacity: calc(1 - var(--p) * 8); }
        .hs-cue-line{ transform: scaleY(calc(.35 + var(--p) * 8)); transform-origin: top; }
        .hs-btn { transition: transform .22s ease, filter .22s ease, background-color .22s ease, color .22s ease; }
        .hs-btn:hover { transform: translateY(-3px); }
        @media (prefers-reduced-motion: reduce) { .hs-btn { transition: none; } .hs-btn:hover { transform: none; } }
      `}</style>

      {/* ---------- Background: photo, wash, grid, glow (all move on scroll) ---------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="hs-photo absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-primary/85 lg:bg-gradient-to-r lg:from-primary lg:from-10% lg:via-primary/80 lg:via-50% lg:to-primary/40 lg:rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/70 to-transparent" />
        <div className="hs-grid pointer-events-none absolute inset-0 opacity-[.1] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_right,black,transparent_80%)]" />
        <div className="hs-orb pointer-events-none absolute -top-24 h-[420px] w-[420px] rounded-full bg-brand-gradient opacity-20 blur-3xl ltr:-right-24 rtl:-left-24" />
      </div>

      <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-12 px-6 pb-20 pt-36 sm:px-8 lg:min-h-[780px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* ---------- Text ---------- */}
        <div className="hs-content max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-xs font-medium tracking-wide text-white/85 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#00E599]" />
            SUPPLYING PROJECTS ACROSS THE KINGDOM
          </div>

          <h1
            id="hero-title"
            className="text-4xl font-medium leading-[1.12] sm:text-5xl lg:text-[3.6rem]"
          >
            Industrial Supplies Quoted Fast Across{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Saudi Arabia
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            We supply fasteners, power tools, welding equipment, pipe supports
            and cable systems from Stanley, DeWalt, Milwaukee, Bosch, Hilti and
            many more brands.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hs-btn inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-8 py-3 font-semibold text-primary shadow-lg shadow-[#00E599]/20 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              Get a Quote on WhatsApp
              <span aria-hidden="true" className="ms-2 text-lg leading-none">
                ↗
              </span>
            </a>
            <a
              href="#products"
              className="hs-btn inline-flex min-h-12 items-center justify-center rounded-full border border-white/60 bg-white/5 px-8 py-3 font-medium text-white backdrop-blur-sm hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-sm:w-full"
            >
              Browse Products
            </a>
          </div>

          <p className="mt-5 text-sm text-white/70">
            Or call us:{" "}
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              dir="ltr"
              className="font-medium text-white underline underline-offset-4 transition-colors hover:text-[#00E599]"
            >
              {PHONE_DISPLAY}
            </a>
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Image collage: each card moves at its own speed ---------- */}
        <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[460px] lg:h-[580px] lg:max-w-none">
          {/* main */}
          <div className="hs-a absolute top-[8%] h-[72%] w-[70%] ltr:right-0 rtl:left-0">
            <HeroImage
              img={IMAGES.main}
              priority
              className="h-full w-full rounded-3xl shadow-2xl shadow-black/50 ring-1 ring-white/20"
            />
          </div>

          {/* top left, gradient frame */}
          <div className="hs-b absolute top-0 z-10 h-[40%] w-[46%] ltr:left-0 rtl:right-0">
            <div className="h-full w-full rounded-[1.65rem] bg-brand-gradient p-[3px] shadow-xl shadow-black/40">
              <HeroImage img={IMAGES.top} className="h-full w-full rounded-3xl" />
            </div>
          </div>

          {/* bottom left */}
          <div className="hs-c absolute bottom-0 z-10 h-[36%] w-[52%] ltr:left-[6%] rtl:right-[6%]">
            <HeroImage
              img={IMAGES.bottom}
              className="h-full w-full rounded-3xl shadow-xl shadow-black/40 ring-1 ring-white/20"
            />
          </div>

          {/* floating badge */}
          <div className="hs-badge absolute bottom-[10%] z-20 ltr:right-[2%] rtl:left-[2%]">
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-primary/80 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-md">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#051329" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6.5h11v9.5H3z" />
                  <path d="M14 10h4l3 3v3h-7" />
                  <circle cx="7" cy="17.5" r="1.8" />
                  <circle cx="17" cy="17.5" r="1.8" />
                </svg>
              </span>
              <span className="text-sm font-semibold leading-tight">
                Delivery across
                <span className="block text-white/70">Saudi Arabia</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue: fades out as soon as the visitor scrolls */}
      <div aria-hidden="true" className="hs-cue pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center sm:flex">
        <div className="flex flex-col items-center gap-2 text-xs text-white/60">
          Scroll
          <span className="h-8 w-px overflow-hidden rounded-full bg-white/20">
            <span className="hs-cue-line block h-full w-full bg-brand-gradient" />
          </span>
        </div>
      </div>
    </section>
  );
}
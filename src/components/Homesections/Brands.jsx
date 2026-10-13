/* ---- Edit brands here ----
   Add a logo later with:  { name: "Bosch", logo: "/brands/bosch.svg" }
   Logos sit on a navy band, so use single-colour (dark or white) SVG/PNG files;
   they are shown in white automatically.
   Without a logo, the brand name is shown as a text wordmark. */
const BRANDS = [
  { name: "Stanley" },
  { name: "DeWalt" },
  { name: "Milwaukee" },
  { name: "Bosch" },
  { name: "Hilti" },
  { name: "Knipex" },
  { name: "Ridgid" },
  { name: "ESAB" },
];

const WHATSAPP_NUMBER = "966538821388";
const SPEED = "40s"; // time for one full loop: higher = slower
const REPEAT = 2; // how many times the list repeats inside each half (raise if you see a gap on very wide screens)

const wa = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/* One copy of the brand list. The duplicate is hidden from screen readers and the tab key. */
function BrandList({ duplicate = false }) {
  const items = Array.from({ length: REPEAT }).flatMap(() => BRANDS);

  return (
    <ul
      className={`br-dup-${duplicate ? "yes" : "no"} flex shrink-0 items-center`}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {items.map((b, i) => (
        <li key={`${b.name}-${i}`} className="flex shrink-0 items-center">
          <a
            href={wa(`Hello Aral Desert Trading, do you supply ${b.name}?`)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={duplicate ? -1 : 0}
            aria-label={`Ask about ${b.name} on WhatsApp`}
            className="group relative block px-8 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E599] sm:px-12"
          >
            {b.logo ? (
              <img
                src={b.logo}
                alt=""
                loading="lazy"
                className="h-8 w-auto object-contain opacity-60 brightness-0 invert transition duration-300 group-hover:scale-110 group-hover:opacity-100 sm:h-10"
              />
            ) : (
              <span className="block text-3xl font-semibold uppercase tracking-[0.14em] text-white/55 transition duration-300 group-hover:scale-110 group-hover:text-white sm:text-4xl">
                {b.name}
              </span>
            )}

            {/* gradient underline that draws on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-8 bottom-2 h-0.5 origin-left scale-x-0 rounded-full bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-12"
            />
          </a>

          {/* separator */}
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-brand-gradient opacity-70"
          />
        </li>
      ))}
    </ul>
  );
}

export default function Brands() {
  return (
    <section
      id="brands"
      aria-labelledby="brands-title"
      className="overflow-hidden bg-white py-20 font-sans text-primary lg:py-28"
    >
      <style>{`
        @keyframes br-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .br-track { animation: br-scroll var(--br-speed, 40s) linear infinite; will-change: transform; }
        .br-band:hover .br-track,
        .br-band:focus-within .br-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .br-track { animation: none; }
          .br-dup-yes { display: none; }
          .br-band { overflow-x: auto; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="brands-title"
              className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
            >
              Brands your teams already{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                trust
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              We supply tools and materials from leading international
              manufacturers, so you get the quality your projects require.
              Tap a brand to ask about it on WhatsApp.
            </p>
          </div>

          <a
            href={wa("Hello Aral Desert Trading, do you supply this brand: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-primary px-7 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ask about another brand
          </a>
        </div>
      </div>

      {/* Full-width ticker band: one line, loops forever */}
      <div
        className="br-band relative mt-12 bg-primary py-6 sm:py-8"
        style={{
          "--br-speed": SPEED,
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div dir="ltr" className="br-track flex w-max">
          <BrandList />
          <BrandList duplicate />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-6xl px-6 text-sm text-slate-500 sm:px-8">
        And many more. Tell us what you need and we will confirm availability.
      </p>
    </section>
  );
}
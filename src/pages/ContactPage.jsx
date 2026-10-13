import PageHero from "../components/common/PageHero";
import { useEffect, useRef, useState } from "react";

const ADDRESS_QUERY = "9th Street, Al Souq, Dammam 32241, Kingdom of Saudi Arabia";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`;

const icons = {
  mail: (
    <path d="M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11zm2 .5l7 5 7-5" />
  ),
  phone: (
    <path d="M5 4h3.5l1.7 4.2-2.2 1.400a11 11 0 005.400 5.400l1.400-2.200L19 14.500V18a2 2 0 01-2 2A14 14 0 013 6a2 2 0 012-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.800 7-11a7 7 0 10-14 0c0 5.200 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.500" />
    </>
  ),
};

const cards = [
  {
    icon: "mail",
    title: "Email Address",
    subtitle: "Send us an email anytime",
    items: [
      { text: "info@adtrdco.com", href: "mailto:info@adtrdco.com" },
      { text: "sales1@adtrdco.com", href: "mailto:sales1@adtrdco.com" },
    ],
  },
  {
    icon: "phone",
    title: "Phone Number",
    subtitle: "Call us anytime",
    items: [
      { text: "+966 53 882 1388", href: "tel:+966538821388" },
      { text: "+966 53 244 4200", href: "tel:+966532444200" },
    ],
  },
  {
    icon: "pin",
    title: "Office Address",
    subtitle: "Visit our office",
    items: [
      { text: "9th Street, Al Souq,", href: MAP_DIRECTIONS, external: true },
      {
        text: "Dammam – 32241, Kingdom of Saudi Arabia",
        href: MAP_DIRECTIONS,
        external: true,
      },
    ],
  },
];

/* ---------- scroll reveal ---------- */

function Reveal({ children, delay = 0, y = 32, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- card ---------- */

function ContactCard({ icon, title, subtitle, items }) {
  return (
    <div
      className="group relative h-full overflow-hidden rounded-3xl border border-primary/10 bg-white p-8 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl focus-within:-translate-y-2 focus-within:border-transparent focus-within:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* navy fill rises from the bottom on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100 motion-reduce:transition-none"
      />
      {/* soft gradient glow in the corner */}
      <span
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 group-focus-within:opacity-40"
      />

      <div className="relative">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-brand-from transition duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-primary group-focus-within:bg-brand-gradient group-focus-within:text-primary motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icons[icon]}
          </svg>
        </span>

        <h3 className="mt-6 text-xl font-semibold text-primary transition-colors duration-500 group-hover:text-white group-focus-within:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-primary/60 transition-colors duration-500 group-hover:text-white/70 group-focus-within:text-white/70">
          {subtitle}
        </p>

        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.text}>
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-block bg-linear-to-r from-brand-from to-brand-to bg-size-[0%_2px] bg-bottom bg-no-repeat pb-0.5 font-medium text-primary transition-[background-size,color,transform] duration-500 hover:bg-size-[100%_2px] hover:translate-x-1 focus-visible:bg-size-[100%_2px] group-hover:text-white group-focus-within:text-white motion-reduce:transition-none"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        description="Talk to our sales team, request a quote, or visit our office in Dammam."
      />

      {/* Contact cards */}
      <section id="contact" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-brand-gradient" />
              Contact
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-5xl">
              Office Near You.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 150}>
                <ContactCard {...c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live map */}
      <section id="map" className="bg-[#f3f6fa] pb-20 pt-4 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal y={48}>
            <div className="group relative h-[460px] overflow-hidden rounded-3xl border border-primary/10 shadow-xl sm:h-[540px]">
              <iframe
                title="Aral Desert Trading office location on Google Maps"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full grayscale-[0.4] transition duration-700 group-hover:grayscale-0 motion-reduce:transition-none"
              />

              {/* floating address card */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-xs">
                <div className="pointer-events-auto rounded-2xl bg-primary p-5 text-white shadow-2xl transition duration-500 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <p className="text-sm font-semibold">Aral Desert Trading</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    9th Street, Al Souq, Dammam – 32241, Kingdom of Saudi Arabia
                  </p>
                  <a
                    href={MAP_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-primary transition duration-300 hover:gap-3 hover:shadow-lg"
                  >
                    Get directions
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m-6-6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
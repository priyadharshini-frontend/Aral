import CircularCarousel from "../ui/CircularCarousel";


const items = [
  {
    src: "https://img.magnific.com/free-vector/icons-set-different-simple-tools-housework-non-professional-repair_1284-6089.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Premium silk saree",
    title: "Industrial Fasteners",
    subtitle: "Bolts, nuts, screws, anchors and washers for construction and industrial use.",
  },
  {
    src: "https://img.magnific.com/free-photo/man-fixing-motorcycle-modern-workshop_158595-8135.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Power Tools",
    title: "Power Tools",
    subtitle: "Drills, grinders, saws and cordless systems from leading brands.",
  },
  {
    src: "https://img.magnific.com/premium-photo/collection-various-hand-tools-power-tools-against-green-background-including-drill-ha_1187944-2223.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Hand Tools",
    title: "Hand Tools",
    subtitle: "Wrenches, pliers, sockets and measuring tools for daily site work.",
  },
  {
    src: "https://img.magnific.com/premium-photo/industrial-worker-with-safety-equipments-protective-mask-welding-steel-structure-construction-factory_987113-1673.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Welding Equipment",
    title: "Welding Equipment",
    subtitle: "Welding machines, electrodes, torches and accessories.",
  },
  {
    src: "https://img.magnific.com/premium-photo/collection-new-wooden-furniture-legs-drying-after-applying-varnish-hanging-workshop-close-view_121999-2823.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Pipe Hangers & Support",
    title: "Pipe Hangers & Support",
    subtitle: "Clamps, hangers and supports for pipework installation.",
  },
  {
    src: "https://img.magnific.com/free-photo/male-electrician-works-switchboard-overalls-against-backdrop-emergency-lighting_169016-66398.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Hand Tools",
    title: "Cable Management",
    subtitle: "Trays, ladders, conduits and fittings for organized cabling.",
  },
  {
    src: "https://img.magnific.com/premium-photo/personal-protective-equipment-safe-environments_486608-11062.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80",
    alt: "Hand Tools",
    title: "Safety Materials",
    subtitle: "Helmets, gloves, eyewear, footwear and protective gear.",
  },
    {
    src: "https://img.magnific.com/free-photo/tools-materials-sanitary-works_93675-131728.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80  ",
    alt: "Hand Tools",
    title: "Industrial Valves",
    subtitle: "Gate, ball and check valves for plant and pipeline use.",
  },
];
const WHATSAPP_NUMBER = "966538821388";

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* onSelectCategory is optional: use it later to pre-fill the quote form */
export default function Products({ onSelectCategory }) {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="bg-slate-50 px-6 py-20 font-sans text-primary sm:px-8 lg:py-28"
    >
      {/* <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2
            id="products-title"
            className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
          >
            Everything your project needs, from one supplier
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Pick a category to request a quote, or send us your full list. We
            also source items that are not shown here.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <li key={c.title}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-primary/10">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right"
                />

                <span
                  aria-hidden="true"
                  className="bg-brand-gradient bg-clip-text text-4xl font-semibold text-transparent"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-slate-600">
                  {c.text}
                </p>

                <a
                  href="#quote"
                  onClick={() => onSelectCategory?.(c.title)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Get a quote
                  <span className="sr-only"> for {c.title}</span>
                  <Arrow />
                </a>
              </article>
            </li>
          ))}

          <li>
            <article className="flex h-full flex-col justify-between rounded-2xl bg-primary p-7 text-white">
              <div>
                <h3 className="text-xl font-semibold">
                  Cannot find what you need?
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/80">
                  Send us a photo or a list on WhatsApp. We will source it and
                  send you a quotation.
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hello Aral Desert Trading, I am looking for an item that is not on your website."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gradient px-6 py-3 font-semibold text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Send your list on WhatsApp
              </a>
            </article>
          </li>
        </ul>
      </div> */}

      <div className="max-w-6xl mx-auto">
          <h2
            id="products-title"
            className="text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]"
          >
            Everything your project needs, <br /> from one supplier
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Pick a category to request a quote, or send us your full list. We
            also source items that are not shown here.
          </p>
        </div>


      <div className="mx-auto h-[600px] ">
        
        <CircularCarousel
          items={items}
          preset="cylinder"
          cardWidth={240}
          aspectRatio={0.75}
          speed={10}
          autoplay
          draggable
          captions
        />
      </div>
    </section>
  );
}
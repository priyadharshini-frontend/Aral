export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary pt-32 pb-16 text-white sm:pt-36 lg:pt-40 lg:pb-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,229,153,0.26),_transparent_32%),linear-gradient(135deg,#051329_0%,#0d2446_46%,#081a2f_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute -right-16 top-8 h-64 w-64 rounded-full bg-[#00E599]/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-52 w-52 rounded-full bg-[#2DD4BF]/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#00E599]" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

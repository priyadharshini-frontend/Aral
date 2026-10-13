'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const wrap = (v) => ((((v + 180) % 360) + 360) % 360) - 180;
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

const DEFAULT_ITEMS = [
  { src: "https://img.magnific.com/free-vector/icons-set-different-simple-tools-housework-non-professional-repair_1284-6089.jpg?ga=GA1.1.296390106.1791812059&semt=ais_hybrid&w=740&q=80", alt: "Valley", title: "Valley", subtitle: "Landscape" },
  { src: "/images/portrait.jpg", alt: "Portrait", title: "Portrait", subtitle: "Studio" },
  { src: "/images/towers.jpg", alt: "Towers", title: "Towers", subtitle: "Architecture" },
  { src: "/images/ocean.jpg", alt: "Ocean", title: "Ocean", subtitle: "Travel" },
  { src: "/images/fashion.jpg", alt: "Fashion", title: "Fashion", subtitle: "Editorial" },
];

const PRESETS = {
  cylinder: { tilt: -5, perspective: 2500, curve: 1, spread: 1 },
  orbit: { tilt: -16, perspective: 1500, curve: 0, spread: 1.45 },
};

export default function CircularCarousel({
  items = DEFAULT_ITEMS,
  preset = "cylinder",
  cardWidth = 220,
  aspectRatio = 1,
  gap = 25,
  autoplay = true,
  speed = 14,
  draggable = true,
  pauseOnHover = true,
  captions = true,
  className = "",
}) {
  const list = items?.length ? items : DEFAULT_ITEMS;
  const count = list.length;
  const layout = PRESETS[preset] || PRESETS.cylinder;
  const step = 360 / count;

  const cardW = Math.max(80, cardWidth);
  const cardH = cardW / clamp(aspectRatio, 0.2, 5);

  const radius = useMemo(() => {
    const pitch = (cardW + gap) * layout.spread;
    const chord = pitch / (2 * Math.sin(Math.PI / Math.max(count, 3)));
    return Math.max(chord, cardW * 0.6);
  }, [cardW, gap, count, layout.spread]);

  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const stateRef = useRef({
    angle: 0,
    velocity: 0,
    dragging: false,
    hover: false,
    startX: 0,
    startAngle: 0,
    lastX: 0,
    lastTime: 0,
  });

  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const focusIndex = useCallback((index) => {
    const state = stateRef.current;
    let target = -index * step;
    target += 360 * Math.round((state.angle - target) / 360);
    state.angle = target;
  }, [step]);

  useEffect(() => {
    let raf;
    let previous = performance.now();

    const animate = (now) => {
      const state = stateRef.current;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (!state.dragging) {
        if (autoplay && !(pauseOnHover && state.hover)) {
          state.angle += speed * dt;
        }
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${state.angle}deg)`;
      }

      const next = ((Math.round(-state.angle / step) % count) + count) % count;
      setActive((old) => (old === next ? old : next));

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, pauseOnHover, speed, step, count]);

  const onPointerDown = (e) => {
    if (!draggable) return;

    const state = stateRef.current;
    state.dragging = true;
    state.startX = e.clientX;
    state.lastX = e.clientX;
    state.startAngle = state.angle;
    state.lastTime = performance.now();

    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const state = stateRef.current;

    if (e.pointerType === "mouse" && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      rootRef.current.style.setProperty(
        "--mx",
        `${((e.clientX - rect.left) / rect.width) * 100}%`
      );
      rootRef.current.style.setProperty(
        "--my",
        `${((e.clientY - rect.top) / rect.height) * 100}%`
      );
    }

    if (!state.dragging) return;

    const delta = e.clientX - state.startX;
    state.angle = state.startAngle + delta * 0.45;
    state.lastX = e.clientX;
  };

  const onPointerUp = (e) => {
    const state = stateRef.current;
    if (!state.dragging) return;

    state.dragging = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const cards = list.map((item, index) => {
    const angle = index * step;

    return (
      <button
        key={`${item.src}-${index}`}
        type="button"
        aria-label={item.title || item.alt || `Image ${index + 1}`}
        onClick={() => focusIndex(index)}
        className="absolute left-1/2 top-1/2 overflow-hidden border-0 bg-transparent p-0 shadow-2xl outline-none transition-[filter,opacity] duration-300 focus-visible:ring-2 focus-visible:ring-white/80"
        style={{
          width: cardW,
          height: cardH,
          marginLeft: -cardW / 2,
          marginTop: -cardH / 2,
          transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        <img
          src={item.src}
          alt={item.alt || item.title || ""}
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </button>
    );
  });

  const current = list[active];

  return (
    <section
      ref={rootRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Image carousel"
      className={`relative h-full min-h-[420px] w-full overflow-hidden  outline-none [perspective:1800px] ${dragging ? "cursor-grabbing" : draggable ? "cursor-grab" : ""} ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => (stateRef.current.hover = true)}
      onPointerLeave={() => (stateRef.current.hover = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") focusIndex((active + 1) % count);
        if (e.key === "ArrowLeft") focusIndex((active - 1 + count) % count);
      }}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
          style={{
            transform: "rotateY(0deg)",
            transition: dragging ? "none" : "transform 120ms linear",
          }}
        >
          {cards}
        </div>
      </div>

      {captions && current && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 text-center text-white">
          <div className="text-primary font-bold text-xl  ">
            {current.title || current.alt}
          </div>
          {current.subtitle && (
            <div className="mt-1 text-sm text-primary">{current.subtitle}</div>
          )}
          <div className="mt-2 text-xs tabular-nums text-primary">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </div>
        </div>
      )}

    </section>
  );
}

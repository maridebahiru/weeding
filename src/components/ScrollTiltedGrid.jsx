import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1);
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1);
const focusEase = [easeIntoFocus, easeOutOfFocus];

const MAX_WIDTH_MAP = {
  sm: "384px",
  md: "448px",
  lg: "512px",
  xl: "576px",
  "2xl": "672px",
  "3xl": "768px",
  none: "100%",
};

function Tile({ src, side, config }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded } = config;

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: focusEase });
  const bright = useTransform(p, [0, 0.5, 1], [0, 1, 0], { ease: focusEase });
  const contrast = useTransform(p, [0, 0.5, 1], [4, 1, 4], { ease: focusEase });

  const ty = useTransform(p, [0, 0.5, 1], ["100%", "0%", "-100%"], { ease: focusEase });
  const tz = useTransform(p, [0, 0.5, 1], [300, 0, 300], { ease: focusEase });
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: focusEase });

  const tx = useTransform(p, [0, 0.5, 1], [`${sign * 40}%`, "0%", `${sign * 40}%`], { ease: focusEase });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 5, 0, sign * 5], { ease: focusEase });
  const sk = useTransform(p, [0, 0.5, 1], [sign * 20, 0, -sign * 20], { ease: focusEase });

  const innerSY = useTransform(p, [0, 0.5, 1], [1.8, 1, 1.8], { ease: focusEase });

  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`;

  const tileStyle = {
    position: 'relative',
    zIndex: 10,
    margin: 0,
    perspective,
    willChange: "transform"
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    aspectRatio,
    borderRadius: rounded,
  };

  const imgStyle = {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: `url("${src}")`,
  };

  if (reduce) {
    return (
      <figure ref={ref} style={tileStyle}>
        <div style={containerStyle}>
          <div style={imgStyle} />
        </div>
      </figure>
    );
  }

  return (
    <motion.figure ref={ref} style={tileStyle}>
      <motion.div
        style={{
          ...containerStyle,
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
          willChange: "filter, transform"
        }}
      >
        <motion.div
          style={{
            ...imgStyle,
            scaleY: innerSY,
            backfaceVisibility: "hidden",
            willChange: "transform"
          }}
        />
      </motion.div>
    </motion.figure>
  );
}

export function ScrollTiltedGrid({
  images = [],
  loop = false,
  initialCycles = 3,
  aspectRatio = "3/4",
  maxWidth = "lg",
  gap = 10,
  perspective = 900,
  maxTilt = 70,
  maxBlur = 8,
  rounded = "0.375rem",
  className = "",
}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCycles((c) => c + 2);
        }
      },
      { rootMargin: "1500px 0px 1500px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const items = useMemo(
    () => (loop ? Array.from({ length: cycles }, () => images).flat() : [...images]),
    [loop, cycles, images],
  );

  const config = useMemo(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded],
  );

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    width: '100%',
    maxWidth: MAX_WIDTH_MAP[maxWidth] || '100%',
    margin: '10vh auto',
    gap: `${gap * 0.25}rem`,
  };

  return (
    <section className={className} style={{ position: 'relative', width: '100%' }}>
      <div style={gridStyle}>
        {items.map((src, i) => (
          <Tile key={`${i}-${src}`} src={src} side={i % 2 === 0 ? "L" : "R"} config={config} />
        ))}
      </div>
      {loop && <div ref={sentinelRef} aria-hidden style={{ height: '1px', width: '100%' }} />}
    </section>
  );
}

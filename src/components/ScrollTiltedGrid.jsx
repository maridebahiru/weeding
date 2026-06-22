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
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded, isMobile } = config;

  // Scale down the intensity of tilt, blur, skew, and translation on mobile to prevent overflow
  const activeMaxTilt = isMobile ? Math.min(maxTilt, 12) : maxTilt;
  const activeMaxBlur = isMobile ? Math.min(maxBlur, 3) : maxBlur;
  const activeTxPercent = isMobile ? 8 : 40;
  const activeSkewDeg = isMobile ? 4 : 20;
  const activeTzDepth = isMobile ? 80 : 300;
  const activeRotDeg = isMobile ? 1.5 : 5;

  const blur = useTransform(p, [0, 0.5, 1], [activeMaxBlur, 0, activeMaxBlur], { ease: focusEase });
  const bright = useTransform(p, [0, 0.5, 1], [0.1, 1, 0.1], { ease: focusEase });
  const contrast = useTransform(p, [0, 0.5, 1], [4, 1, 4], { ease: focusEase });

  const ty = useTransform(p, [0, 0.5, 1], ["100%", "0%", "-100%"], { ease: focusEase });
  const tz = useTransform(p, [0, 0.5, 1], [activeTzDepth, 0, activeTzDepth], { ease: focusEase });
  const rx = useTransform(p, [0, 0.5, 1], [activeMaxTilt, 0, -activeMaxTilt], { ease: focusEase });

  const tx = useTransform(p, [0, 0.5, 1], [`${sign * activeTxPercent}%`, "0%", `${sign * activeTxPercent}%`], { ease: focusEase });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * activeRotDeg, 0, sign * activeRotDeg], { ease: focusEase });
  const sk = useTransform(p, [0, 0.5, 1], [sign * activeSkewDeg, 0, -sign * activeSkewDeg], { ease: focusEase });

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
  const [isMobile, setIsMobile] = useState(false);
  const sentinelRef = useRef(null);

  // Monitor screen size dynamically for mobile layout adjustment
  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const listener = () => setIsMobile(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

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
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded, isMobile }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded, isMobile],
  );

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    width: '100%',
    maxWidth: MAX_WIDTH_MAP[maxWidth] || '100%',
    margin: isMobile ? '4vh auto' : '10vh auto',
    gap: `${isMobile ? 0.5 : gap * 0.25}rem`,
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

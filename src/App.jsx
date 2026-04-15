import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, CalendarHeart, Clock, GlassWater, Volume2, VolumeX } from 'lucide-react';
import './index.css';

// Importing local images from src/assets/
import heroImg from './assets/hero.png';
import storyImg from './assets/1.jpg';
import gal1 from './assets/326ed2eaf73709e853d6f9807ba8b9fc.jpg';
import gal2 from './assets/36c3412900dc3b6da9a861b937dba285.jpg';
import gal3 from './assets/3b1b2aad08cbd20873671ecc648220f7.jpg';
import gal4 from './assets/67c6f17f4b05bda8c5ca5ff4dad93460.jpg';
import gal5 from './assets/e086dbcc504ffc7c6d6373cbd701e8d8.jpg';
import gal6 from './assets/download.jpg';
import gal7 from './assets/images.jfif';
import gal8 from './assets/images (4).jfif';
import sealImg from './assets/wax-seal.png';

// Components
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

const SectionDivider = () => (
  <div className="flex items-center justify-center gap-4 my-12 opacity-40" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '3rem 0', opacity: 0.4 }}>
    <div style={{ height: '1px', width: '60px', background: 'var(--color-primary)' }}></div>
    <span style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>✦</span>
    <div style={{ height: '1px', width: '60px', background: 'var(--color-primary)' }}></div>
  </div>
);

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-container">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <motion.div 
          key={unit}
          className="countdown-box"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
        >
          <span className="countdown-number">{value.toString().padStart(2, '0')}</span>
          <span className="countdown-label">{unit}</span>
        </motion.div>
      ))}
    </div>
  );
};

function EnvelopeScreen({ onOpen, onStart }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    if (onStart) onStart();
    
    // Smooth cinematic transition timing
    setTimeout(() => {
      onOpen();
    }, 2500); 
  };

  return (
    <motion.div 
      className="envelope-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
    >
      <div className="envelope-wrapper" onClick={handleOpenClick}>
        <motion.div 
          className="envelope"
          animate={isOpening ? { scale: 2.5, y: -200, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Soft Natural Light Overlay */}
          <div className="envelope-light"></div>
          
          {/* Back of envelope */}
          <div className="envelope-back"></div>

          {/* Bottom pocket of envelope */}
          <div className="envelope-pocket"></div>
          
          {/* Top cover flap with Seal attached */}
          <motion.div 
            className="envelope-flap"
            initial={{ rotateX: 0 }}
            animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            style={{ 
              transformOrigin: 'top', 
              zIndex: 4,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Split Flap Background and Seal so Clip-Path doesn't hide the Seal */}
            <div className="envelope-flap-bg"></div>
            <div className="wax-seal-wrapper">
              <img src={sealImg} alt="Wax Seal" className="wax-seal-img" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  const [showInvite, setShowInvite] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [startMusic, setStartMusic] = useState(false);
  
  const handleOpen = () => {
    setShowInvite(true);
  };

  const handleStart = () => {
    setStartMusic(true);
  };

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Set the wedding date to future
  const weddingDate = new Date();
  weddingDate.setMonth(weddingDate.getMonth() + 3);
  weddingDate.setDate(15);

  return (
    <>
      <AnimatePresence>
        {!showInvite && <EnvelopeScreen onOpen={handleOpen} onStart={handleStart} />}
      </AnimatePresence>

      {/* Background Music - Hidden YouTube Player */}
      {startMusic && (
        <div style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
          <iframe 
            width="0" 
            height="0" 
            src={`https://www.youtube.com/embed/ixcKi765Iy8?autoplay=1&loop=1&playlist=ixcKi765Iy8&mute=${isMuted ? 1 : 0}`}
            title="Mezmur"
            frameBorder="0"
            allow="autoplay"
          ></iframe>
        </div>
      )}

      {/* Floating Mute Button */}
      {showInvite && (
        <motion.button
          className="mute-btn"
          onClick={() => setIsMuted(!isMuted)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      )}

      <main style={{ 
        opacity: showInvite ? 1 : 0, 
        pointerEvents: showInvite ? 'auto' : 'none',
        height: showInvite ? 'auto' : '100vh',
        overflow: showInvite ? 'auto' : 'hidden',
        transition: 'opacity 1.5s ease-in-out'
      }}>
        {/* --- HERO SECTION --- */}
        <section className="hero">
          <motion.img 
            style={{ y: heroY }}
            animate={{ scale: [1, 1.1] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={heroImg} 
            alt="Majestic Ethiopian Orthodox Church" 
            className="hero-bg"
          />
          <div className="hero-overlay"></div>
          
          <motion.div style={{ opacity: heroOpacity }} className="hero-content">
            <FadeIn delay={0.2}>
              <div className="uppercase-mono" style={{ color: 'white', opacity: 0.9, marginBottom: '0.5rem' }}>October 15, 2026</div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <h1 className="hero-names">
                Kalkidan <span>&</span> Beteab
              </h1>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div className="uppercase-mono" style={{ color: 'white', opacity: 0.9, fontSize: '0.7rem' }}>Are getting married</div>
            </FadeIn>
          </motion.div>
        </section>

        {/* --- OUR STORY / INTRODUCTION --- */}
        <section className="section" style={{ background: 'var(--color-bg-alt)', borderRadius: '60px 60px 0 0', marginTop: '-60px', position: 'relative', zIndex: 1, padding: '10rem 1.5rem' }}>
          <div className="container">
          <div className="story-grid">
            <FadeIn>
              <img 
                src={storyImg} 
                alt="Couple" 
                className="story-image"
              />
            </FadeIn>
            <div className="story-text">
              <FadeIn>
                <div className="uppercase-mono text-accent" style={{ marginBottom: '1rem' }}>The Beginning</div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>A Love Story</h2>
              </FadeIn>
              <FadeIn delay={0.4}>
                <p style={{ marginBottom: '2rem', opacity: 0.8, fontSize: '1.1rem' }}>
                  We met under the twinkling lights of a crowded city, two paths converging in the most unexpected way. Since that day, every moment has been an adventure. We are thrilled to invite you to celebrate the next chapter of our story with us.
                </p>
                <h3 className="script-font" style={{ fontSize: '3.5rem', marginTop: '2rem', color: 'var(--color-primary)' }}>K & B</h3>
              </FadeIn>
            </div>
          </div>
          <SectionDivider />
          </div>
        </section>

        {/* --- GALLERY SECTION --- */}
        <section className="section container">
          <FadeIn>
            <div className="text-center">
              <div className="uppercase-mono text-accent">Captured Moments</div>
              <h2 style={{ display: 'block', fontSize: '3.5rem', margin: '1.5rem 0', color: 'var(--color-primary)' }}>Our Gallery</h2>
              <SectionDivider />
            </div>
          </FadeIn>
          
          <div className="gallery-grid">
            {[
              gal1,
              gal2,
              gal3,
              gal4,
              gal5,
              gal6,
              gal7,
              gal8
            ].map((src, index) => {
              const isEven = index % 2 === 0;
              return (
              <motion.div 
                key={index} 
                className={`item-${index}`}
                initial={{ opacity: 0, scale: 0.8, y: 100, rotate: isEven ? -6 : 6 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 1.2, delay: (index % 3) * 0.15, type: "spring", bounce: 0.35 }}
              >
                <div className="gallery-item">
                  <div className="gallery-overlay"></div>
                  <img src={src} alt={`Wedding Moment ${index + 1}`} className="gallery-image" />
                </div>
              </motion.div>
            )})}
          </div>
        </section>

        {/* --- COUNTDOWN SECTION --- */}
        <section className="countdown-section">
          <div className="container">
            <FadeIn>
              <div className="uppercase-mono">The Big Day</div>
              <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Counting Down</h2>
            </FadeIn>
            <Countdown targetDate={weddingDate} />
          </div>
        </section>

        {/* --- EVENT DETAILS --- */}
        <section className="section container">
          <FadeIn>
            <div className="text-center">
              <div className="uppercase-mono text-accent">When & Where</div>
              <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>The Celebration</h2>
            </div>
          </FadeIn>

          <div className="event-cards">
            {/* Ceremony */}
            <FadeIn delay={0.2}>
              <div className="event-card">
                <CalendarHeart className="event-icon" size={40} strokeWidth={1.5} />
                <h3 className="event-title">The Ceremony</h3>
                <div className="event-time">
                  <Clock size={16} className="inline mr-2" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} /> 
                  10:00 AM
                </div>
                <div className="event-address">
                  <strong>Bole Medhane Alem Cathedral</strong><br />
                  Cameroon Street<br />
                  Addis Ababa, Ethiopia
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Bole+Medhane+Alem+Cathedral,+Addis+Ababa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline" 
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <MapPin size={16} /> View Map
                </a>
              </div>
            </FadeIn>

            {/* Reception */}
            <FadeIn delay={0.4}>
              <div className="event-card">
                <GlassWater className="event-icon" size={40} strokeWidth={1.5} />
                <h3 className="event-title">The Reception</h3>
                <div className="event-time">
                  <Clock size={16} className="inline mr-2" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} /> 
                  6:00 PM
                </div>
                <div className="event-address">
                  <strong>Ethiopian Skylight Hotel</strong><br />
                  Bole Road<br />
                  Addis Ababa, Ethiopia
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Ethiopian+Skylight+Hotel,+Addis+Ababa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline" 
                >
                  <MapPin size={16} /> View Map
                </a>
              </div>
            </FadeIn>
          </div>
          <SectionDivider />
        </section>

        {/* --- FOOTER --- */}
        <footer className="footer">
          <FadeIn>
            <img src={sealImg} alt="Seal Logo" style={{ width: '60px', height: '60px', marginBottom: '1rem', filter: 'brightness(0.9)' }} />
            <div className="footer-names" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Kalkidan & Beteab</div>
            <div className="uppercase-mono" style={{ opacity: 0.7, margin: '1.5rem 0' }}>We can't wait to celebrate with you</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>
              © {new Date().getFullYear()} Kalkidan & Beteab. All Rights Reserved.
            </div>
          </FadeIn>
        </footer>
      </main>
    </>
  );
}

export default App;

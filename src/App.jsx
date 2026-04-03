import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, CalendarHeart, Clock, GlassWater } from 'lucide-react';
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

// Components
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
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

function EnvelopeScreen({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isCracked, setIsCracked] = useState(false);

  const handleSealClick = () => {
    setIsCracked(true);
    
    // Slow camera push in and flap opening sequence
    setTimeout(() => {
      setIsOpening(true);
    }, 800); // Small pause after cracking

    // Very slow cinematic reveal
    setTimeout(() => {
      onOpen();
    }, 6500); 
  };

  return (
    <motion.div 
      className="envelope-overlay"
      initial={{ opacity: 1, scale: 1 }}
      animate={isOpening ? { scale: 1.15 } : (isCracked ? { scale: 1.05 } : { scale: 1 })}
      transition={{ duration: 6, ease: "easeOut" }}
      exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)', transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <div className="envelope-wrapper">
        <div className="envelope">
          {/* Soft Natural Light Overlay */}
          <div className="envelope-light"></div>
          
          {/* Back of envelope */}
          <motion.div 
            className="envelope-back"
            animate={isOpening ? { filter: 'blur(4px)' } : { filter: 'blur(0px)' }}
            transition={{ duration: 2, delay: 1 }}
          ></motion.div>



          {/* Bottom pocket of envelope */}
          <motion.div 
            className="envelope-pocket"
            animate={isOpening ? { filter: 'blur(3px)' } : { filter: 'blur(0px)' }}
            transition={{ duration: 2, delay: 1.5 }}
          ></motion.div>
          
          {/* Top cover flap */}
          <motion.div 
            className="envelope-flap"
            initial={{ rotateX: 0, zIndex: 4 }}
            animate={isOpening ? { rotateX: 180, zIndex: 1, filter: 'blur(3px)' } : { rotateX: 0, zIndex: 4, filter: 'blur(0px)' }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Red Wax Seal */}
          <AnimatePresence>
            {!isCracked ? (
              <motion.div 
                key="seal-intact"
                className="wax-seal"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                onClick={handleSealClick}
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                K&B
              </motion.div>
            ) : (
              <>
                {/* Left cracked half */}
                <motion.div
                  key="seal-crack-left"
                  className="wax-seal"
                  initial={{ clipPath: 'polygon(0 0, 50% 0, 40% 30%, 60% 70%, 50% 100%, 0 100%)' }}
                  animate={{ x: -40, y: 40, opacity: 0, rotate: -25, scale: 0.9 }}
                  transition={{ duration: 1.5, ease: "easeIn" }}
                  style={{ pointerEvents: 'none', filter: 'drop-shadow(-5px 5px 5px rgba(0,0,0,0.5))' }}
                >
                  K&B
                </motion.div>
                {/* Right cracked half */}
                <motion.div
                  key="seal-crack-right"
                  className="wax-seal"
                  initial={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 60% 70%, 40% 30%)' }}
                  animate={{ x: 40, y: 40, opacity: 0, rotate: 25, scale: 0.9 }}
                  transition={{ duration: 1.5, ease: "easeIn" }}
                  style={{ pointerEvents: 'none', filter: 'drop-shadow(5px 5px 5px rgba(0,0,0,0.5))' }}
                >
                  K&B
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  const [showInvite, setShowInvite] = useState(false);
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
        {!showInvite && <EnvelopeScreen onOpen={() => setShowInvite(true)} />}
      </AnimatePresence>

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
            src={heroImg} 
            alt="Majestic Ethiopian Orthodox Church" 
            className="hero-bg"
          />
          <div className="hero-overlay"></div>
          
          <motion.div style={{ opacity: heroOpacity }} className="hero-content">
            <FadeIn delay={0.2}>
              <div className="hero-date">October 15, 2026</div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <h1 className="hero-names" style={{ fontSize: '4.5rem' }}>
                Kalkidan <span>&</span> Beteab
              </h1>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div className="hero-subtitle">Are getting married</div>
            </FadeIn>
          </motion.div>
        </section>

        {/* --- OUR STORY / INTRODUCTION --- */}
        <section className="section container">
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
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>A Love Story</h2>
              </FadeIn>
              <FadeIn delay={0.4}>
                <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                  We met under the twinkling lights of a crowded city, two paths converging in the most unexpected way. Since that day, every moment has been an adventure. We are thrilled to invite you to celebrate the next chapter of our story with us.
                </p>
                <h3 className="script-font" style={{ fontSize: '3rem', marginTop: '2rem', color: 'var(--color-text-main)' }}>K & B</h3>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- GALLERY SECTION --- */}
        <section className="section container">
          <FadeIn>
            <div className="text-center">
              <div className="uppercase-mono text-accent">Captured Moments</div>
              <h2 style={{ fontSize: '3.5rem', margin: '1rem 0' }}>Our Gallery</h2>
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
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <MapPin size={16} /> View Map
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="footer">
          <FadeIn>
            <div className="footer-initials">K & B</div>
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

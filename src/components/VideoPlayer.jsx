import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, Volume1, VolumeX, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import placeholderImg from "../assets/0A3A7334.jpg";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({ value, onChange, style }) => {
  return (
    <motion.div
      style={{
        position: 'relative',
        height: '4px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '9999px',
        cursor: 'pointer',
        ...style
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '9999px',
          width: `${value}%`
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

const Button = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? '#111111d1' : 'transparent',
      border: 'none',
      color: 'white',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#111111d1'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    {children}
  </button>
);

const VideoPlayer = ({ src, t, isComingSoon = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      const newVolume = value / 100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (videoRef.current && videoRef.current.duration) {
      const time = (value / 100) * videoRef.current.duration;
      if (isFinite(time)) {
        videoRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const setSpeed = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const comingSoonText = t?.video?.comingSoon || "Coming Soon";
  const comingSoonSub = t?.video?.comingSoonSub;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '56rem',
        margin: '0 auto',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        backgroundColor: '#11111198',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => !isComingSoon && setShowControls(true)}
      onMouseLeave={() => !isComingSoon && setShowControls(false)}
    >
      <video
        ref={videoRef}
        style={{ 
          width: '100%', 
          aspectRatio: '16/9',
          display: 'block', 
          cursor: isComingSoon ? 'default' : 'pointer',
          filter: isComingSoon ? 'blur(3px)' : 'none',
          objectFit: 'cover'
        }}
        onTimeUpdate={handleTimeUpdate}
        src={isComingSoon ? undefined : src}
        poster={placeholderImg}
        onClick={isComingSoon ? undefined : togglePlay}
        loop
      />

      {isComingSoon && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(58, 11, 20, 0.75) 0%, rgba(26, 3, 7, 0.9) 100%)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          {/* Pulsing Film Icon with Gold Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 20px rgba(212, 175, 55, 0.2)",
                "0 0 35px rgba(212, 175, 55, 0.5)",
                "0 0 20px rgba(212, 175, 55, 0.2)"
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(58, 11, 20, 0.6)',
              border: '2px solid var(--color-accent, #D4AF37)',
              marginBottom: '1.25rem',
              color: 'var(--color-accent, #D4AF37)'
            }}
          >
            <Film size={32} strokeWidth={1.5} />
          </motion.div>

          {/* Coming Soon Title */}
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              letterSpacing: '0.15em',
              marginBottom: '0.5rem',
              color: 'var(--color-accent, #D4AF37)',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {comingSoonText}
          </h3>

          {/* Divider line */}
          {comingSoonSub && (
            <div 
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--color-accent, #D4AF37), transparent)',
                marginBottom: '1rem'
              }}
            />
          )}

          {/* Subtitle */}
          {comingSoonSub && (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                maxWidth: '28rem',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 300,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {comingSoonSub}
            </p>
          )}
        </div>
      )}

      {!isComingSoon && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                maxWidth: '36rem',
                margin: '0.5rem auto',
                padding: '1rem',
                backgroundColor: '#11111198',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                zIndex: 50,
              }}
              initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'white', fontSize: '0.875rem' }}>{formatTime(currentTime)}</span>
                <CustomSlider value={progress} onChange={handleSeek} style={{ flex: 1 }} />
                <span style={{ color: 'white', fontSize: '0.875rem' }}>{formatTime(duration)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button onClick={togglePlay}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                  </motion.div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button onClick={toggleMute}>
                        {isMuted ? <VolumeX size={20} /> : volume > 0.5 ? <Volume2 size={20} /> : <Volume1 size={20} />}
                      </Button>
                    </motion.div>
                    <div style={{ width: '6rem' }}>
                      <CustomSlider value={volume * 100} onChange={handleVolumeChange} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={speed}>
                      <Button onClick={() => setSpeed(speed)} active={playbackSpeed === speed}>
                        {speed}x
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default VideoPlayer;

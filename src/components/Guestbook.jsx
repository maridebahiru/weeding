import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart } from 'lucide-react';

export default function Guestbook({ lang, t }) {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [guestWish, setGuestWish] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch Wishes on Mount
  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = [];
      snapshot.forEach((doc) => wishesData.push({ id: doc.id, ...doc.data() }));
      setWishes(wishesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching wishes: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Send Wish
  const handleSendWish = async (e) => {
    e.preventDefault();
    if (guestName.trim() && guestWish.trim()) {
      setSubmitting(true);
      try {
        await addDoc(collection(db, "wishes"), {
          name: guestName.trim(),
          text: guestWish.trim(),
          createdAt: serverTimestamp()
        });
        setGuestName('');
        setGuestWish('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      } catch (error) {
        console.error("Error adding wish: ", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Helper to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (lang === 'am') {
      return date.toLocaleDateString('am-ET', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const gt = t.guestbook;

  return (
    <div className="guestbook-grid">
      {/* Form Column */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="signboard-wish-section">
          <form className="wish-form" onSubmit={handleSendWish}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Heart size={20} className="text-accent" style={{ color: 'var(--color-accent)' }} fill="var(--color-accent)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-primary)' }}>{gt.subtitle}</h3>
            </div>
            
            <div className="wish-input-wrapper">
              <input
                type="text"
                className="wish-input"
                placeholder={gt.namePlaceholder}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="wish-input-wrapper">
              <textarea
                className="wish-textarea"
                placeholder={gt.wishPlaceholder}
                value={guestWish}
                onChange={(e) => setGuestWish(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-animated" 
              disabled={submitting}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                borderRadius: '4px' 
              }}
            >
              <Send size={14} />
              {submitting ? gt.submittingBtn : gt.submitBtn}
            </button>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    marginTop: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500
                  }}
                >
                  ✦ {gt.successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>

      {/* List Column */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="wishes-list-container">
          {loading ? (
            <div className="guestbook-loading">
              <p>{gt.loading}</p>
            </div>
          ) : wishes.length === 0 ? (
            <div className="guestbook-empty">
              <p>{gt.noWishes}</p>
            </div>
          ) : (
            <div className="wishes-list">
              <AnimatePresence initial={false}>
                {wishes.map((wish, index) => (
                  <motion.div
                    key={wish.id}
                    className="wish-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
                  >
                    <p className="wish-text">“ {wish.text} ”</p>
                    <p className="wish-author">— {wish.name}</p>
                    {wish.createdAt && (
                      <p className="wish-date">{formatDate(wish.createdAt)}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

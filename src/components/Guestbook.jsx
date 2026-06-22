import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Guestbook({ lang, t }) {
  const [guestName, setGuestName] = useState('');
  const [guestWish, setGuestWish] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWish, setSubmittedWish] = useState(null);

  // Check for existing submission in localStorage on mount
  useEffect(() => {
    const savedWish = localStorage.getItem('wedding_submitted_wish');
    if (savedWish) {
      try {
        setSubmittedWish(JSON.parse(savedWish));
      } catch (e) {
        console.error("Error parsing stored wish:", e);
      }
    }
  }, []);

  // Send Wish to Firestore
  const handleSendWish = async (e) => {
    e.preventDefault();
    if (guestName.trim() && guestWish.trim()) {
      setSubmitting(true);
      try {
        const wishData = {
          name: guestName.trim(),
          text: guestWish.trim(),
          createdAt: new Date().toISOString()
        };

        // Save to Firestore
        await addDoc(collection(db, "wishes"), {
          name: wishData.name,
          text: wishData.text,
          createdAt: serverTimestamp()
        });

        // Save to localStorage
        localStorage.setItem('wedding_submitted_wish', JSON.stringify(wishData));
        
        setSubmittedWish(wishData);
        setGuestName('');
        setGuestWish('');
        setSubmitted(true);
      } catch (error) {
        console.error("Error adding wish: ", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Allow guests to reset and submit another wish
  const handleWriteAnother = () => {
    localStorage.removeItem('wedding_submitted_wish');
    setSubmittedWish(null);
    setSubmitted(false);
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (lang === 'am') {
      return date.toLocaleDateString('am-ET', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const gt = t.guestbook;

  return (
    <div className="guestbook-centered-container">
      <AnimatePresence mode="wait">
        {submittedWish ? (
          /* Confirmation / Thank You Screen */
          <motion.div
            key="confirmation"
            className="wish-confirmation-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="confirmation-header">
              <CheckCircle2 size={42} className="confirmation-icon" />
              <h3>{lang === 'am' ? 'የደስታ መግለጫዎ ደርሶናል!' : 'Thank you for your blessings!'}</h3>
              <p className="confirmation-subheader">{gt.successMsg}</p>
            </div>

            <div className="confirmed-wish-display">
              <span className="quote-mark open">“</span>
              <p className="confirmed-wish-text">{submittedWish.text}</p>
              <span className="quote-mark close">”</span>
              
              <div className="confirmed-wish-meta">
                <span className="confirmed-author">— {submittedWish.name}</span>
                <span className="confirmed-date">{formatDate(submittedWish.createdAt)}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button 
                onClick={handleWriteAnother} 
                className="btn btn-outline btn-another-wish"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '0.8rem 2rem', 
                  fontSize: '0.7rem' 
                }}
              >
                <RotateCcw size={12} />
                {lang === 'am' ? 'ሌላ ምኞት ይጻፉ' : 'Write another wish'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Wish Submission Form Screen */
          <motion.div
            key="wish-form"
            className="guestbook-form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <form className="wish-form" onSubmit={handleSendWish}>
              <div className="form-header-icon">
                <Heart size={24} className="text-accent" fill="var(--color-accent)" />
                <h3 className="form-title">{gt.subtitle}</h3>
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
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

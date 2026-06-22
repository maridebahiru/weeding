import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Printer, Heart, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all wishes for the admin
  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = [];
      snapshot.forEach((doc) => {
        wishesData.push({ id: doc.id, ...doc.data() });
      });
      setWishes(wishesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching wishes for admin: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page-container">
      {/* Top Navigation / Action Bar */}
      <header className="admin-header no-print">
        <div className="admin-header-content">
          <div className="admin-title-area">
            <a href="/" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Invite</span>
            </a>
            <h1>Wishes Dashboard</h1>
            <p className="admin-subtitle">Kalkidan & Beteab's Wedding Guestbook</p>
          </div>
          
          <div className="admin-actions">
            <button onClick={handlePrint} className="btn btn-print">
              <Printer size={16} />
              <span>Print Guestbook</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Stats Section */}
      <section className="admin-stats no-print">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Heart size={24} className="stat-icon" fill="var(--color-primary)" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Wishes</span>
            <span className="stat-value">{wishes.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <MessageSquare size={24} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Latest Contributor</span>
            <span className="stat-value text-truncate">
              {wishes.length > 0 ? wishes[0].name : 'No wishes yet'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <RefreshCw size={20} className="stat-icon spin-slow" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Status</span>
            <span className="stat-value text-live">Live Syncing</span>
          </div>
        </div>
      </section>

      {/* Main Wishes Display for Admin */}
      <main className="admin-main">
        {/* Printable Header - visible only when printing */}
        <div className="print-only print-header">
          <div className="print-seal">✦</div>
          <h1>WISHES GUESTBOOK</h1>
          <p className="print-wedding-names">Kalkidan & Beteab's Wedding</p>
          <p className="print-date">October 15, 2026</p>
          <div className="print-stats">Total Wishes: {wishes.length}</div>
          <hr className="print-divider" />
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading guestbook wishes...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="admin-empty">
            <Heart size={48} className="empty-icon" />
            <h3>No wishes submitted yet</h3>
            <p>Once guests submit wishes on the landing page, they will show up here immediately.</p>
          </div>
        ) : (
          <div className="admin-wishes-grid">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                className="admin-wish-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
              >
                <div className="wish-card-decor">✦</div>
                <p className="admin-wish-text">“ {wish.text} ”</p>
                <div className="admin-wish-meta">
                  <span className="admin-wish-author">— {wish.name}</span>
                  {wish.createdAt && (
                    <span className="admin-wish-date">{formatDate(wish.createdAt)}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Printable Footer */}
        <div className="print-only print-footer">
          <hr className="print-divider" />
          <p>Thank you to all our guests for your beautiful wishes.</p>
          <p>© {new Date().getFullYear()} Kalkidan & Beteab. Created with love.</p>
        </div>
      </main>
    </div>
  );
}

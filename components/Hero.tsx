import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import type { HeroBackground } from '../types';
import { transformHero } from '../utils/transformHero';

interface HeroProps {
  t: {
    title: string;
    subtitle: string;
    cta: string;
  };
  isRTL: boolean;
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const Hero: React.FC<HeroProps> = ({ t, isRTL, lang }) => {
  const [hero, setHero] = useState<HeroBackground | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHero();
    const timer = setTimeout(() => setMounted(true), 100);

    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_background')
        .select('*')
        .eq('is_active', true)
        .single();
      if (error) throw error;
      if (data) setHero(transformHero(data));
    } catch (err) {
      console.error('Error fetching hero:', err);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (field: 'title' | 'subtitle' | 'cta_text' | 'cta_link') => {
    if (!hero) {
      if (field === 'cta_link') return '#products';
      if (field === 'cta_text') return t.cta || '';
      return t[field as 'title' | 'subtitle'] || '';
    }
    const langKey = `${field}_${lang}` as keyof typeof hero;
    return (hero[langKey] as string) || (hero[`${field}_en` as keyof typeof hero] as string) || '';
  };

  const bgImage = hero?.image_url || 'https://images.unsplash.com/photo-1534234828563-02598db89e1e?w=1920&h=1080&fit=crop';

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ background: '#0a1f0e' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#4ade80',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)} }`}</style>
      </section>
    );
  }

  const title = getContent('title') || t.title;
  const subtitle = getContent('subtitle') || t.subtitle;
  const cta = getContent('cta_text') || t.cta;
  const ctaLink = hero?.cta_link || '#products';

  // Split title into words for staggered animation
  const words = title.split(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tifinagh&display=swap');

        [lang="ama"], .lang-ama {
          font-family: 'Noto Sans Tifinagh', sans-serif !important;
        }

        :root {
          --green-deep: #0d2b10;
          --green-mid: #1a4d1e;
          --green-accent: #2d7d32;
          --green-bright: #4caf50;
          --gold: #c9a84c;
          --cream: #f5f0e8;
          --white: #ffffff;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-bg {
          position: absolute;
          inset: -20%;
          background-size: cover;
          background-position: center;
          will-change: transform;
          transition: transform 0s;
        }

        .hero-overlay-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(13, 43, 16, 0.88) 0%,
            rgba(13, 43, 16, 0.6) 40%,
            rgba(13, 43, 16, 0.3) 70%,
            rgba(13, 43, 16, 0.5) 100%
          );
          z-index: 1;
        }

        /* Decorative geometric shapes */
        .hero-shape-circle {
          position: absolute;
          border-radius: 50%;
          z-index: 2;
          pointer-events: none;
        }

        .shape-1 {
          width: 500px;
          height: 500px;
          border: 1px solid rgba(201, 168, 76, 0.15);
          top: -100px;
          right: -100px;
          animation: rotateSlow 40s linear infinite;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          border: 1px solid rgba(76, 175, 80, 0.2);
          top: 50px;
          right: 50px;
          animation: rotateSlow 30s linear infinite reverse;
        }

        .shape-3 {
          width: 800px;
          height: 800px;
          border: 1px solid rgba(201, 168, 76, 0.08);
          bottom: -200px;
          left: -200px;
          animation: rotateSlow 60s linear infinite;
        }

        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Diagonal green stripe */
        .hero-stripe {
          position: absolute;
          top: 0;
          left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(13, 43, 16, 0.95) 0%,
            rgba(13, 43, 16, 0.7) 70%,
            transparent 100%
          );
          clip-path: polygon(0 0, 85% 0, 65% 100%, 0 100%);
          z-index: 2;
        }

        /* Grain texture overlay */
        .hero-grain {
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        /* Content */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          direction: ${lang === 'ar' || lang === 'ama' ? 'rtl' : 'ltr'};
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(20px);
          animation: ${mounted ? 'fadeUp 0.6s ease forwards 0.2s' : 'none'};
        }

        .hero-eyebrow-line {
          width: 40px;
          height: 2px;
          background: var(--gold);
        }

        .hero-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 900;
          line-height: 1.0;
          color: var(--white);
          margin-bottom: 28px;
          max-width: 680px;
        }

        .hero-title-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) rotate(-2deg);
          margin-right: 0.2em;
        }

        .hero-title-word.animated {
          animation: wordReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes wordReveal {
          to { opacity: 1; transform: translateY(0) rotate(0deg); }
        }

        .hero-title-accent {
          color: var(--gold);
          font-style: italic;
          position: relative;
        }

        .hero-title-accent::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          animation: ${mounted ? 'underlineGrow 0.8s ease forwards 1.2s' : 'none'};
        }

        @keyframes underlineGrow {
          to { transform: scaleX(1); }
        }

        .hero-subtitle {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
          margin-bottom: 44px;
          opacity: 0;
          transform: translateY(20px);
          animation: ${mounted ? 'fadeUp 0.6s ease forwards 0.9s' : 'none'};
          letter-spacing: 0.3px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 28px;
          opacity: 0;
          transform: translateY(20px);
          animation: ${mounted ? 'fadeUp 0.6s ease forwards 1.1s' : 'none'};
          flex-wrap: wrap;
        }

        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          background: var(--gold);
          color: var(--green-deep);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hero-cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.2);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .hero-cta-primary:hover::before {
          transform: translateX(0);
        }

        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201, 168, 76, 0.4);
        }

        .hero-cta-arrow {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .hero-cta-primary:hover .hero-cta-arrow {
          transform: translateX(4px);
        }

        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 0;
          color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 1px;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }

        .hero-cta-secondary:hover {
          color: white;
          border-bottom-color: white;
          gap: 16px;
        }

        /* Stats bar */
        .hero-stats {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          display: flex;
          align-items: stretch;
          opacity: 0;
          animation: ${mounted ? 'fadeUp 0.6s ease forwards 1.4s' : 'none'};
        }

        .hero-stat-item {
          flex: 1;
          padding: 24px 36px;
          background: rgba(13, 43, 16, 0.85);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(201, 168, 76, 0.2);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: background 0.3s ease;
        }

        .hero-stat-item:last-child {
          border-right: none;
        }

        .hero-stat-item:hover {
          background: rgba(45, 125, 50, 0.4);
        }

        .hero-stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
        }

        .hero-stat-label {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          line-height: 1.4;
          max-width: 90px;
        }

        .hero-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(201, 168, 76, 0.3);
          flex-shrink: 0;
        }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute;
          bottom: 120px;
          right: 48px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: ${mounted ? 'fadeIn 0.6s ease forwards 1.6s' : 'none'};
        }

        .hero-scroll-text {
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          writing-mode: vertical-rl;
        }

        .hero-scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(201,168,76,0.6), transparent);
          animation: scrollLineAnim 1.5s ease-in-out infinite;
        }

        @keyframes scrollLineAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Badge */
        .hero-badge {
          position: absolute;
          top: 50%;
          right: 80px;
          transform: translateY(-50%);
          z-index: 10;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.3);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          opacity: 0;
          animation: ${mounted ? 'fadeIn 0.8s ease forwards 1.3s' : 'none'};
        }

        .hero-badge-number {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
        }

        .hero-badge-text {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          text-align: center;
          line-height: 1.4;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* Leaf decoration */
        .hero-leaf {
          position: absolute;
          z-index: 4;
          pointer-events: none;
          opacity: 0.12;
        }

        @media (max-width: 768px) {
          .hero-content { padding: 0 24px; align-items: center; text-align: center; }
          .hero-eyebrow { justify-content: center; }
          .hero-subtitle { text-align: center; }
          .hero-actions { justify-content: center; }
          .hero-badge { display: none; }
          .hero-scroll { display: none; }
          .hero-stats { flex-wrap: wrap; }
          .hero-stat-item { flex: 0 0 50%; }
          .hero-stripe { width: 100%; clip-path: none; }
          .hero-title { font-size: 48px; max-width: 100%; }
        }
      `}</style>

      <section className="hero-section">
        {/* Parallax Background */}
        <div
          ref={parallaxRef}
          className="hero-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Overlays */}
        <div className="hero-overlay-base" />
        {hero?.overlay_enabled && (
          <div className="absolute inset-0 z-1" style={{ backgroundColor: hero.overlay_color, opacity: 0.3 }} />
        )}
        <div className="hero-stripe" />
        <div className="hero-grain" />

        {/* Geometric Circles */}
        <div className="hero-shape-circle shape-1" />
        <div className="hero-shape-circle shape-2" />
        <div className="hero-shape-circle shape-3" />

        {/* Leaf SVG decorations */}
        <svg className="hero-leaf" style={{ top: '10%', left: '-40px', width: 300 }} viewBox="0 0 200 300" fill="none">
          <path d="M100 0 C150 50, 180 100, 100 300 C20 100, 50 50, 100 0Z" fill="#4caf50"/>
        </svg>
        <svg className="hero-leaf" style={{ bottom: '15%', right: '10%', width: 200, transform: 'rotate(120deg)' }} viewBox="0 0 200 300" fill="none">
          <path d="M100 0 C150 50, 180 100, 100 300 C20 100, 50 50, 100 0Z" fill="#c9a84c"/>
        </svg>

        {/* Main Content */}
        <div className="hero-content" style={{ paddingBottom: '100px', paddingTop: '100px' }}>
          {/* Eyebrow */}
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">
              {lang === 'ar' ? 'تعاونية إيميري' :
               lang === 'fr' ? 'Coopérative Agricole' :
               'Agricultural Cooperative'}
            </span>
          </div>

          {/* Title with staggered word animation */}
          <h1 className={`hero-title ${lang === 'ama' ? 'lang-ama' : ''}`}
              style={lang === 'ama' ? { fontFamily: "'Noto Sans Tifinagh', sans-serif", fontStyle: 'normal' } : {}}>
            {words.map((word, i) => {
              const isLastWord = i === words.length - 1;
              return (
                <span
                  key={i}
                  className={`hero-title-word ${mounted ? 'animated' : ''} ${isLastWord ? 'hero-title-accent' : ''}`}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  {word}
                </span>
              );
            })}
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle"
             style={lang === 'ama' ? { fontFamily: "'Noto Sans Tifinagh', sans-serif" } : {}}>
            {subtitle}
          </p>

          {/* Actions */}
          <div className="hero-actions">
            <a href={ctaLink} className="hero-cta-primary">
              <span>{cta}</span>
              <svg className="hero-cta-arrow" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#about" className="hero-cta-secondary">
              <span>
                {lang === 'ar' ? 'تعرف علينا' :
                 lang === 'fr' ? 'Notre Histoire' :
                 'Our Story'}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="hero-badge">
          <span className="hero-badge-number">15+</span>
          <span className="hero-badge-text">
            {lang === 'ar' ? 'سنة من\nالخبرة' :
             lang === 'fr' ? 'ans\nd\'expérience' :
             'years\nof craft'}
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll">
          <span className="hero-scroll-text">Scroll</span>
          <div className="hero-scroll-line" />
        </div>

        {/* Stats Bar */}
        <div className="hero-stats">
          {[
            { number: '500+', label: lang === 'ar' ? 'منتج طبيعي' : lang === 'fr' ? 'Produits naturels' : 'Natural Products' },
            { number: '12', label: lang === 'ar' ? 'مجتمع محلي' : lang === 'fr' ? 'Communautés locales' : 'Local Communities' },
            { number: '100%', label: lang === 'ar' ? 'عضوي ونقي' : lang === 'fr' ? 'Biologique et pur' : 'Organic & Pure' },
          ].map((stat, i) => (
            <div key={i} className="hero-stat-item">
              <span className="hero-stat-number">{stat.number}</span>
              <div className="hero-stat-divider" />
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
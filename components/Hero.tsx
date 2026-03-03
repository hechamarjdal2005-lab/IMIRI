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
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.1)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(timer); };
  }, []);

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_background').select('*').eq('is_active', true).single();
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
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1f0a' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: '#80C756',
              animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}`}</style>
      </section>
    );
  }

  const title = getContent('title') || t.title;
  const subtitle = getContent('subtitle') || t.subtitle;
  const cta = getContent('cta_text') || t.cta;
  const ctaLink = hero?.cta_link || '#products';
  const isRtl = lang === 'ar' || lang === 'ama';
  const words = title.split(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Noto+Sans+Tifinagh&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --font-cocktail: 'Baloo 2', cursive;
          --font-ama: 'Noto Sans Tifinagh', sans-serif;
          --green: #80C756;
          --green-light: #9ed96a;
          --green-glow: rgba(128,199,86,0.4);
          --dark: #0d1f08;
          --dark-bg: #0f1f0a;
        }

        .h-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          font-family: var(--font-cocktail);
        }

        .h-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transform: scale(1.1);
          will-change: transform;
        }

        .h-ov1 {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(8, 20, 5, 0.40) 0%,
            rgba(8, 20, 5, 0.28) 40%,
            rgba(8, 20, 5, 0.75) 100%
          );
          z-index: 1;
        }

        .h-ov2 {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 20% 10%, rgba(128,199,86,0.1) 0%, transparent 70%);
          z-index: 2;
        }

        .h-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 110px 24px 150px;
          direction: ${isRtl ? 'rtl' : 'ltr'};
        }

        .h-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 20px;
          background: rgba(128,199,86,0.15);
          border: 1px solid rgba(128,199,86,0.32);
          border-radius: 100px;
          backdrop-filter: blur(8px);
          margin-bottom: 30px;
          opacity: 0;
          transform: translateY(14px);
          animation: ${mounted ? 'up 0.55s cubic-bezier(0.16,1,0.3,1) forwards 0.1s' : 'none'};
        }

        .h-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--green);
          animation: blink 2.2s ease-in-out infinite;
        }

        @keyframes blink { 0%,100%{opacity:.45} 50%{opacity:1} }

        .h-eyebrow-text {
          font-family: var(--font-cocktail);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--green-light);
        }

        .h-title {
          font-family: var(--font-cocktail);
          font-size: clamp(44px, 8vw, 100px);
          font-weight: 800;
          line-height: 1.08;
          color: white;
          letter-spacing: -0.01em;
          margin-bottom: 22px;
          max-width: 900px;
        }

        .h-title-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(36px);
          margin-right: 0.22em;
        }

        .h-title-word.go {
          animation: up 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .h-title-em {
          color: var(--green);
          position: relative;
        }

        .h-title-em::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, var(--green), rgba(128,199,86,0.2));
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          animation: ${mounted ? 'underline 0.5s ease forwards 1.2s' : 'none'};
        }

        @keyframes underline { to { transform: scaleX(1); } }

        .h-divider {
          width: 36px; height: 2px;
          background: linear-gradient(to right, rgba(128,199,86,0.85), rgba(128,199,86,0.15));
          border-radius: 2px;
          margin: 0 auto 24px;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: center;
          animation: ${mounted ? 'line 0.6s ease forwards 0.95s' : 'none'};
        }

        @keyframes line { to { opacity:1; transform:scaleX(1); } }

        .h-sub {
          font-family: var(--font-cocktail);
          font-size: clamp(14px, 1.8vw, 17px);
          font-weight: 400;
          line-height: 1.9;
          color: rgba(255,255,255,0.65);
          max-width: 480px;
          margin-bottom: 44px;
          opacity: 0;
          transform: translateY(14px);
          animation: ${mounted ? 'up 0.6s ease forwards 0.85s' : 'none'};
        }

        .h-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          transform: translateY(14px);
          animation: ${mounted ? 'up 0.6s ease forwards 1.05s' : 'none'};
        }

        .h-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          background: var(--green);
          color: var(--dark);
          font-family: var(--font-cocktail);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 100px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 8px 32px var(--green-glow), 0 2px 8px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .h-cta::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.22), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .h-cta:hover::after { opacity: 1; }

        .h-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 50px rgba(128,199,86,0.5), 0 4px 14px rgba(0,0,0,0.25);
          background: #8fd45f;
        }

        .h-cta-ico {
          width: 20px; height: 20px;
          background: rgba(13,31,8,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .h-cta:hover .h-cta-ico { transform: translateX(3px); }

        .h-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 100px;
          color: rgba(255,255,255,0.82);
          font-family: var(--font-cocktail);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.07);
          transition: all 0.3s ease;
        }

        .h-ghost:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.48);
          color: white;
          transform: translateY(-2px);
        }

        .h-badge {
          position: absolute;
          top: 50%;
          right: 52px;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 20px;
          padding: 22px 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          opacity: 0;
          animation: ${mounted ? 'up 0.6s ease forwards 1.25s' : 'none'};
        }

        .h-badge-n {
          font-family: var(--font-cocktail);
          font-size: 42px;
          font-weight: 800;
          color: var(--green);
          line-height: 1;
        }

        .h-badge-t {
          font-family: var(--font-cocktail);
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.6;
        }

        .h-scroll {
          position: absolute;
          bottom: 40px;
          right: 44px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: ${mounted ? 'fadeIn 0.6s ease forwards 1.6s' : 'none'};
        }

        .h-scroll-track {
          width: 1px; height: 52px;
          background: rgba(255,255,255,0.14);
          position: relative;
          overflow: hidden;
          border-radius: 1px;
        }

        .h-scroll-run {
          position: absolute;
          top: -40%; left: 0; right: 0;
          height: 40%;
          background: var(--green);
          border-radius: 1px;
          animation: scrollRun 1.8s ease-in-out infinite;
        }

        @keyframes scrollRun { 0%{top:-40%} 100%{top:140%} }

        .h-scroll-lbl {
          font-family: var(--font-cocktail);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.32);
          writing-mode: vertical-rl;
        }

        @keyframes up    { to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { to { opacity: 1; } }

        .lang-ama {
          font-family: var(--font-ama) !important;
          font-weight: 400 !important;
        }

        @media (max-width: 768px) {
          .h-content { padding: 96px 20px 120px; }
          .h-title { font-size: clamp(36px, 10vw, 58px); }
          .h-sub { max-width: 100%; font-size: 14px; }
          .h-actions { gap: 12px; }
          .h-cta, .h-ghost { padding: 12px 24px; font-size: 13px; }
          .h-badge { display: none; }
          .h-scroll { display: none; }
        }

        @media (max-width: 420px) {
          .h-actions { flex-direction: column; width: 100%; }
          .h-cta, .h-ghost { width: 100%; justify-content: center; }
        }
      `}</style>

      <section className="h-wrap">
        <div ref={parallaxRef} className="h-bg" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="h-ov1" />
        <div className="h-ov2" />
        {hero?.overlay_enabled && (
          <div style={{ position:'absolute', inset:0, zIndex:2, backgroundColor: hero.overlay_color, opacity: 0.22 }} />
        )}

        <div className="h-content">
          <div className="h-eyebrow">
            <div className="h-eyebrow-dot" />
            <span className="h-eyebrow-text">
              {lang === 'ar' ? 'تعاونية إيميري الزراعية' :
               lang === 'fr' ? 'Compérative Agricole Imiri' :
               'Imiri Agricultural Comperative'}
            </span>
          </div>

          <h1
            className={`h-title ${lang === 'ama' ? 'lang-ama' : ''}`}
            style={lang === 'ama' ? { fontFamily: "'Noto Sans Tifinagh', sans-serif" } : {}}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className={`h-title-word${mounted ? ' go' : ''}${i === words.length - 1 ? ' h-title-em' : ''}`}
                style={{ animationDelay: `${0.3 + i * 0.09}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <div className="h-divider" />

          <p
            className="h-sub"
            style={lang === 'ama' ? { fontFamily: "'Noto Sans Tifinagh', sans-serif" } : {}}
          >
            {subtitle}
          </p>

          <div className="h-actions">
            <a href={ctaLink} className="h-cta">
              <span>{cta}</span>
              <span className="h-cta-ico">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="#0d1f08" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <a href="#about" className="h-ghost">
              {lang === 'ar' ? 'قصتنا' : lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="h-badge">
          <div className="h-badge-n">15+</div>
          <div className="h-badge-t">
            {lang === 'ar' ? 'سنة خبرة' : lang === 'fr' ? "Ans d'exp." : 'Years of Craft'}
          </div>
        </div>

        <div className="h-scroll">
          <div className="h-scroll-track"><div className="h-scroll-run" /></div>
          <span className="h-scroll-lbl">Scroll</span>
        </div>
      </section>
    </>
  );
};

export default Hero;
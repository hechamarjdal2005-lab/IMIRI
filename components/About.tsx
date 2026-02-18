import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import type { About } from '../types';
import { transformAbout } from '../utils/transformAbout';
import { Leaf, Award, Users, MapPin } from 'lucide-react';

interface AboutProps {
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchAbout();
    const fallback = setTimeout(() => setVisible(true), 300);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(fallback);
        }
      },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      clearTimeout(fallback);
      if (el) observer.unobserve(el);
    };
  }, []);

  const fetchAbout = async () => {
    try {
      const { data, error } = await supabase.from('about').select('*').single();
      if (error) throw error;
      if (data) setAbout(transformAbout(data));
    } catch (err) {
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  const getText = (key: string) => {
    if (!about) return '';
    const suffix = lang === 'en' ? '_en' : lang === 'fr' ? '_fr' : lang === 'ar' ? '_ar' : '_ama';
    return (about as any)[`${key}${suffix}`] ?? (about as any)[`${key}_en`] ?? '';
  };

  const getValueText = (value: any) => {
    const map: Record<string, string> = { en: 'text_en', fr: 'text_fr', ar: 'text_ar', ama: 'text_ama' };
    return value?.[map[lang]] ?? value?.text_en ?? '';
  };

  const getIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      'leaf': <Leaf size={18} strokeWidth={1.5} />,
      'award': <Award size={18} strokeWidth={1.5} />,
      'users': <Users size={18} strokeWidth={1.5} />,
      'map-pin': <MapPin size={18} strokeWidth={1.5} />,
    };
    return map[iconName] ?? <Leaf size={18} strokeWidth={1.5} />;
  };

  if (loading) return (
    <section style={{ padding: '140px 0', background: '#0d2b10' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '12px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%', background: '#c9a84c',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
    </section>
  );

  if (!about) return null;

  const storyTitle = getText('story_title');
  const words = storyTitle.split(' ');
  const breakAt = Math.ceil(words.length / 2);
  const titleLine1 = words.slice(0, breakAt).join(' ');
  const titleLine2 = words.slice(breakAt).join(' ');

  const isRTL = lang === 'ar' || lang === 'ama';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── TOKENS ── */
        :root {
          --ab-deep:    #0a1f0e;
          --ab-dark:    #0d2b10;
          --ab-mid:     #1a4d1e;
          --ab-accent:  #2d7d32;
          --ab-bright:  #4caf50;
          --ab-gold:    #c9a84c;
          --ab-gold-lt: rgba(201,168,76,0.15);
          --ab-gold-br: rgba(201,168,76,0.5);
          --ab-white:   #ffffff;
          --ab-cream:   #f5f0e8;
          --ab-ink:     #0d2b10;
        }

        /* ── KEYFRAMES ── */
        @keyframes ab-up {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ab-left {
          from { opacity:0; transform:translateX(-24px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes ab-right {
          from { opacity:0; transform:translateX(24px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes ab-scale {
          from { opacity:0; transform:scale(0.97); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes ab-line {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes ab-spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes ab-count {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── SECTION ── */
        .ab-section {
          position: relative;
          background: var(--ab-deep);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Grain */
        .ab-grain {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ── DIAGONAL SEPARATOR between left/right ── */
        .ab-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 820px;
        }
        @media (max-width:900px) { .ab-layout { grid-template-columns:1fr; } }

        /* ── LEFT PANEL (dark green) ── */
        .ab-left {
          background: linear-gradient(160deg, var(--ab-dark) 0%, var(--ab-mid) 100%);
          padding: 96px 72px 96px 80px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
          margin-right: -4%;
          z-index: 2;
        }

        /* Concentric gold circles */
        .ab-circle {
          position: absolute; border-radius: 50%;
          pointer-events: none;
          border: 1px solid var(--ab-gold-lt);
          animation: ab-spin linear infinite;
        }
        .ab-circle-1 { width:560px; height:560px; bottom:-200px; right:-200px; animation-duration:80s; }
        .ab-circle-2 { width:380px; height:380px; bottom:-130px; right:-130px; animation-duration:55s; reverse; border-color:rgba(201,168,76,0.08); }
        .ab-circle-3 { width:180px; height:180px; bottom:-20px;  right:-20px;  animation-duration:35s; animation-direction:reverse; border-color:rgba(201,168,76,0.12); }

        /* Ghost watermark */
        .ab-ghost {
          position: absolute; top:24px; right:32px;
          font-family: 'Playfair Display', serif;
          font-size: 10rem; font-weight:900; line-height:1;
          color: rgba(201,168,76,0.05);
          user-select:none; pointer-events:none; letter-spacing:-0.06em;
        }

        /* Tag */
        .ab-tag {
          display:inline-flex; align-items:center; gap:12px;
          margin-bottom:28px;
          opacity:0;
        }
        .ab-tag.vis { animation: ab-left 0.65s 0.1s ease forwards; }

        .ab-tag-dash { width:32px; height:2px; background:var(--ab-gold); }
        .ab-tag-dot  { width:6px;  height:6px; border-radius:50%; background:var(--ab-gold); opacity:0.5; }
        .ab-tag-text {
          font-size:0.65rem; font-weight:500; letter-spacing:0.22em;
          text-transform:uppercase; color:var(--ab-gold);
        }

        /* Heading */
        .ab-heading {
          font-family:'Playfair Display', serif;
          font-size:clamp(2.8rem,4vw,4.2rem);
          font-weight:900; line-height:1.0;
          letter-spacing:-0.03em; color:var(--ab-white);
          margin:0; opacity:0;
          text-shadow:0 2px 12px rgba(0,0,0,0.2);
        }
        .ab-heading.vis { animation: ab-up 0.75s 0.2s ease forwards; }
        .ab-heading-em {
          display:block; color:var(--ab-gold);
          font-style:italic; font-weight:700;
        }

        /* Gold rule */
        .ab-rule {
          width:52px; height:2px;
          background:linear-gradient(to right, var(--ab-gold), rgba(201,168,76,0.2));
          margin:28px 0;
          transform-origin:left; transform:scaleX(0);
          box-shadow:0 2px 8px rgba(201,168,76,0.3);
        }
        .ab-rule.vis { animation: ab-line 0.55s 0.5s ease forwards; }

        /* Description */
        .ab-desc {
          font-size:0.95rem; font-weight:300; line-height:1.9;
          color:rgba(255,255,255,0.75); max-width:380px;
          margin-bottom:44px; opacity:0;
        }
        .ab-desc.vis { animation: ab-up 0.75s 0.35s ease forwards; }

        /* Values */
        .ab-values { opacity:0; }
        .ab-values.vis { animation: ab-up 0.75s 0.5s ease forwards; }

        .ab-val {
          display:flex; align-items:center; gap:16px;
          padding:14px 0;
          border-top:1px solid rgba(255,255,255,0.07);
          transition:padding-left 0.3s ease;
          cursor:default;
        }
        .ab-val:last-child { border-bottom:1px solid rgba(255,255,255,0.07); }
        .ab-val:hover { padding-left:8px; }
        .ab-val:hover .ab-val-icon {
          background:rgba(201,168,76,0.2); color:var(--ab-gold);
        }
        .ab-val:hover .ab-val-text { color:rgba(255,255,255,0.95); }

        .ab-val-icon {
          width:36px; height:36px; min-width:36px;
          border-radius:8px; background:rgba(201,168,76,0.1);
          color:var(--ab-gold);
          display:flex; align-items:center; justify-content:center;
          transition:all 0.25s;
          border:1px solid rgba(201,168,76,0.15);
        }
        .ab-val-text {
          font-size:0.875rem; font-weight:400;
          color:rgba(255,255,255,0.8); line-height:1.45;
          transition:color 0.25s;
        }

        /* ── RIGHT PANEL ── */
        .ab-right {
          display:flex; flex-direction:column;
          background:var(--ab-dark);
          position:relative; z-index:1;
        }

        /* Image */
        .ab-img-wrap {
          flex:1; position:relative; overflow:hidden; opacity:0;
        }
        .ab-img-wrap.vis { animation: ab-scale 0.9s 0.25s ease forwards; }
        .ab-img-wrap img {
          width:100%; height:100%; min-height:520px;
          object-fit:cover; display:block;
          transition:transform 8s ease;
        }
        .ab-img-wrap:hover img { transform:scale(1.04); }

        /* Diagonal dark overlay on left edge of image (matches clip-path) */
        .ab-img-edge {
          position:absolute; inset:0;
          background:linear-gradient(to right, var(--ab-dark) 0%, rgba(13,43,16,0.6) 20%, transparent 60%);
          pointer-events:none;
        }

        /* Gold tint overlay */
        .ab-img-shade {
          position:absolute; inset:0;
          background:linear-gradient(
            160deg,
            rgba(10,31,14,0.4) 0%,
            transparent 50%,
            rgba(201,168,76,0.08) 100%
          );
          pointer-events:none;
        }

        /* Floating badge top-right */
        .ab-img-badge {
          position:absolute; top:28px; right:28px;
          width:64px; height:64px; border-radius:50%;
          background:rgba(13,43,16,0.85);
          backdrop-filter:blur(8px);
          display:flex; align-items:center; justify-content:center;
          color:var(--ab-gold);
          box-shadow:0 8px 28px rgba(0,0,0,0.4);
          border:1.5px solid rgba(201,168,76,0.4);
        }

        /* Year badge bottom-left of image */
        .ab-img-year {
          position:absolute; bottom:28px; left:28px;
          padding:10px 20px;
          background:rgba(10,31,14,0.9);
          backdrop-filter:blur(8px);
          border:1px solid rgba(201,168,76,0.3);
          display:flex; flex-direction:column; gap:2px;
        }
        .ab-img-year-num {
          font-family:'Playfair Display', serif;
          font-size:1.6rem; font-weight:900; line-height:1;
          color:var(--ab-gold);
        }
        .ab-img-year-label {
          font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase;
          color:rgba(255,255,255,0.5);
        }

        /* ── STATS STRIP ── */
        .ab-strip {
          background:linear-gradient(to right, var(--ab-mid), var(--ab-accent));
          border-top:1px solid rgba(201,168,76,0.2);
          padding:32px 52px;
          display:flex; align-items:center; gap:0;
          flex-wrap:wrap; opacity:0;
        }
        .ab-strip.vis { animation: ab-up 0.7s 0.65s ease forwards; }

        .ab-stat {
          flex:1; display:flex; flex-direction:column; gap:4px;
          padding:0 36px;
          border-right:1px solid rgba(255,255,255,0.12);
        }
        .ab-stat:first-child { padding-left:0; }
        .ab-stat:last-child  { border-right:none; }

        .ab-stat-val {
          font-family:'Playfair Display', serif;
          font-size:2.6rem; font-weight:900; line-height:1;
          color:var(--ab-gold); letter-spacing:-0.04em;
          opacity:0;
        }
        .ab-stat-val.vis { animation: ab-count 0.6s ease forwards; }
        .ab-stat-val.vis:nth-child(1) { animation-delay:0.7s; }
        .ab-stat-val.vis:nth-child(2) { animation-delay:0.8s; }
        .ab-stat-val.vis:nth-child(3) { animation-delay:0.9s; }

        .ab-stat-label {
          font-size:0.65rem; font-weight:500; letter-spacing:0.2em;
          text-transform:uppercase; color:rgba(255,255,255,0.55);
        }

        @media (max-width:1100px) {
          .ab-left { padding:72px 48px 72px 56px; }
          .ab-strip { padding:28px 32px; }
          .ab-stat  { padding:0 24px; }
        }
        @media (max-width:900px) {
          .ab-left { clip-path:none; margin-right:0; padding:64px 32px; }
          .ab-strip { padding:24px; gap:12px; }
          .ab-stat  { flex:0 0 50%; padding:12px 0; border-right:none; border-bottom:1px solid rgba(255,255,255,0.08); }
          .ab-stat:last-child { border-bottom:none; }
          .ab-circle-1, .ab-circle-2, .ab-circle-3 { display:none; }
        }
        @media (max-width:580px) {
          .ab-ghost { display:none; }
        }
      `}</style>

      <section id="about" className="ab-section" ref={sectionRef}>
        <div className="ab-grain" />

        <div className="ab-layout" dir={isRTL ? 'rtl' : 'ltr'}>

          {/* ── LEFT PANEL ── */}
          <div className="ab-left">
            <div className="ab-circle ab-circle-1" />
            <div className="ab-circle ab-circle-2" />
            <div className="ab-circle ab-circle-3" />
            <span className="ab-ghost">02</span>

            {/* Eyebrow */}
            <div className={`ab-tag ${visible ? 'vis' : ''}`}>
              <div className="ab-tag-dash" />
              <div className="ab-tag-dot" />
              <span className="ab-tag-text">{getText('section_label')}</span>
            </div>

            {/* Heading */}
            <h2 className={`ab-heading ${visible ? 'vis' : ''}`}>
              {titleLine1}
              {titleLine2 && <span className="ab-heading-em">{titleLine2}</span>}
            </h2>

            {/* Gold rule */}
            <div className={`ab-rule ${visible ? 'vis' : ''}`} />

            {/* Description */}
            <p className={`ab-desc ${visible ? 'vis' : ''}`}>
              {getText('story_description')}
            </p>

            {/* Values */}
            <div className={`ab-values ${visible ? 'vis' : ''}`}>
              {about.values.map((value: any, i: number) => (
                <div key={i} className="ab-val">
                  <div className="ab-val-icon">{getIcon(value.icon)}</div>
                  <span className="ab-val-text">{getValueText(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="ab-right">
            <div className={`ab-img-wrap ${visible ? 'vis' : ''}`}>
              <img src={about.image_url} alt={getText('story_title')} loading="lazy" />
              <div className="ab-img-edge" />
              <div className="ab-img-shade" />

              {/* Leaf badge */}
              <div className="ab-img-badge">
                <Leaf size={24} strokeWidth={1.5} />
              </div>

              {/* Year tag */}
              <div className="ab-img-year">
                <span className="ab-img-year-num">{getText('badge_text') || '2010'}</span>
                <span className="ab-img-year-label">
                  {lang === 'ar' ? 'منذ' : lang === 'fr' ? 'Fondée en' : 'Est. since'}
                </span>
              </div>
            </div>

            {/* Stats strip */}
            <div className={`ab-strip ${visible ? 'vis' : ''}`}>
              {[
                {
                  val: '500+',
                  label: lang === 'ar' ? 'منتج طبيعي' : lang === 'fr' ? 'Produits naturels' : 'Natural Products'
                },
                {
                  val: '12',
                  label: lang === 'ar' ? 'مجتمع محلي' : lang === 'fr' ? 'Communautés' : 'Communities'
                },
                {
                  val: '100%',
                  label: lang === 'ar' ? 'عضوي ونقي' : lang === 'fr' ? 'Bio & Pur' : 'Organic & Pure'
                },
              ].map((s, i) => (
                <div key={i} className="ab-stat">
                  <span className={`ab-stat-val ${visible ? 'vis' : ''}`}
                    style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                    {s.val}
                  </span>
                  <span className="ab-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default About;
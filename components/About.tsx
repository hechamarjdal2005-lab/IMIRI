import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import type { About } from '../types';
import { transformAbout } from '../utils/transformAbout';
import { Leaf, Award, Users, MapPin } from 'lucide-react';

interface AboutProps {
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const [about, setAbout]   = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchAbout();
    const fallback = setTimeout(() => setVisible(true), 300);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); clearTimeout(fallback); } },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { clearTimeout(fallback); if (el) observer.unobserve(el); };
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
    const map: Record<string, string> = { en:'text_en', fr:'text_fr', ar:'text_ar', ama:'text_ama' };
    return value?.[map[lang]] ?? value?.text_en ?? '';
  };

  const getIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      'leaf':    <Leaf    size={16} strokeWidth={1.5} />,
      'award':   <Award   size={16} strokeWidth={1.5} />,
      'users':   <Users   size={16} strokeWidth={1.5} />,
      'map-pin': <MapPin  size={16} strokeWidth={1.5} />,
    };
    return map[iconName] ?? <Leaf size={16} strokeWidth={1.5} />;
  };

  if (loading) return (
    <section style={{ padding:'120px 0', background:'#0a1f0e', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', gap:10 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:9, height:9, borderRadius:'50%', background:'#c9a84c',
            animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
          }}/>
        ))}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </section>
  );

  if (!about) return null;

  const storyTitle = getText('story_title');
  const words      = storyTitle.split(' ');
  const breakAt    = Math.ceil(words.length / 2);
  const titleLine1 = words.slice(0, breakAt).join(' ');
  const titleLine2 = words.slice(breakAt).join(' ');
  const isRTL      = lang === 'ar' || lang === 'ama';

  const stats = [
    { val:'500+', label: lang==='ar'?'منتج طبيعي': lang==='fr'?'Produits naturels':'Natural Products' },
    { val:'12',   label: lang==='ar'?'مجتمع محلي':  lang==='fr'?'Communautés':'Communities' },
    { val:'100%', label: lang==='ar'?'عضوي ونقي':   lang==='fr'?'Bio & Pur':'Organic & Pure' },
  ];

  return (
    <>
      <style>{`
        /* ── COCKTAIL FONT (Baloo 2) ── */
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');

        :root {
          --ab-font: 'Baloo 2', cursive;
        }

        @keyframes ab-up    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ab-left  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ab-scale { from{opacity:0;transform:scale(0.98)} to{opacity:1;transform:scale(1)} }
        @keyframes ab-line  { from{transform:scaleX(0)} to{transform:scaleX(1)} }

        /* ── SECTION ── */
        .ab {
          position: relative;
          background: #0a1f0e;
          overflow: hidden;
          font-family: var(--ab-font);
        }

        .ab::before {
          content: '';
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ── LAYOUT ── */
        .ab-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 720px;
        }
        @media (max-width: 860px) { .ab-layout { grid-template-columns: 1fr; } }

        /* ── LEFT ── */
        .ab-left {
          background: linear-gradient(150deg, #0d2b10 0%, #1a4d1e 100%);
          padding: 88px 64px 88px 72px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 93% 100%, 0 100%);
          margin-right: -3.5%;
          z-index: 2;
        }

        .ab-circle {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.08);
          bottom: -140px; right: -140px;
          pointer-events: none;
          animation: ab-spin 80s linear infinite;
        }
        @keyframes ab-spin { to { transform: rotate(360deg); } }

        /* ── TAG ── */
        .ab-tag {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: 24px;
          opacity: 0;
        }
        .ab-tag.vis { animation: ab-left 0.6s 0.1s ease forwards; }
        .ab-tag-line { width: 28px; height: 1.5px; background: #c9a84c; }
        .ab-tag-txt {
          font-family: var(--ab-font);
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: #c9a84c;
        }

        /* ── HEADING ── */
        .ab-h {
          font-family: var(--ab-font);
          font-size: clamp(2.4rem, 3.8vw, 4rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.01em; color: #fff;
          margin: 0; opacity: 0;
        }
        .ab-h.vis { animation: ab-up 0.7s 0.2s ease forwards; }
        .ab-h-em { display: block; color: #c9a84c; font-style: italic; font-weight: 700; }

        /* ── RULE ── */
        .ab-rule {
          width: 44px; height: 1.5px;
          background: linear-gradient(to right, #c9a84c, rgba(201,168,76,0.15));
          margin: 24px 0;
          transform-origin: left; transform: scaleX(0);
        }
        .ab-rule.vis { animation: ab-line 0.5s 0.45s ease forwards; }

        /* ── DESC ── */
        .ab-desc {
          font-family: var(--ab-font);
          font-size: 0.92rem; font-weight: 400; line-height: 1.9;
          color: rgba(255,255,255,0.65);
          max-width: 360px; margin-bottom: 40px;
          opacity: 0;
        }
        .ab-desc.vis { animation: ab-up 0.7s 0.3s ease forwards; }

        /* ── VALUES ── */
        .ab-vals { opacity: 0; }
        .ab-vals.vis { animation: ab-up 0.7s 0.45s ease forwards; }

        .ab-val {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          transition: padding-left 0.25s ease;
          cursor: default;
        }
        .ab-val:last-child { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ab-val:hover { padding-left: 6px; }
        .ab-val:hover .ab-val-ico { background: rgba(201,168,76,0.18); }

        .ab-val-ico {
          width: 32px; height: 32px; min-width: 32px;
          border-radius: 8px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.15);
          color: #c9a84c;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
          flex-shrink: 0;
        }

        .ab-val-txt {
          font-family: var(--ab-font);
          font-size: 0.88rem; font-weight: 500;
          color: rgba(255,255,255,0.72); line-height: 1.4;
        }

        /* ── RIGHT ── */
        .ab-right {
          display: flex; flex-direction: column;
          background: #0d2b10;
          position: relative; z-index: 1;
        }

        /* ── IMAGE ── */
        .ab-img {
          flex: 1; position: relative; overflow: hidden;
          opacity: 0; min-height: 480px;
        }
        .ab-img.vis { animation: ab-scale 0.9s 0.25s ease forwards; }

        .ab-img img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transition: transform 8s ease;
        }
        .ab-img:hover img { transform: scale(1.03); }

        .ab-img-edge {
          position: absolute; inset: 0;
          background: linear-gradient(to right, #0d2b10 0%, rgba(13,43,16,0.4) 18%, transparent 55%);
          pointer-events: none;
        }

        .ab-img-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(to top, rgba(10,31,14,0.85) 0%, transparent 100%);
          pointer-events: none;
        }

        .ab-leaf-badge {
          position: absolute; top: 24px; right: 24px;
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(10,31,14,0.85);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #c9a84c;
        }

        .ab-year {
          position: absolute; bottom: 24px; left: 24px;
          padding: 10px 18px;
          background: rgba(10,31,14,0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(201,168,76,0.25);
          display: flex; flex-direction: column; gap: 2px;
        }
        .ab-year-n {
          font-family: var(--ab-font);
          font-size: 1.6rem; font-weight: 800; line-height: 1; color: #c9a84c;
        }
        .ab-year-l {
          font-family: var(--ab-font);
          font-size: 0.6rem; font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.45);
        }

        /* ── STATS STRIP ── */
        .ab-stats {
          display: flex; align-items: stretch;
          background: linear-gradient(to right, #1a4d1e, #2d7d32);
          border-top: 1px solid rgba(201,168,76,0.18);
          opacity: 0;
        }
        .ab-stats.vis { animation: ab-up 0.7s 0.6s ease forwards; }

        .ab-stat {
          flex: 1;
          display: flex; flex-direction: column; justify-content: center;
          padding: 28px 32px;
          border-right: 1px solid rgba(255,255,255,0.08);
          gap: 5px;
        }
        .ab-stat:last-child { border-right: none; }

        .ab-stat-n {
          font-family: var(--ab-font);
          font-size: 2.2rem; font-weight: 800; line-height: 1;
          color: #c9a84c; letter-spacing: -0.02em;
          opacity: 0;
        }
        .ab-stat-n.vis { animation: ab-up 0.6s ease forwards; }

        .ab-stat-l {
          font-family: var(--ab-font);
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1060px) {
          .ab-left { padding: 72px 48px 72px 56px; }
          .ab-stat  { padding: 24px 24px; }
        }
        @media (max-width: 860px) {
          .ab-left {
            clip-path: none; margin-right: 0;
            padding: 60px 28px;
          }
          .ab-circle { display: none; }
          .ab-stat { padding: 20px 16px; }
          .ab-stat-n { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .ab-left { padding: 48px 20px; }
          .ab-stats { flex-wrap: wrap; }
          .ab-stat {
            flex: 0 0 50%;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
          .ab-stat:nth-child(2) { border-right: none; }
          .ab-stat:last-child { flex: 0 0 100%; border-bottom: none; border-right: none; }
        }
      `}</style>

      <section id="about" className="ab" ref={sectionRef}>
        <div className="ab-layout" dir={isRTL ? 'rtl' : 'ltr'}>

          {/* ── LEFT ── */}
          <div className="ab-left">
            <div className="ab-circle" />

            <div className={`ab-tag ${visible ? 'vis' : ''}`}>
              <div className="ab-tag-line" />
              <span className="ab-tag-txt">{getText('section_label')}</span>
            </div>

            <h2 className={`ab-h ${visible ? 'vis' : ''}`}>
              {titleLine1}
              {titleLine2 && <span className="ab-h-em">{titleLine2}</span>}
            </h2>

            <div className={`ab-rule ${visible ? 'vis' : ''}`} />

            <p className={`ab-desc ${visible ? 'vis' : ''}`}>
              {getText('story_description')}
            </p>

            <div className={`ab-vals ${visible ? 'vis' : ''}`}>
              {about.values.map((value: any, i: number) => (
                <div key={i} className="ab-val">
                  <div className="ab-val-ico">{getIcon(value.icon)}</div>
                  <span className="ab-val-txt">{getValueText(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="ab-right">

            <div className={`ab-img ${visible ? 'vis' : ''}`}>
              <img src={about.image_url} alt={getText('story_title')} loading="lazy" />
              <div className="ab-img-edge" />
              <div className="ab-img-bottom" />

              <div className="ab-leaf-badge">
                <Leaf size={20} strokeWidth={1.5} />
              </div>

              <div className="ab-year">
                <span className="ab-year-n">{getText('badge_text') || '2010'}</span>
                <span className="ab-year-l">
                  {lang==='ar'?'منذ': lang==='fr'?'Fondée en':'Est. since'}
                </span>
              </div>
            </div>

            <div className={`ab-stats ${visible ? 'vis' : ''}`}>
              {stats.map((s, i) => (
                <div key={i} className="ab-stat">
                  <span
                    className={`ab-stat-n ${visible ? 'vis' : ''}`}
                    style={{ animationDelay: `${0.65 + i * 0.1}s` }}
                  >
                    {s.val}
                  </span>
                  <span className="ab-stat-l">{s.label}</span>
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
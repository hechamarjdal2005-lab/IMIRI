import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import type { Contact } from '../types';
import { transformContact } from '../utils/transformContact';
import { Mail, MapPin, Phone, Navigation, Send, Facebook, Instagram } from 'lucide-react';

interface ContactProps {
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading]   = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [visible, setVisible]   = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchContact();
    const mapTimer = setTimeout(() => setMapLoaded(true), 600);
    const fallback  = setTimeout(() => setVisible(true), 300);

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); clearTimeout(fallback); } },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);

    return () => {
      clearTimeout(mapTimer);
      clearTimeout(fallback);
      if (el) obs.unobserve(el);
    };
  }, []);

  const fetchContact = async () => {
    try {
      const { data, error } = await supabase.from('contact').select('*').single();
      if (error) throw error;
      if (data) setContact(transformContact(data));
    } catch (err) {
      console.error('Error fetching contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const t = (en: string, fr: string, ar: string) =>
    lang === 'fr' ? fr : lang === 'ar' || lang === 'ama' ? ar : en;

  const getField = (key: string) => {
    if (!contact) return '';
    const suffix = lang === 'en' ? '_en' : lang === 'fr' ? '_fr' : lang === 'ar' ? '_ar' : '_ama';
    return (contact as any)[`${key}${suffix}`] ?? (contact as any)[`${key}_en`] ?? '';
  };

  const isRTL = lang === 'ar' || lang === 'ama';

  const fallbackMapSrc =
    'https://www.openstreetmap.org/export/embed.html?bbox=-9.65%2C30.38%2C-9.55%2C30.46&layer=mapnik&marker=30.4202%2C-9.5970';

  if (loading) return (
    <section style={{ background: '#0a1f0e', padding: '140px 0', display: 'flex', justifyContent: 'center' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div style={{ display: 'flex', gap: 12 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%', background: '#c9a84c',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </section>
  );

  if (!contact) return (
    <section style={{ background: '#0a1f0e', padding: '140px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Mail size={40} color="#c9a84c" style={{ marginBottom: 16 }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Baloo 2', cursive" }}>
          {t('Failed to load contact info', 'Impossible de charger les contacts', 'فشل تحميل معلومات الاتصال')}
        </p>
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        /* ── COCKTAIL FONT (Baloo 2) ── */
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');

        :root {
          --ct-font:   'Baloo 2', cursive;
          --ct-deep:   #0a1f0e;
          --ct-dark:   #0d2b10;
          --ct-mid:    #1a4d1e;
          --ct-gold:   #c9a84c;
          --ct-gold-d: rgba(201,168,76,0.12);
          --ct-gold-b: rgba(201,168,76,0.3);
          --ct-white:  #ffffff;
        }

        /* ── SECTION ── */
        .ct-section {
          position: relative;
          background: linear-gradient(180deg, #0d2b10 0%, #0a1f0e 60%, #0d2b10 100%);
          overflow: hidden;
          font-family: var(--ct-font);
          padding: 120px 0;
        }

        .ct-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .ct-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        .ct-blob {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(80px); opacity: 0.05;
        }
        .ct-blob-1 { width:500px; height:500px; top:-80px; left:-80px; background:#c9a84c; }
        .ct-blob-2 { width:400px; height:400px; bottom:-60px; right:-60px; background:#4caf50; }

        .ct-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
        }

        /* ── HEADER ── */
        .ct-header { text-align: center; margin-bottom: 72px; }

        .ct-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .ct-eyebrow.vis { opacity: 1; transform: translateY(0); }
        .ct-eyebrow-line { width: 32px; height: 1px; background: var(--ct-gold); }
        .ct-eyebrow-text {
          font-family: var(--ct-font);
          font-size: 0.64rem; font-weight: 600; letter-spacing: 0.24em;
          text-transform: uppercase; color: var(--ct-gold);
        }

        .ct-title {
          font-family: var(--ct-font);
          font-size: clamp(2.4rem, 4vw, 4rem);
          font-weight: 800; line-height: 1;
          color: var(--ct-white); margin: 0 0 20px;
          letter-spacing: -0.01em;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .ct-title.vis { opacity: 1; transform: translateY(0); }
        .ct-title em { font-style: italic; color: var(--ct-gold); }

        .ct-divider {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 20px;
          opacity: 0; transition: opacity 0.6s ease 0.25s;
        }
        .ct-divider.vis { opacity: 1; }
        .ct-divider-line { width: 56px; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.5)); }
        .ct-divider-line.rev { background: linear-gradient(to left, transparent, rgba(201,168,76,0.5)); }
        .ct-divider-diamond { width: 6px; height: 6px; background: var(--ct-gold); transform: rotate(45deg); }

        .ct-subtitle {
          font-family: var(--ct-font);
          font-size: 0.95rem; font-weight: 400; line-height: 1.8;
          color: rgba(255,255,255,0.45); max-width: 380px; margin: 0 auto;
          opacity: 0; transition: opacity 0.6s ease 0.3s;
        }
        .ct-subtitle.vis { opacity: 1; }

        /* ── LAYOUT ── */
        .ct-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: start;
        }
        @media (max-width: 900px) { .ct-layout { grid-template-columns: 1fr; } }

        /* ── CONTACT CARDS ── */
        .ct-cards { display: flex; flex-direction: column; gap: 16px; }

        .ct-card {
          display: flex; align-items: center; gap: 20px;
          padding: 22px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.12);
          position: relative; overflow: hidden;
          cursor: pointer; text-decoration: none;
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
          opacity: 0; transform: translateX(-20px);
        }
        .ct-card.vis { opacity: 1; transform: translateX(0); transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease, background 0.3s ease; }
        .ct-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.05);
          transform: translateX(6px);
        }

        .ct-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--ct-gold), transparent);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .ct-card:hover::before { opacity: 1; }

        .ct-card-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(201,168,76,0.06) 50%, transparent 80%);
          transform: translateX(-100%);
          pointer-events: none;
        }
        .ct-card:hover .ct-card-shimmer {
          transform: translateX(100%);
          transition: transform 0.7s ease;
        }

        .ct-card-icon {
          width: 44px; height: 44px; min-width: 44px;
          border-radius: 4px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--ct-gold);
          transition: background 0.3s, transform 0.3s;
        }
        .ct-card:hover .ct-card-icon {
          background: rgba(201,168,76,0.18);
          transform: scale(1.05);
        }

        .ct-card-title {
          font-family: var(--ct-font);
          font-size: 0.64rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 4px;
        }
        .ct-card-value {
          font-family: var(--ct-font);
          font-size: 0.95rem; font-weight: 500; color: rgba(255,255,255,0.85);
          line-height: 1.4;
        }

        .ct-card-arrow {
          margin-left: auto; color: rgba(201,168,76,0.4);
          opacity: 0; transform: translateX(-8px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .ct-card:hover .ct-card-arrow { opacity: 1; transform: translateX(0); }

        /* Social row */
        .ct-social-wrap {
          padding: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.1);
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .ct-social-wrap.vis { opacity: 1; transform: translateY(0); }

        .ct-social-label {
          font-family: var(--ct-font);
          font-size: 0.64rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .ct-social-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(201,168,76,0.2), transparent);
        }

        .ct-social-links { display: flex; gap: 12px; }

        .ct-social-btn {
          width: 44px; height: 44px;
          border: 1px solid rgba(201,168,76,0.2);
          background: rgba(201,168,76,0.06);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.25s ease;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        .ct-social-btn:hover {
          background: rgba(201,168,76,0.15);
          border-color: rgba(201,168,76,0.5);
          color: var(--ct-gold);
          transform: translateY(-2px);
        }

        /* ── MAP PANEL ── */
        .ct-map-panel {
          position: sticky; top: 100px;
          opacity: 0; transform: translateX(20px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .ct-map-panel.vis { opacity: 1; transform: translateX(0); }

        .ct-map-wrap {
          position: relative; overflow: hidden;
          border: 1px solid rgba(201,168,76,0.2);
          background: var(--ct-dark);
        }

        .ct-map-header {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          padding: 16px 20px;
          background: linear-gradient(to bottom, rgba(10,31,14,0.95) 60%, transparent);
          display: flex; align-items: center; gap: 12px;
        }
        .ct-map-pin-icon {
          width: 36px; height: 36px;
          background: var(--ct-gold);
          display: flex; align-items: center; justify-content: center;
          color: #0a1f0e;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }
        .ct-map-location-name {
          font-family: var(--ct-font);
          font-size: 1rem; font-weight: 700; color: var(--ct-white);
        }
        .ct-map-location-sub {
          font-family: var(--ct-font);
          font-size: 0.66rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .ct-map-iframe {
          width: 100%; height: 420px; border: 0; display: block;
          filter: grayscale(30%) brightness(0.85) sepia(10%);
          transition: opacity 0.8s ease;
        }

        .ct-map-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
          background: linear-gradient(to top, rgba(10,31,14,0.8), transparent);
          pointer-events: none;
        }

        .ct-directions {
          display: inline-flex; align-items: center; gap: 10px;
          width: 100%; justify-content: center;
          padding: 16px 0;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          border-top: none;
          color: var(--ct-gold);
          font-family: var(--ct-font);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s, color 0.25s;
        }
        .ct-directions:hover {
          background: rgba(201,168,76,0.15);
          color: #d4b560;
        }
        .ct-directions-icon { transition: transform 0.3s ease; }
        .ct-directions:hover .ct-directions-icon { transform: rotate(45deg); }

        @media (max-width: 640px) {
          .ct-inner { padding: 0 20px; }
          .ct-map-panel { position: static; }
        }
      `}</style>

      <section id="contact" className="ct-section" ref={sectionRef} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="ct-grid" />
        <div className="ct-blob ct-blob-1" />
        <div className="ct-blob ct-blob-2" />
        <div className="ct-grain" />

        <div className="ct-inner">

          {/* ── HEADER ── */}
          <div className="ct-header">
            <div className={`ct-eyebrow ${visible ? 'vis' : ''}`}>
              <div className="ct-eyebrow-line" />
              <span className="ct-eyebrow-text">
                {t('Get in Touch', 'Contactez-Nous', 'تواصل معنا')}
              </span>
              <div className="ct-eyebrow-line" style={{ transform: 'rotate(180deg)' }} />
            </div>

            <h2 className={`ct-title ${visible ? 'vis' : ''}`}>
              {(() => {
                const title = getField('title');
                const words = title.split(' ');
                if (words.length <= 1) return <em>{title}</em>;
                return <>
                  {words.slice(0, -1).join(' ')}{' '}
                  <em>{words.slice(-1)}</em>
                </>;
              })()}
            </h2>

            <div className={`ct-divider ${visible ? 'vis' : ''}`}>
              <div className="ct-divider-line" />
              <div className="ct-divider-diamond" />
              <div className="ct-divider-line rev" />
            </div>

            <p className={`ct-subtitle ${visible ? 'vis' : ''}`}>
              {t(
                "We'd love to hear from you.",
                'Nous serions ravis de vous entendre.',
                'يسعدنا التواصل معكم.'
              )}
            </p>
          </div>

          {/* ── LAYOUT ── */}
          <div className="ct-layout">

            {/* LEFT — Cards */}
            <div className="ct-cards">

              <a
                href={`https://wa.me/${contact.whatsapp_number}`}
                target="_blank" rel="noopener noreferrer"
                className={`ct-card ${visible ? 'vis' : ''}`}
                style={{ transitionDelay: '0.15s' }}
              >
                <div className="ct-card-shimmer" />
                <div className="ct-card-icon"><Phone size={18} strokeWidth={1.5} /></div>
                <div>
                  <div className="ct-card-title">{t('WhatsApp', 'WhatsApp', 'واتساب')}</div>
                  <div className="ct-card-value">{contact.phone}</div>
                </div>
                <Send size={14} className="ct-card-arrow" />
              </a>

              <a
                href={`mailto:${contact.email}`}
                className={`ct-card ${visible ? 'vis' : ''}`}
                style={{ transitionDelay: '0.25s' }}
              >
                <div className="ct-card-shimmer" />
                <div className="ct-card-icon"><Mail size={18} strokeWidth={1.5} /></div>
                <div>
                  <div className="ct-card-title">{t('Email', 'Email', 'البريد الإلكتروني')}</div>
                  <div className="ct-card-value">{contact.email}</div>
                </div>
                <Send size={14} className="ct-card-arrow" />
              </a>

              <div
                className={`ct-card ${visible ? 'vis' : ''}`}
                style={{ transitionDelay: '0.35s', cursor: 'default' }}
              >
                <div className="ct-card-shimmer" />
                <div className="ct-card-icon"><MapPin size={18} strokeWidth={1.5} /></div>
                <div>
                  <div className="ct-card-title">{t('Location', 'Localisation', 'الموقع')}</div>
                  <div className="ct-card-value">{getField('location')}</div>
                </div>
              </div>

              <div className={`ct-social-wrap ${visible ? 'vis' : ''}`} style={{ transitionDelay: '0.45s' }}>
                <div className="ct-social-label">
                  {t('Follow Us', 'Suivez-Nous', 'تابعونا')}
                </div>
                <div className="ct-social-links">
                  {contact.facebook_url && (
                    <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" className="ct-social-btn">
                      <Facebook size={18} strokeWidth={1.5} />
                    </a>
                  )}
                  {contact.instagram_url && (
                    <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" className="ct-social-btn">
                      <Instagram size={18} strokeWidth={1.5} />
                    </a>
                  )}
                  {contact.whatsapp_number && (
                    <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="ct-social-btn">
                      <Phone size={18} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — Map */}
            <div className={`ct-map-panel ${visible ? 'vis' : ''}`}>
              <div className="ct-map-wrap">
                <div className="ct-map-header">
                  <div className="ct-map-pin-icon">
                    <MapPin size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="ct-map-location-name">Agadir</div>
                    <div className="ct-map-location-sub">80000 — Maroc</div>
                  </div>
                </div>

                <iframe
                  src={contact.map_embed_url || fallbackMapSrc}
                  className="ct-map-iframe"
                  style={{ opacity: mapLoaded ? 1 : 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IMIRI Location"
                />

                <div className="ct-map-bottom" />
              </div>

              <a
                href={contact.google_maps_url || '#'}
                target="_blank" rel="noopener noreferrer"
                className="ct-directions"
              >
                <Navigation size={14} className="ct-directions-icon" strokeWidth={1.5} />
                <span>{t('Get Directions', 'Itinéraire', 'الحصول على الاتجاهات')}</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
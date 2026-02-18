import React from 'react';
import { Language } from '../types';
import { Leaf, MapPin, ArrowUp, Mail, Phone } from 'lucide-react';

interface FooterProps {
  t: {
    home: string;
    about: string;
    products: string;
    contact: string;
  };
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ t, lang }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const isRTL = lang === 'ar' || lang === 'ama';

  const tr = (en: string, fr: string, ar: string) =>
    lang === 'fr' ? fr : lang === 'ar' || lang === 'ama' ? ar : en;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .ft-root {
          position: relative;
          background: linear-gradient(180deg, #0a1f0e 0%, #060f07 100%);
          color: #fff;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Grid bg */
        .ft-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* Grain */
        .ft-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* Gold blob */
        .ft-blob {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(90px); opacity: 0.04;
        }
        .ft-blob-1 { width: 500px; height: 500px; top: -100px; left: -100px; background: #c9a84c; }
        .ft-blob-2 { width: 400px; height: 400px; bottom: 0; right: -80px; background: #4caf50; }

        /* Top gold separator */
        .ft-separator {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent);
          margin-bottom: 0;
        }

        .ft-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 72px 40px 40px;
        }

        /* ── MAIN GRID ── */
        .ft-grid-main {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 56px;
          margin-bottom: 56px;
        }
        @media (max-width: 900px) {
          .ft-grid-main { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 580px) {
          .ft-grid-main { grid-template-columns: 1fr; gap: 32px; }
          .ft-inner { padding: 56px 24px 32px; }
        }

        /* ── BRAND COL ── */
        .ft-brand-logo {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px; cursor: pointer;
        }
        .ft-brand-icon {
          width: 40px; height: 40px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          display: flex; align-items: center; justify-content: center;
          color: #c9a84c;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background 0.2s;
        }
        .ft-brand-logo:hover .ft-brand-icon { background: rgba(201,168,76,0.2); }

        .ft-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 900;
          color: #fff; letter-spacing: -0.02em;
          line-height: 1;
        }
        .ft-brand-sub {
          font-size: 0.58rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(201,168,76,0.5);
        }

        .ft-brand-desc {
          font-size: 0.85rem; font-weight: 300;
          line-height: 1.85; color: rgba(255,255,255,0.4);
          max-width: 340px; margin-bottom: 28px;
        }

        .ft-brand-info { display: flex; flex-direction: column; gap: 10px; }
        .ft-brand-info-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.8rem; color: rgba(255,255,255,0.45);
        }
        .ft-brand-info-icon {
          width: 28px; height: 28px; flex-shrink: 0;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.15);
          display: flex; align-items: center; justify-content: center;
          color: rgba(201,168,76,0.6);
        }

        /* ── COL HEADING ── */
        .ft-col-heading {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 24px;
        }
        .ft-col-heading-line {
          width: 20px; height: 1px; background: #c9a84c; flex-shrink: 0;
        }
        .ft-col-heading-text {
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        /* ── NAV LINKS ── */
        .ft-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
        .ft-nav-item a {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0;
          font-size: 0.88rem; font-weight: 400;
          color: rgba(255,255,255,0.45); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s, padding-left 0.2s;
          position: relative;
        }
        .ft-nav-item a::before {
          content: '';
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(201,168,76,0.3); flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .ft-nav-item a:hover {
          color: rgba(255,255,255,0.85);
          padding-left: 6px;
        }
        .ft-nav-item a:hover::before { background: #c9a84c; transform: scale(1.4); }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }

        .ft-copyright {
          font-size: 0.72rem; color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
        .ft-copyright strong { color: rgba(201,168,76,0.5); font-weight: 600; }

        .ft-made {
          font-size: 0.72rem; color: rgba(255,255,255,0.2);
          display: flex; align-items: center; gap: 6px;
        }
        .ft-made-heart { color: #c9a84c; font-size: 0.9rem; }

        /* ── SCROLL TO TOP ── */
        .ft-scroll-btn {
          position: fixed; bottom: 28px; right: 28px; z-index: 99;
          width: 44px; height: 44px;
          background: #c9a84c;
          color: #0a1f0e;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .ft-scroll-btn:hover {
          background: #d4b560;
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(201,168,76,0.4);
        }
        .ft-scroll-btn:active { transform: translateY(0); }
      `}</style>

      <footer className="ft-root" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="ft-grid" />
        <div className="ft-blob ft-blob-1" />
        <div className="ft-blob ft-blob-2" />
        <div className="ft-grain" />
        <div className="ft-separator" />

        <div className="ft-inner">
          <div className="ft-grid-main">

            {/* ── BRAND ── */}
            <div>
              <div className="ft-brand-logo" onClick={scrollToTop}>
                <div className="ft-brand-icon">
                  <Leaf size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="ft-brand-name">IMIRI</div>
                  <div className="ft-brand-sub">Coopérative</div>
                </div>
              </div>

              <p className="ft-brand-desc">
                {tr(
                  'Authentic Moroccan natural products, crafted with passion by local hands since 2010.',
                  'Produits naturels marocains authentiques, fabriqués avec passion par des mains locales depuis 2010.',
                  'منتجات مغربية طبيعية أصيلة، مصنوعة بشغف من قِبَل أيدٍ محلية منذ 2010.'
                )}
              </p>

              <div className="ft-brand-info">
                <div className="ft-brand-info-item">
                  <div className="ft-brand-icon" style={{ width: 28, height: 28 }}>
                    <MapPin size={13} strokeWidth={1.5} />
                  </div>
                  <span>Agadir, Morocco — 80000</span>
                </div>
                <div className="ft-brand-info-item">
                  <div className="ft-brand-icon" style={{ width: 28, height: 28 }}>
                    <Mail size={13} strokeWidth={1.5} />
                  </div>
                  <span>contact@imiri.ma</span>
                </div>
                <div className="ft-brand-info-item">
                  <div className="ft-brand-icon" style={{ width: 28, height: 28 }}>
                    <Phone size={13} strokeWidth={1.5} />
                  </div>
                  <span>+212 6XX XXX XXX</span>
                </div>
              </div>
            </div>

            {/* ── NAV LINKS ── */}
            <div>
              <div className="ft-col-heading">
                <div className="ft-col-heading-line" />
                <span className="ft-col-heading-text">
                  {tr('Navigation', 'Navigation', 'التنقل')}
                </span>
              </div>
              <ul className="ft-nav-list">
                {[
                  { label: t.home,     href: '#home'     },
                  { label: t.about,    href: '#about'    },
                  { label: t.products, href: '#products' },
                  { label: t.contact,  href: '#contact'  },
                ].map((link, i) => (
                  <li key={i} className="ft-nav-item">
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── VALUES ── */}
            <div>
              <div className="ft-col-heading">
                <div className="ft-col-heading-line" />
                <span className="ft-col-heading-text">
                  {tr('Our Values', 'Nos Valeurs', 'قيمنا')}
                </span>
              </div>
              <ul className="ft-nav-list">
                {[
                  tr('100% Natural', '100% Naturel',      '١٠٠٪ طبيعي'),
                  tr('Handcrafted',  'Artisanal',          'صنع يدوي'),
                  tr('Organic',      'Bio certifié',       'عضوي معتمد'),
                  tr('Local Roots',  'Racines locales',    'جذور محلية'),
                ].map((val, i) => (
                  <li key={i} className="ft-nav-item">
                    <a href="#about">{val}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="ft-bottom">
            <p className="ft-copyright">
              © {new Date().getFullYear()} <strong>IMIRI Cooperative</strong>.{' '}
              {tr('All rights reserved.', 'Tous droits réservés.', 'جميع الحقوق محفوظة.')}
            </p>
            <p className="ft-made">
              <span>{tr('Made with', 'Fait avec', 'صنع بـ')}</span>
              <span className="ft-made-heart">♥</span>
              <span>{tr('in Morocco', 'au Maroc', 'في المغرب')} · 2026</span>
            </p>
          </div>
        </div>

        {/* Scroll to top */}
        <button className="ft-scroll-btn" onClick={scrollToTop} aria-label="Back to top">
          <ArrowUp size={18} strokeWidth={2} />
        </button>
      </footer>
    </>
  );
};

export default Footer;
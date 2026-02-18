import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Language } from '../types';
import { Menu, X, Globe, ChevronDown, ShoppingBasket } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: {
    home: string;
    about: string;
    products: string;
    contact: string;
  };
  cartCount: number;
  onCartClick: () => void;
}

interface SiteSettings {
  logo_url: string | null;
  logo_height: string;
  site_name: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, cartCount, onCartClick }) => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isLangOpen, setIsLangOpen]   = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [scrolled, setScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en',  label: 'EN', native: 'English'       },
    { code: 'fr',  label: 'FR', native: 'Français'      },
    { code: 'ar',  label: 'AR', native: 'العربية'        },
    { code: 'ama', label: 'AM', native: 'ⵜⴰⵎⴰⵣⵉⵖⵜ'     },
  ];

  const navItems = ['home', 'about', 'products', 'contact'] as const;

  useEffect(() => {
    fetchSiteSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ['contact', 'products', 'about', 'home'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActiveSection(id); break; }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentLang]);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_background')
        .select('logo_url, logo_height, site_name_en, site_name_fr, site_name_ar, site_name_ama')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (data) {
        const nameMap: Record<Language, string> = {
          en: data.site_name_en,
          fr: data.site_name_fr,
          ar: data.site_name_ar,
          ama: data.site_name_ama,
        };
        setSiteSettings({
          logo_url: data.logo_url,
          logo_height: data.logo_height || '40px',
          site_name: nameMap[currentLang] || data.site_name_en,
        });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    }
  };

  const isRTL = currentLang === 'ar' || currentLang === 'ama';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── TOKENS ── */
        :root {
          --nav-deep:   #0a1f0e;
          --nav-dark:   #0d2b10;
          --nav-mid:    #1a4d1e;
          --nav-gold:   #c9a84c;
          --nav-gold-d: rgba(201,168,76,0.12);
          --nav-gold-b: rgba(201,168,76,0.28);
          --nav-white:  #ffffff;
        }

        /* ── BASE NAV ── */
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
          font-family: 'DM Sans', sans-serif;
        }

        /* Transparent on top */
        .nav-root.top {
          background: rgba(10,31,14,0.65);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201,168,76,0.08);
          box-shadow: none;
        }

        /* Solid when scrolled */
        .nav-root.scrolled {
          background: rgba(10,31,14,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,168,76,0.18);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4);
        }

        /* Gold bottom line that grows on scroll */
        .nav-root::after {
          content: '';
          position: absolute; bottom: -1px; left: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--nav-gold), transparent);
          width: 0; transition: width 0.6s ease;
        }
        .nav-root.scrolled::after { width: 100%; }

        /* ── INNER ── */
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px;
        }

        /* ── LOGO ── */
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; flex-shrink: 0;
          text-decoration: none;
        }
        .nav-logo-img {
          object-fit: contain;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: brightness(1.05);
        }
        .nav-logo:hover .nav-logo-img { transform: scale(1.04); }

        .nav-logo-fallback {
          width: 36px; height: 36px;
          background: var(--nav-gold);
          display: flex; align-items: center; justify-content: center;
          color: var(--nav-deep);
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          flex-shrink: 0;
        }

        .nav-logo-text {
          display: flex; flex-direction: column; gap: 0;
        }
        .nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; font-weight: 700;
          color: var(--nav-white); line-height: 1.1;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .nav-logo:hover .nav-logo-name { color: var(--nav-gold); }
        .nav-logo-sub {
          font-size: 0.58rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); line-height: 1;
        }

        /* ── DESKTOP LINKS ── */
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          flex: 1; justify-content: center;
        }

        .nav-link {
          position: relative;
          padding: 8px 16px;
          font-size: 0.82rem; font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom: 4px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 32px); height: 1px;
          background: var(--nav-gold);
          transition: transform 0.3s ease;
          transform-origin: center;
        }
        .nav-link:hover { color: rgba(255,255,255,0.95); }
        .nav-link:hover::after { transform: translateX(-50%) scaleX(1); }

        .nav-link.active {
          color: var(--nav-gold);
        }
        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* Gold dot above active */
        .nav-link.active::before {
          content: '';
          position: absolute; top: 2px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--nav-gold);
        }

        /* ── RIGHT ACTIONS ── */
        .nav-actions {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }

        /* Cart */
        .nav-cart {
          position: relative;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.2);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        .nav-cart:hover {
          background: rgba(201,168,76,0.16);
          border-color: rgba(201,168,76,0.45);
          color: var(--nav-gold);
        }

        .nav-cart-badge {
          position: absolute; top: -6px; right: -6px;
          min-width: 18px; height: 18px; padding: 0 4px;
          background: var(--nav-gold);
          color: var(--nav-deep);
          font-size: 0.6rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border-radius: 2px;
          border: 1.5px solid rgba(10,31,14,0.8);
        }

        /* Cart pulse ring */
        .nav-cart-ring {
          position: absolute; inset: -4px;
          border: 1px solid rgba(201,168,76,0.3);
          animation: cartPulse 2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes cartPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0; transform: scale(1.15); }
        }

        /* ── LANG SWITCHER ── */
        .nav-lang-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.18);
          color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-lang-btn:hover {
          border-color: rgba(201,168,76,0.45);
          color: var(--nav-gold);
          background: rgba(201,168,76,0.06);
        }
        .nav-lang-btn .chevron {
          transition: transform 0.25s ease;
          color: rgba(201,168,76,0.6);
        }
        .nav-lang-btn.open .chevron { transform: rotate(180deg); }

        .nav-lang-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 176px;
          background: rgba(10,31,14,0.98);
          border: 1px solid rgba(201,168,76,0.2);
          backdrop-filter: blur(20px);
          overflow: hidden;
          animation: dropIn 0.2s ease;
          z-index: 200;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Gold top accent */
        .nav-lang-dropdown::before {
          content: '';
          display: block; height: 2px;
          background: linear-gradient(to right, transparent, var(--nav-gold), transparent);
        }

        .nav-lang-option {
          width: 100%;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 12px;
          background: transparent;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-align: left;
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .nav-lang-option:last-child { border-bottom: none; }
        .nav-lang-option:hover {
          background: rgba(201,168,76,0.06);
          color: rgba(255,255,255,0.9);
        }
        .nav-lang-option.active {
          color: var(--nav-gold);
          background: rgba(201,168,76,0.08);
        }
        .nav-lang-option-code {
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.15em; color: inherit;
          width: 24px; flex-shrink: 0;
        }
        .nav-lang-option-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--nav-gold); margin-left: auto;
          flex-shrink: 0;
        }

        /* ── MOBILE MENU BUTTON ── */
        .nav-hamburger {
          display: none;
          width: 40px; height: 40px;
          align-items: center; justify-content: center;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.18);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-hamburger:hover {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.35);
          color: var(--nav-gold);
        }

        /* ── MOBILE DRAWER ── */
        .nav-drawer {
          background: rgba(10,31,14,0.99);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(201,168,76,0.12);
          animation: drawerIn 0.3s ease;
          overflow: hidden;
        }
        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-drawer-inner { padding: 24px 24px 32px; }

        .nav-drawer-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem; font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s, padding-left 0.2s;
        }
        .nav-drawer-link:hover { color: rgba(255,255,255,0.9); padding-left: 22px; }
        .nav-drawer-link.active { color: var(--nav-gold); }
        .nav-drawer-link-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(201,168,76,0.3); flex-shrink: 0;
          transition: background 0.2s;
        }
        .nav-drawer-link.active .nav-drawer-link-dot,
        .nav-drawer-link:hover .nav-drawer-link-dot { background: var(--nav-gold); }

        .nav-drawer-lang {
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid rgba(201,168,76,0.1);
        }
        .nav-drawer-lang-title {
          font-size: 0.6rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.25); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .nav-drawer-lang-title::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(201,168,76,0.15), transparent);
        }
        .nav-drawer-lang-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .nav-drawer-lang-btn {
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          border: 1px solid rgba(201,168,76,0.18);
          background: rgba(201,168,76,0.05);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-drawer-lang-btn:hover {
          border-color: rgba(201,168,76,0.4);
          color: rgba(255,255,255,0.85);
          background: rgba(201,168,76,0.1);
        }
        .nav-drawer-lang-btn.active {
          background: var(--nav-gold);
          border-color: var(--nav-gold);
          color: var(--nav-deep);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav-inner { padding: 0 20px; height: 64px; }
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .nav-lang-btn { display: none; }
        }
      `}</style>

      <nav className={`nav-root ${scrolled ? 'scrolled' : 'top'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="nav-inner">

          {/* ── LOGO ── */}
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {siteSettings?.logo_url ? (
              <img
                src={siteSettings.logo_url}
                alt={siteSettings.site_name}
                className="nav-logo-img"
                style={{ height: siteSettings.logo_height }}
              />
            ) : (
              <div className="nav-logo-fallback">I</div>
            )}
            <div className="nav-logo-text">
              <span className="nav-logo-name">{siteSettings?.site_name || 'IMIRI'}</span>
              <span className="nav-logo-sub">Coopérative</span>
            </div>
          </div>

          {/* ── DESKTOP LINKS ── */}
          <div className="nav-links">
            {navItems.map(item => (
              <a
                key={item}
                href={`#${item}`}
                className={`nav-link ${activeSection === item ? 'active' : ''}`}
              >
                {t[item]}
              </a>
            ))}
          </div>

          {/* ── ACTIONS ── */}
          <div className="nav-actions">

            {/* Cart */}
            <button className="nav-cart" onClick={onCartClick} aria-label="Cart">
              {cartCount > 0 && <div className="nav-cart-ring" />}
              <ShoppingBasket size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>

            {/* Lang switcher — desktop */}
            <div style={{ position: 'relative' }}>
              <button
                className={`nav-lang-btn ${isLangOpen ? 'open' : ''}`}
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <Globe size={13} strokeWidth={1.5} />
                <span>{currentLang.toUpperCase()}</span>
                <ChevronDown size={12} className="chevron" />
              </button>

              {isLangOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setIsLangOpen(false)} />
                  <div className="nav-lang-dropdown">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        className={`nav-lang-option ${currentLang === l.code ? 'active' : ''}`}
                        onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                      >
                        <span className="nav-lang-option-code">{l.label}</span>
                        <span>{l.native}</span>
                        {currentLang === l.code && <span className="nav-lang-option-dot" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile cart + hamburger */}
            <button className="nav-cart" style={{ display: 'none' }} onClick={onCartClick}>
              <ShoppingBasket size={18} strokeWidth={1.5} />
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>

            <button
              className="nav-hamburger"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {isOpen && (
          <div className="nav-drawer">
            <div className="nav-drawer-inner">
              {navItems.map(item => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`nav-drawer-link ${activeSection === item ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-drawer-link-dot" />
                  {t[item]}
                </a>
              ))}

              <div className="nav-drawer-lang">
                <div className="nav-drawer-lang-title">
                  <Globe size={10} strokeWidth={1.5} color="rgba(201,168,76,0.4)" />
                  Language
                </div>
                <div className="nav-drawer-lang-grid">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      className={`nav-drawer-lang-btn ${currentLang === l.code ? 'active' : ''}`}
                      onClick={() => { setLang(l.code); setIsOpen(false); }}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
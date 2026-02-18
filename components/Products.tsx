import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Language, Product } from '../types';
import { transformProduct } from '../utils/transformProduct';
import { Plus, ShoppingBag, ArrowRight, Leaf, Star } from 'lucide-react';

interface ProductsProps {
  t: {
    title: string;
    addToBasket: string;
    price: string;
  };
  lang: Language;
  onAdd: (product: Product) => void;
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard: React.FC<{
  product: Product;
  index: number;
  lang: Language;
  onAdd: (product: Product) => void;
  t: ProductsProps['t'];
  visible: boolean;
}> = ({ product, index, lang, onAdd, t, visible }) => {
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top)  / r.height - 0.5,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pc-wrap {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .pc-wrap.vis {
          opacity: 1;
          transform: translateY(0);
        }

        .pc-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #0d2b10;
          border: 1px solid rgba(201,168,76,0.15);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .pc-card:hover {
          border-color: rgba(201,168,76,0.4);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.08);
        }

        /* Image */
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
        }
        .pc-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pc-card:hover .pc-img-wrap img { transform: scale(1.08); }

        /* Gold shimmer sweep on hover */
        .pc-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(201,168,76,0.12) 50%, transparent 80%);
          transform: translateX(-100%);
          transition: transform 0s;
          pointer-events: none;
        }
        .pc-card:hover .pc-shimmer {
          transform: translateX(100%);
          transition: transform 0.8s ease;
        }

        /* Dark gradient on image bottom */
        .pc-img-gradient {
          position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
          background: linear-gradient(to top, rgba(10,31,14,0.95) 0%, transparent 100%);
          pointer-events: none;
        }

        /* Badge top-left */
        .pc-badge {
          position: absolute; top: 16px; left: 16px;
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          background: rgba(10,31,14,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(201,168,76,0.35);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #c9a84c;
        }

        /* Price tag top-right */
        .pc-price-tag {
          position: absolute; top: 16px; right: 16px;
          background: #c9a84c;
          color: #0a1f0e;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 900;
          padding: 8px 16px;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          line-height: 1;
        }

        /* Rating row on image (bottom) */
        .pc-rating {
          position: absolute; bottom: 16px; left: 16px;
          display: flex; align-items: center; gap: 6px;
        }
        .pc-stars { display: flex; gap: 2px; }
        .pc-rating-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem; color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
        }

        /* Add to basket CTA — slides up from bottom of image */
        .pc-cta-slide {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 0 20px 20px;
          transform: translateY(110%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pc-card:hover .pc-cta-slide { transform: translateY(0); }

        .pc-cta-btn {
          width: 100%;
          padding: 14px 0;
          background: #c9a84c;
          color: #0a1f0e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .pc-cta-btn:hover {
          background: #d4b560;
          box-shadow: 0 8px 24px rgba(201,168,76,0.4);
        }
        .pc-cta-btn:active { transform: scale(0.98); }

        /* Content below image */
        .pc-content {
          padding: 24px 24px 20px;
          display: flex; flex-direction: column; gap: 10px;
          position: relative;
        }

        /* Gold top border line */
        .pc-content::before {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px;
          height: 1px;
          background: linear-gradient(to right, rgba(201,168,76,0.4), transparent);
        }

        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; font-weight: 900;
          color: #ffffff; line-height: 1.15;
          transition: color 0.2s ease;
        }
        .pc-card:hover .pc-name { color: #c9a84c; }

        .pc-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 300;
          color: rgba(255,255,255,0.55); line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Tags row */
        .pc-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .pc-tag {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.15);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(201,168,76,0.7);
          border-radius: 2px;
        }

        /* Mobile add button */
        .pc-mobile-btn {
          display: none;
          width: 100%; padding: 12px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer;
          align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
          margin-top: 4px;
        }
        .pc-mobile-btn:hover { background: rgba(201,168,76,0.2); }
        @media (max-width: 768px) {
          .pc-mobile-btn { display: flex; }
          .pc-cta-slide { display: none; }
        }
      `}</style>

      <div
        className={`pc-wrap ${visible ? 'vis' : ''}`}
        style={{ transitionDelay: `${index * 120}ms` }}
      >
        <div
          ref={cardRef}
          className="pc-card"
          style={{
            transform: hovered
              ? `rotateX(${mouse.y * -6}deg) rotateY(${mouse.x * 6}deg)`
              : 'rotateX(0) rotateY(0)',
            transformStyle: 'preserve-3d',
            transition: hovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setMouse({ x: 0, y: 0 }); }}
        >
          {/* Image */}
          <div className="pc-img-wrap">
            <img src={product.image} alt={product.name[lang]} loading="lazy" />
            <div className="pc-shimmer" />
            <div className="pc-img-gradient" />

            {/* Badges */}
            <div className="pc-badge">
              <Leaf size={10} strokeWidth={2} />
              <span>
                {lang === 'ar' ? '١٠٠٪ طبيعي' :
                 lang === 'fr' ? '100% Naturel' :
                 '100% Natural'}
              </span>
            </div>

            <div className="pc-price-tag">
              {product.price} <span style={{ fontSize: '0.7rem', fontFamily: 'DM Sans' }}>{product.priceLabel}</span>
            </div>

            {/* Rating */}
            <div className="pc-rating">
              <div className="pc-stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={10} fill={s <= 5 ? '#c9a84c' : 'none'} color="#c9a84c" strokeWidth={1.5} />
                ))}
              </div>
              <span className="pc-rating-text">4.9 (128)</span>
            </div>

            {/* CTA slide-up */}
            <div className="pc-cta-slide">
              <button className="pc-cta-btn" onClick={() => onAdd(product)}>
                <ShoppingBag size={15} />
                <span>{t.addToBasket}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="pc-content">
            <h3 className="pc-name">{product.name[lang]}</h3>
            <p className="pc-desc">{product.description[lang]}</p>
            <div className="pc-tags">
              <span className="pc-tag">
                <Leaf size={8} />
                {lang === 'ar' ? 'عضوي' : lang === 'fr' ? 'Bio' : 'Organic'}
              </span>
              <span className="pc-tag">
                {lang === 'ar' ? 'مغربي أصيل' : lang === 'fr' ? 'Artisanal' : 'Handcrafted'}
              </span>
            </div>

            {/* Mobile button */}
            <button className="pc-mobile-btn" onClick={() => onAdd(product)}>
              <Plus size={14} />
              <span>{t.addToBasket}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────── */
const Products: React.FC<ProductsProps> = ({ t, lang, onAdd }) => {
  const [products, setProducts]             = useState<Product[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchProducts();

    // Section visibility
    const fallback = setTimeout(() => setSectionVisible(true), 300);
    const secObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSectionVisible(true); clearTimeout(fallback); } },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    );
    const el = sectionRef.current;
    if (el) secObs.observe(el);

    return () => { clearTimeout(fallback); if (el) secObs.unobserve(el); };
  }, []);

  useEffect(() => {
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-product-id');
            if (id) setVisibleProducts((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.product-card-animate').forEach((c) => cardObs.observe(c));
    return () => cardObs.disconnect();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data.map(transformProduct));
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared section styles ── */
  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(180deg, #0a1f0e 0%, #0d2b10 50%, #0a1f0e 100%)',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  };

  if (loading) return (
    <section style={{ ...sectionStyle, padding: '140px 0' }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%', background: '#c9a84c',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </section>
  );

  if (error) return (
    <section style={{ ...sectionStyle, padding: '140px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <ShoppingBag size={40} color="#c9a84c" style={{ marginBottom: 16 }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>{error}</p>
        <button onClick={fetchProducts} style={{
          padding: '12px 32px', background: '#c9a84c', color: '#0a1f0e',
          fontWeight: 700, border: 'none', cursor: 'pointer', borderRadius: 2,
          fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em',
        }}>
          {lang === 'ar' ? 'إعادة المحاولة' : lang === 'fr' ? 'Réessayer' : 'Retry'}
        </button>
      </div>
    </section>
  );

  const isRTL = lang === 'ar' || lang === 'ama';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── SECTION DECORATIONS ── */
        .pr-section { padding: 120px 0; }

        /* Faint diagonal grid */
        .pr-grid-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* Gold glow blobs */
        .pr-blob {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(80px); opacity: 0.06;
        }
        .pr-blob-1 { width:600px; height:600px; top:-100px; left:-100px; background:#c9a84c; }
        .pr-blob-2 { width:500px; height:500px; bottom:-100px; right:-100px; background:#4caf50; }

        /* Grain */
        .pr-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ── HEADER ── */
        .pr-header {
          position: relative; z-index: 1;
          text-align: center; margin-bottom: 80px;
        }

        .pr-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .pr-eyebrow.vis { opacity: 1; transform: translateY(0); }

        .pr-eyebrow-line { width: 32px; height: 1px; background: #c9a84c; }
        .pr-eyebrow-text {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.28em;
          text-transform: uppercase; color: #c9a84c;
        }

        .pr-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 900; line-height: 1;
          color: #ffffff; margin: 0 0 20px;
          letter-spacing: -0.03em;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .pr-title.vis { opacity: 1; transform: translateY(0); }
        .pr-title em {
          font-style: italic; color: #c9a84c;
        }

        .pr-divider {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 20px;
          opacity: 0; transition: opacity 0.6s ease 0.25s;
        }
        .pr-divider.vis { opacity: 1; }
        .pr-divider-line { width: 60px; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.5)); }
        .pr-divider-line.rev { background: linear-gradient(to left, transparent, rgba(201,168,76,0.5)); }
        .pr-divider-diamond {
          width: 6px; height: 6px; background: #c9a84c;
          transform: rotate(45deg);
        }

        .pr-subtitle {
          font-size: 0.95rem; font-weight: 300; line-height: 1.8;
          color: rgba(255,255,255,0.5); max-width: 420px; margin: 0 auto;
          opacity: 0; transition: opacity 0.6s ease 0.3s;
        }
        .pr-subtitle.vis { opacity: 1; }

        /* ── GRID ── */
        .pr-grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
        }
        @media (max-width: 1024px) { .pr-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .pr-grid { grid-template-columns: 1fr; padding: 0 20px; } }

        /* ── CTA BOTTOM ── */
        .pr-cta-wrap {
          position: relative; z-index: 1;
          display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;
          margin-top: 72px; padding: 0 40px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .pr-cta-wrap.vis { opacity: 1; transform: translateY(0); }

        .pr-cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px;
          background: #c9a84c; color: #0a1f0e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .pr-cta-primary:hover {
          background: #d4b560;
          box-shadow: 0 8px 32px rgba(201,168,76,0.35);
          transform: translateY(-2px);
        }

        .pr-cta-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px;
          background: transparent; color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.15); cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
        }
        .pr-cta-secondary:hover { border-color: rgba(201,168,76,0.4); color: #c9a84c; }

        /* Empty state */
        .pr-empty {
          position: relative; z-index: 1;
          text-align: center; padding: 80px 20px;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .pr-header { margin-bottom: 48px; padding: 0 20px; }
          .pr-cta-wrap { padding: 0 20px; }
        }
      `}</style>

      <section id="products" className="pr-section" style={sectionStyle} ref={sectionRef} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Backgrounds */}
        <div className="pr-grid-bg" />
        <div className="pr-blob pr-blob-1" />
        <div className="pr-blob pr-blob-2" />
        <div className="pr-grain" />

        {/* ── HEADER ── */}
        <div className="pr-header" style={{ padding: '0 40px' }}>
          <div className={`pr-eyebrow ${sectionVisible ? 'vis' : ''}`}>
            <div className="pr-eyebrow-line" />
            <span className="pr-eyebrow-text">
              {lang === 'ar' ? 'مجموعتنا' : lang === 'fr' ? 'Notre Collection' : 'Our Collection'}
            </span>
            <div className="pr-eyebrow-line" style={{ transform: 'rotate(180deg)' }} />
          </div>

          <h2 className={`pr-title ${sectionVisible ? 'vis' : ''}`}>
            {t.title.includes(' ') ? (
              <>
                {t.title.split(' ').slice(0, -1).join(' ')}{' '}
                <em>{t.title.split(' ').slice(-1)}</em>
              </>
            ) : (
              <em>{t.title}</em>
            )}
          </h2>

          <div className={`pr-divider ${sectionVisible ? 'vis' : ''}`}>
            <div className="pr-divider-line" />
            <div className="pr-divider-diamond" />
            <div className="pr-divider-line rev" />
          </div>

          <p className={`pr-subtitle ${sectionVisible ? 'vis' : ''}`}>
            {lang === 'ar'
              ? 'منتجات طبيعية أصيلة مصنوعة بشغف من قِبَل أيدٍ محلية'
              : lang === 'fr'
              ? 'Produits naturels et authentiques, fabriqués avec passion par des mains locales'
              : 'Authentic natural products, crafted with passion by local hands'}
          </p>
        </div>

        {/* ── GRID ── */}
        <div className="pr-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              data-product-id={product.id}
              className="product-card-animate"
            >
              <ProductCard
                product={product}
                index={index}
                lang={lang}
                onAdd={onAdd}
                t={t}
                visible={visibleProducts.has(product.id) || sectionVisible}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="pr-empty">
            <ShoppingBag size={36} color="rgba(201,168,76,0.4)" style={{ marginBottom: 16 }} />
            <p>
              {lang === 'ar' ? 'لا توجد منتجات متاحة' :
               lang === 'fr' ? 'Aucun produit disponible' :
               'No products available'}
            </p>
          </div>
        )}

        {/* ── CTA ── */}
        {products.length > 0 && (
          <div className={`pr-cta-wrap ${sectionVisible ? 'vis' : ''}`}>
            <button className="pr-cta-primary">
              <ShoppingBag size={15} />
              <span>
                {lang === 'ar' ? 'مشاهدة كل المنتجات' :
                 lang === 'fr' ? 'Voir Tous les Produits' :
                 'View All Products'}
              </span>
              <ArrowRight size={13} />
            </button>
            <button className="pr-cta-secondary">
              <span>
                {lang === 'ar' ? 'معرفة المزيد' :
                 lang === 'fr' ? 'En Savoir Plus' :
                 'Learn More'}
              </span>
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Products;
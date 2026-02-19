import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Language, Product } from '../types';
import { transformProduct } from '../utils/transformProduct';
import { Plus, ShoppingBag, ArrowRight, Leaf, Star } from 'lucide-react';

interface ProductsProps {
  t: { title: string; addToBasket: string; price: string; };
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
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className={`pc ${visible ? 'pc-vis' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* IMAGE */}
      <div className="pc-img">
        <img src={product.image} alt={product.name[lang]} loading="lazy" />

        {/* shimmer on hover */}
        <div className="pc-shimmer" />

        {/* dark gradient bottom */}
        <div className="pc-grad" />

        {/* organic badge */}
        <div className="pc-organic">
          <Leaf size={7} strokeWidth={2} />
          <span>{lang === 'ar' ? 'طبيعي' : lang === 'fr' ? 'Bio' : 'Organic'}</span>
        </div>

        {/* price */}
        <div className="pc-price">
          {product.price}
          <span className="pc-price-u"> {product.priceLabel}</span>
        </div>

        {/* desktop hover CTA */}
        <div className="pc-hover-cta">
          <button className="pc-hover-btn" onClick={handleAdd}>
            <ShoppingBag size={13} />
            <span>{t.addToBasket}</span>
          </button>
        </div>

        {/* stars on image */}
        <div className="pc-stars">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={8} fill="#c9a84c" color="#c9a84c" strokeWidth={0} />
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="pc-info">
        <h3 className="pc-name">{product.name[lang]}</h3>
        <p className="pc-desc">{product.description[lang]}</p>

        {/* mobile add button */}
        <button className={`pc-add ${added ? 'pc-add-done' : ''}`} onClick={handleAdd}>
          {added ? (
            <>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 5.5l2.5 2.5 5.5-5.5" stroke="#0a1f0e" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{lang === 'ar' ? 'أضيف!' : lang === 'fr' ? 'Ajouté!' : 'Added!'}</span>
            </>
          ) : (
            <>
              <Plus size={11} strokeWidth={2.5} />
              <span>{t.addToBasket}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────── */
const Products: React.FC<ProductsProps> = ({ t, lang, onAdd }) => {
  const [products, setProducts]               = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  const [sectionVisible, setSectionVisible]   = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchProducts();
    const fallback = setTimeout(() => setSectionVisible(true), 300);
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSectionVisible(true); clearTimeout(fallback); } },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => { clearTimeout(fallback); if (el) obs.unobserve(el); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-product-id');
          if (id) setVisibleProducts(prev => new Set([...prev, id]));
        }
      }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    document.querySelectorAll('.pca').forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data.map(transformProduct));
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const isRTL = lang === 'ar' || lang === 'ama';

  const sectionBg: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(180deg, #0a1f0e 0%, #0d2b10 50%, #0a1f0e 100%)',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  };

  if (loading) return (
    <section style={{ ...sectionBg, padding: '120px 0', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%', background: '#c9a84c',
            animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
    </section>
  );

  if (error) return (
    <section style={{ ...sectionBg, padding: '120px 0', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'50vh' }}>
      <div style={{ textAlign:'center' }}>
        <ShoppingBag size={36} color="#c9a84c" style={{ marginBottom:14 }} />
        <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:20 }}>{error}</p>
        <button onClick={fetchProducts} style={{
          padding:'10px 28px', background:'#c9a84c', color:'#0a1f0e',
          fontWeight:700, border:'none', cursor:'pointer', borderRadius:2,
          fontFamily:'DM Sans,sans-serif', fontSize:'0.78rem', letterSpacing:'0.15em',
        }}>
          {lang === 'ar' ? 'إعادة المحاولة' : lang === 'fr' ? 'Réessayer' : 'Retry'}
        </button>
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── SECTION DECO ── */
        .pr-s { padding: 100px 0 80px; }

        .pr-grid-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 70px 70px;
        }
        .pr-blob {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(80px); opacity: 0.06;
        }
        .pr-blob-1 { width:500px; height:500px; top:-80px; left:-80px; background:#c9a84c; }
        .pr-blob-2 { width:400px; height:400px; bottom:-80px; right:-80px; background:#4caf50; }
        .pr-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ── HEADER ── */
        .pr-head {
          position: relative; z-index: 1;
          text-align: center; margin-bottom: 60px; padding: 0 20px;
        }

        .pr-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .pr-eyebrow.vis { opacity: 1; transform: translateY(0); }
        .pr-eyebrow-line { width: 28px; height: 1px; background: #c9a84c; }
        .pr-eyebrow-text {
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.28em;
          text-transform: uppercase; color: #c9a84c;
        }

        .pr-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 900; line-height: 1.05; color: #fff;
          margin: 0 0 16px; letter-spacing: -0.03em;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .pr-title.vis { opacity: 1; transform: translateY(0); }
        .pr-title em { font-style: italic; color: #c9a84c; }

        .pr-divider {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 16px;
          opacity: 0; transition: opacity 0.6s ease 0.25s;
        }
        .pr-divider.vis { opacity: 1; }
        .pr-divider-line { width: 50px; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.5)); }
        .pr-divider-line.r { background: linear-gradient(to left, transparent, rgba(201,168,76,0.5)); }
        .pr-diamond { width: 5px; height: 5px; background: #c9a84c; transform: rotate(45deg); }

        .pr-sub {
          font-size: 0.88rem; font-weight: 300; line-height: 1.8;
          color: rgba(255,255,255,0.45); max-width: 380px; margin: 0 auto;
          opacity: 0; transition: opacity 0.6s ease 0.3s;
        }
        .pr-sub.vis { opacity: 1; }

        /* ── GRID ── */
        .pr-grid {
          position: relative; z-index: 1;
          display: grid;
          gap: 12px;
          padding: 0 12px;
          max-width: 1200px; margin: 0 auto;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 600px)  { .pr-grid { gap: 16px; padding: 0 24px; grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 860px)  { .pr-grid { gap: 18px; padding: 0 32px; grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1100px) { .pr-grid { gap: 20px; padding: 0 40px; grid-template-columns: repeat(4, 1fr); } }

        /* ── CARD ── */
        .pc {
          background: #0d2b10;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(201,168,76,0.12);
          opacity: 0; transform: translateY(28px);
          transition:
            opacity 0.6s ease,
            transform 0.6s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
          cursor: pointer;
        }
        .pc-vis { opacity: 1; transform: translateY(0); }
        .pc:hover {
          border-color: rgba(201,168,76,0.35);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 30px rgba(201,168,76,0.07);
        }

        /* IMAGE */
        .pc-img {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #0a2010;
        }
        .pc-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .pc:hover .pc-img img { transform: scale(1.07); }

        .pc-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(201,168,76,0.1) 50%, transparent 80%);
          transform: translateX(-100%);
          pointer-events: none;
        }
        .pc:hover .pc-shimmer {
          transform: translateX(100%);
          transition: transform 0.7s ease;
        }

        .pc-grad {
          position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
          background: linear-gradient(to top, rgba(10,31,14,0.9) 0%, transparent 100%);
          pointer-events: none;
        }

        .pc-organic {
          position: absolute; top: 7px; left: 7px;
          display: flex; align-items: center; gap: 4px;
          padding: 3px 8px;
          background: rgba(10,31,14,0.85);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 8px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #c9a84c;
        }

        .pc-price {
          position: absolute; top: 7px; right: 7px;
          background: #c9a84c;
          color: #0a1f0e;
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 900;
          padding: 5px 10px;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
          line-height: 1;
        }
        .pc-price-u { font-size: 8px; font-weight: 400; font-family: 'DM Sans', sans-serif; }

        .pc-stars {
          position: absolute; bottom: 8px; left: 8px;
          display: flex; gap: 2px;
        }

        /* desktop hover overlay */
        .pc-hover-cta {
          position: absolute; inset: 0;
          background: rgba(10,31,14,0.5);
          backdrop-filter: blur(2px);
          display: flex; align-items: flex-end; justify-content: center;
          padding-bottom: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pc:hover .pc-hover-cta { opacity: 1; }

        .pc-hover-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          background: #c9a84c; color: #0a1f0e;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px));
          transition: background 0.2s;
        }
        .pc-hover-btn:hover { background: #d4b560; }

        @media (max-width: 768px) {
          .pc-hover-cta { display: none; }
          .pc:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
          .pc:hover .pc-img img { transform: none; }
        }

        /* INFO */
        .pc-info {
          padding: 10px 10px 10px;
          border-top: 1px solid rgba(201,168,76,0.1);
        }
        @media (min-width: 640px) { .pc-info { padding: 12px 14px 12px; } }

        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 13px; font-weight: 700;
          color: #fff; line-height: 1.3; margin: 0 0 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.2s;
        }
        @media (min-width: 640px) { .pc-name { font-size: 15px; } }
        .pc:hover .pc-name { color: #c9a84c; }

        .pc-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 300;
          color: rgba(255,255,255,0.45); line-height: 1.6;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        @media (min-width: 640px) { .pc-desc { font-size: 11px; } }

        /* mobile add btn */
        .pc-add {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 0;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
          transition: all 0.2s ease;
        }
        @media (min-width: 640px) { .pc-add { font-size: 11px; padding: 9px 0; } }
        .pc-add:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.5); }
        .pc-add-done {
          background: #c9a84c !important;
          border-color: #c9a84c !important;
          color: #0a1f0e !important;
        }

        /* ── BOTTOM CTA ── */
        .pr-cta {
          position: relative; z-index: 1;
          display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;
          margin-top: 60px; padding: 0 20px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s;
        }
        .pr-cta.vis { opacity: 1; transform: translateY(0); }

        .pr-cta-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 32px;
          background: #c9a84c; color: #0a1f0e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          border: none; cursor: pointer; text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .pr-cta-btn:hover { background: #d4b560; box-shadow: 0 8px 28px rgba(201,168,76,0.35); transform: translateY(-2px); }

        .pr-cta-ghost {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 32px;
          background: transparent; color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.12); cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
        }
        .pr-cta-ghost:hover { border-color: rgba(201,168,76,0.4); color: #c9a84c; }

        /* empty */
        .pr-empty {
          position: relative; z-index: 1;
          text-align: center; padding: 60px 20px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
        }

        @media (max-width: 640px) {
          .pr-s { padding: 72px 0 60px; }
          .pr-head { margin-bottom: 40px; }
        }
      `}</style>

      <section
        id="products"
        className="pr-s"
        style={sectionBg}
        ref={sectionRef}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="pr-grid-bg" />
        <div className="pr-blob pr-blob-1" />
        <div className="pr-blob pr-blob-2" />
        <div className="pr-grain" />

        {/* HEADER */}
        <div className="pr-head">
          <div className={`pr-eyebrow ${sectionVisible ? 'vis' : ''}`}>
            <div className="pr-eyebrow-line" />
            <span className="pr-eyebrow-text">
              {lang === 'ar' ? 'مجموعتنا' : lang === 'fr' ? 'Notre Collection' : 'Our Collection'}
            </span>
            <div className="pr-eyebrow-line" style={{ transform: 'rotate(180deg)' }} />
          </div>

          <h2 className={`pr-title ${sectionVisible ? 'vis' : ''}`}>
            {t.title.includes(' ') ? (
              <>{t.title.split(' ').slice(0,-1).join(' ')} <em>{t.title.split(' ').slice(-1)}</em></>
            ) : <em>{t.title}</em>}
          </h2>

          <div className={`pr-divider ${sectionVisible ? 'vis' : ''}`}>
            <div className="pr-divider-line" />
            <div className="pr-diamond" />
            <div className="pr-divider-line r" />
          </div>

          <p className={`pr-sub ${sectionVisible ? 'vis' : ''}`}>
            {lang === 'ar' ? 'منتجات طبيعية أصيلة، مصنوعة بشغف من قِبَل أيدٍ محلية' :
             lang === 'fr' ? 'Produits naturels et authentiques, fabriqués avec passion par des mains locales' :
             'Authentic natural products, crafted with passion by local hands'}
          </p>
        </div>

        {/* GRID */}
        <div className="pr-grid">
          {products.map((product, index) => (
            <div key={product.id} data-product-id={product.id} className="pca">
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

        {products.length === 0 && (
          <div className="pr-empty">
            <ShoppingBag size={32} color="#c9a84c" style={{ marginBottom:12, opacity:0.5 }} />
            <p>{lang === 'ar' ? 'لا توجد منتجات متاحة' :
                lang === 'fr' ? 'Aucun produit disponible' :
                'No products available'}</p>
          </div>
        )}

        {/* CTA */}
        {products.length > 0 && (
          <div className={`pr-cta ${sectionVisible ? 'vis' : ''}`}>
            <button className="pr-cta-btn">
              <ShoppingBag size={14} />
              <span>{lang === 'ar' ? 'مشاهدة كل المنتجات' :
                     lang === 'fr' ? 'Voir Tous les Produits' :
                     'View All Products'}</span>
              <ArrowRight size={13} />
            </button>
            <button className="pr-cta-ghost">
              <span>{lang === 'ar' ? 'معرفة المزيد' :
                     lang === 'fr' ? 'En Savoir Plus' :
                     'Learn More'}</span>
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Products;
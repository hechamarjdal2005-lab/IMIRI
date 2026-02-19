import React, { useState, useEffect } from 'react';
import { Language, CartItem, Product } from './types';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import CartDrawer from './components/CartDrawer';
import { AdminDashboard } from './src/admin/index';

const App: React.FC = () => {
  const [lang, setLang]           = useState<Language>('en');
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminTaps, setAdminTaps] = useState(0);

  const t     = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  // 5 taps rapides pour ouvrir admin (mobile-friendly)
  const handleAdminTap = () => {
    const next = adminTaps + 1;
    setAdminTaps(next);
    if (next >= 5) {
      setIsAdminMode(true);
      setAdminTaps(0);
    }
    setTimeout(() => setAdminTaps(0), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isAdminMode) {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={() => setIsAdminMode(false)}
          style={{
            position: 'fixed', top: 12, left: 12, zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: '#0d2b10',
            color: 'white',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          ← Site
        </button>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${isRTL ? 'font-arabic' : lang === 'ama' ? 'font-tifinagh' : ''}`}>

      {/* ── Admin trigger button ── */}
      <button
        onClick={handleAdminTap}
        title="Admin"
        style={{
          position: 'fixed',
          bottom: 80,        /* au-dessus du WhatsApp */
          left: 16,
          zIndex: 9998,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(4px)',
          /* affiche le nombre de taps restants */
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {adminTaps > 0 ? (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#c9a84c' }}>
            {5 - adminTaps}
          </span>
        ) : '⚙'}
      </button>

      <Navbar
        currentLang={lang}
        setLang={setLang}
        t={t.nav}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero     t={t.hero}     isRTL={isRTL} lang={lang} />
        <About    lang={lang} />
        <Products t={t.products} lang={lang}   onAdd={addToCart} />
        <Contact  lang={lang} />
      </main>

      <Footer t={t.nav} lang={lang} />
      <FloatingWhatsApp />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        t={t.cart}
        lang={lang}
      />
    </div>
  );
};

export default App;
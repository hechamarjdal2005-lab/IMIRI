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
  const [lang, setLang] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

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
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Mode Admin ─────────────────────────────────────────────
  if (isAdminMode) {
    return <AdminDashboard />;
  }

  // ── Site principal ─────────────────────────────────────────
  return (
    <div className={`min-h-screen font-sans ${isRTL ? 'font-arabic' : lang === 'ama' ? 'font-tifinagh' : ''}`}>
      {/* Bouton admin caché */}
      <button
        onClick={() => setIsAdminMode(true)}
        className="fixed bottom-2 left-2 opacity-10 hover:opacity-100 z-50 text-xs bg-gray-800 text-white p-2 rounded transition-opacity"
        title="Admin"
      >
        ⚙
      </button>

      <Navbar
        currentLang={lang}
        setLang={setLang}
        t={t.nav}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero t={t.hero} isRTL={isRTL} />
        <About lang={lang} />
        <Products t={t.products} lang={lang} onAdd={addToCart} />
        <Contact lang={lang} />
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
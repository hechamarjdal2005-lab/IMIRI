import React from 'react';
import { X, Minus, Plus, ShoppingBasket, MessageCircle, ArrowRight } from 'lucide-react';
import { CartItem, Language } from '../types';
import { SOCIAL_LINKS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  t: {
    title: string;
    empty: string;
    total: string;
    sendOrder: string;
    items: string;
  };
  lang: Language;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen, onClose, cart, onRemove, onUpdateQty, t, lang
}) => {
  const total  = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isRTL  = lang === 'ar' || lang === 'ama';

  const sendToWhatsApp = () => {
    let message = `*IMIRI — New Order*\n\n`;
    cart.forEach(item => {
      message += `• ${item.quantity}× ${item.product.name[lang]} — ${item.product.price * item.quantity} DH\n`;
    });
    message += `\n*Total: ${total} DH*\n\nPlease confirm my order.`;
    window.open(
      `https://wa.me/${SOCIAL_LINKS.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── BACKDROP ── */
        .cd-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(5, 12, 6, 0.75);
          backdrop-filter: blur(6px);
          animation: cdFadeIn 0.25s ease;
        }
        @keyframes cdFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── DRAWER ── */
        .cd-drawer {
          position: fixed; top: 0; bottom: 0; z-index: 101;
          width: 100%; max-width: 420px;
          background: linear-gradient(180deg, #0d2b10 0%, #0a1f0e 100%);
          display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          border-left: 1px solid rgba(201,168,76,0.15);
          animation: cdSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cd-drawer.rtl {
          right: auto; left: 0;
          border-left: none; border-right: 1px solid rgba(201,168,76,0.15);
          animation: cdSlideInRTL 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cd-drawer:not(.rtl) { right: 0; }

        @keyframes cdSlideIn    { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cdSlideInRTL { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        /* Grain overlay */
        .cd-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ── HEADER ── */
        .cd-header {
          position: relative; z-index: 1;
          padding: 28px 24px 22px;
          border-bottom: 1px solid rgba(201,168,76,0.12);
          background: linear-gradient(to bottom, rgba(26,77,30,0.5), transparent);
          flex-shrink: 0;
        }

        /* Gold top accent */
        .cd-header::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #c9a84c, transparent);
        }

        .cd-header-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }

        .cd-header-left { display: flex; align-items: center; gap: 14px; }

        .cd-header-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #c9a84c;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }

        .cd-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; font-weight: 900; color: #fff;
          letter-spacing: -0.02em; line-height: 1;
        }
        .cd-header-count {
          font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); margin-top: 3px;
        }

        .cd-close {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .cd-close:hover {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.3);
          color: rgba(255,255,255,0.9);
        }

        /* ── ITEMS LIST ── */
        .cd-list {
          flex: 1; overflow-y: auto;
          padding: 20px 20px;
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 12px;
        }
        .cd-list::-webkit-scrollbar { width: 3px; }
        .cd-list::-webkit-scrollbar-track { background: transparent; }
        .cd-list::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }

        /* ── EMPTY STATE ── */
        .cd-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 24px; text-align: center; gap: 20px;
        }
        .cd-empty-icon {
          width: 72px; height: 72px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.18);
          display: flex; align-items: center; justify-content: center;
          color: rgba(201,168,76,0.5);
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        }
        .cd-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700; color: rgba(255,255,255,0.6);
        }
        .cd-empty-sub {
          font-size: 0.8rem; color: rgba(255,255,255,0.25); margin-top: -12px;
        }
        .cd-empty-btn {
          padding: 12px 28px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background 0.2s;
        }
        .cd-empty-btn:hover { background: rgba(201,168,76,0.18); }

        /* ── CART ITEM ── */
        .cd-item {
          display: flex; gap: 14px;
          padding: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.08);
          position: relative; overflow: hidden;
          transition: border-color 0.2s, background 0.2s;
          animation: cdItemIn 0.35s ease both;
        }
        @keyframes cdItemIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cd-item:hover {
          border-color: rgba(201,168,76,0.2);
          background: rgba(201,168,76,0.03);
        }

        /* Gold left accent */
        .cd-item::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .cd-item:hover::before { opacity: 1; }

        .cd-item-img {
          width: 72px; height: 72px; flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(201,168,76,0.1);
          position: relative;
        }
        .cd-item-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .cd-item:hover .cd-item-img img { transform: scale(1.08); }

        /* Qty badge on image */
        .cd-item-qty-badge {
          position: absolute; top: 4px; right: 4px;
          width: 20px; height: 20px;
          background: #c9a84c; color: #0a1f0e;
          font-size: 0.62rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
        }

        .cd-item-body { flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; }

        .cd-item-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .cd-item-name {
          font-size: 0.88rem; font-weight: 600; color: rgba(255,255,255,0.85);
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .cd-item-remove {
          width: 24px; height: 24px; flex-shrink: 0;
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .cd-item-remove:hover { color: #e57373; }

        .cd-item-bottom { display: flex; justify-content: space-between; align-items: center; }

        .cd-item-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 700; color: #c9a84c;
        }

        /* Qty controls */
        .cd-qty {
          display: flex; align-items: center; gap: 0;
          border: 1px solid rgba(201,168,76,0.2);
          overflow: hidden;
        }
        .cd-qty-btn {
          width: 28px; height: 28px;
          background: rgba(201,168,76,0.08);
          border: none; cursor: pointer;
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .cd-qty-btn:hover { background: rgba(201,168,76,0.18); color: #c9a84c; }
        .cd-qty-num {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.8);
          border-left: 1px solid rgba(201,168,76,0.12);
          border-right: 1px solid rgba(201,168,76,0.12);
          background: rgba(255,255,255,0.02);
        }

        /* ── FOOTER ── */
        .cd-footer {
          position: relative; z-index: 1;
          padding: 20px 20px 24px;
          border-top: 1px solid rgba(201,168,76,0.1);
          background: linear-gradient(to top, rgba(10,31,14,0.8), transparent);
          flex-shrink: 0;
        }

        .cd-total-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .cd-total-label {
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .cd-total-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 900; color: #c9a84c;
          letter-spacing: -0.03em; line-height: 1;
        }
        .cd-total-sub {
          font-size: 0.62rem; color: rgba(255,255,255,0.2);
          text-align: right; margin-top: 2px;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
        }

        /* WhatsApp CTA */
        .cd-wa-btn {
          width: 100%; padding: 16px 0;
          background: #c9a84c; color: #0a1f0e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          position: relative; overflow: hidden;
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 8px 28px rgba(201,168,76,0.3);
          margin-bottom: 14px;
        }
        .cd-wa-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%);
          transform: translateX(-100%);
          transition: transform 0s;
        }
        .cd-wa-btn:hover {
          background: #d4b560;
          box-shadow: 0 12px 36px rgba(201,168,76,0.4);
          transform: translateY(-2px);
        }
        .cd-wa-btn:hover::before {
          transform: translateX(100%);
          transition: transform 0.7s ease;
        }
        .cd-wa-btn:active { transform: translateY(0) scale(0.99); }

        /* Trust badges */
        .cd-trust {
          display: flex; align-items: center; justify-content: center; gap: 20px;
        }
        .cd-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.65rem; color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
        .cd-trust-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(201,168,76,0.4);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .cd-drawer { max-width: 100%; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="cd-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className={`cd-drawer ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="cd-grain" />

        {/* ── HEADER ── */}
        <div className="cd-header">
          <div className="cd-header-row">
            <div className="cd-header-left">
              <div className="cd-header-icon">
                <ShoppingBasket size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="cd-header-title">{t.title}</div>
                <div className="cd-header-count">{cart.length} {t.items}</div>
              </div>
            </div>
            <button className="cd-close" onClick={onClose} aria-label="Close">
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── ITEMS ── */}
        {cart.length === 0 ? (
          <div className="cd-empty" style={{ position: 'relative', zIndex: 1 }}>
            <div className="cd-empty-icon">
              <ShoppingBasket size={28} strokeWidth={1.5} />
            </div>
            <div>
              <div className="cd-empty-title">{t.empty}</div>
              <div className="cd-empty-sub">
                {lang === 'ar' ? 'أضف بعض المنتجات!' :
                 lang === 'fr' ? 'Ajoutez des produits !' :
                 'Add some products!'}
              </div>
            </div>
            <button className="cd-empty-btn" onClick={onClose}>
              {lang === 'ar' ? 'متابعة التسوق' :
               lang === 'fr' ? 'Continuer' :
               'Continue Shopping'}
            </button>
          </div>
        ) : (
          <div className="cd-list">
            {cart.map((item, i) => (
              <div
                key={item.product.id}
                className="cd-item"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="cd-item-img">
                  <img src={item.product.image} alt={item.product.name[lang]} loading="lazy" />
                  <div className="cd-item-qty-badge">{item.quantity}</div>
                </div>

                {/* Body */}
                <div className="cd-item-body">
                  <div className="cd-item-top">
                    <span className="cd-item-name">{item.product.name[lang]}</span>
                    <button className="cd-item-remove" onClick={() => onRemove(item.product.id)}>
                      <X size={13} strokeWidth={1.8} />
                    </button>
                  </div>
                  <div className="cd-item-bottom">
                    <span className="cd-item-price">
                      {item.product.price * item.quantity} DH
                    </span>
                    <div className="cd-qty">
                      <button className="cd-qty-btn" onClick={() => onUpdateQty(item.product.id, -1)}>
                        <Minus size={11} strokeWidth={2} />
                      </button>
                      <span className="cd-qty-num">{item.quantity}</span>
                      <button className="cd-qty-btn" onClick={() => onUpdateQty(item.product.id, 1)}>
                        <Plus size={11} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── FOOTER ── */}
        {cart.length > 0 && (
          <div className="cd-footer">
            {/* Total */}
            <div className="cd-total-row">
              <span className="cd-total-label">{t.total}</span>
              <div>
                <div className="cd-total-val">{total} DH</div>
                <div className="cd-total-sub">
                  {lang === 'ar' ? 'شامل الضرائب' :
                   lang === 'fr' ? 'Taxes incluses' :
                   'All taxes included'}
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <button className="cd-wa-btn" onClick={sendToWhatsApp}>
              <MessageCircle size={16} strokeWidth={1.8} />
              <span>{t.sendOrder}</span>
              <ArrowRight size={14} strokeWidth={2} />
            </button>

            {/* Trust */}
            <div className="cd-trust">
              <div className="cd-trust-item">
                <div className="cd-trust-dot" />
                {lang === 'ar' ? 'طلب آمن' : lang === 'fr' ? 'Commande sécurisée' : 'Secure Order'}
              </div>
              <div className="cd-trust-item">
                <div className="cd-trust-dot" />
                {lang === 'ar' ? 'توصيل سريع' : lang === 'fr' ? 'Livraison rapide' : 'Fast Delivery'}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
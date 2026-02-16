
import React from 'react';
import { X, Minus, Plus, ShoppingBasket, MessageCircle } from 'lucide-react';
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
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onUpdateQty, 
  t, 
  lang 
}) => {
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const isRTL = lang === 'ar';

  const sendToWhatsApp = () => {
    let message = `*IMIRI - New Order*\n\n`;
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.product.name[lang]} (${item.product.price * item.quantity} DH)\n`;
    });
    message += `\n*Total: ${total} DH*\n\n`;
    message += `I would like to confirm this order. Please contact me for details.`;
    
    const url = `https://wa.me/${SOCIAL_LINKS.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      <div className={`fixed top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col animate-in slide-in-from-${isRTL ? 'left' : 'right'} duration-300`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <ShoppingBasket className="text-emerald-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">{t.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-300">
                <ShoppingBasket size={40} />
              </div>
              <p className="text-slate-500">{t.empty}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex space-x-4 rtl:space-x-reverse animate-in slide-in-from-bottom-2">
                <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name[lang]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.product.name[lang]}</h3>
                    <button onClick={() => onRemove(item.product.id)} className="text-xs text-red-400 hover:text-red-600">
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-emerald-600 font-bold text-sm mt-1">{item.product.price * item.quantity} DH</p>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mt-3">
                    <button 
                      onClick={() => onUpdateQty(item.product.id, -1)}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQty(item.product.id, 1)}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">{t.total}</span>
              <span className="text-2xl font-bold text-slate-800">{total} DH</span>
            </div>
            <button 
              onClick={sendToWhatsApp}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-3 rtl:space-x-reverse transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle size={20} />
              <span>{t.sendOrder}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;


import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsapp.replace('+', '')}`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-[100] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block border border-slate-100">
        Need help? Chat with us
      </span>
    </button>
  );
};

export default FloatingWhatsApp;

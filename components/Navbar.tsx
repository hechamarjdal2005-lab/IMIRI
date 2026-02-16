
import React, { useState } from 'react';
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

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'ama', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <img src="https://i.ibb.co/VWVv264/logo-imiri.png" alt="IMIRI" className="h-12 w-auto hidden" />
              <span className="text-2xl font-bold text-emerald-700 tracking-wider">IMIRI</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <a href="#home" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">{t.home}</a>
            <a href="#about" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">{t.about}</a>
            <a href="#products" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">{t.products}</a>
            <a href="#contact" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">{t.contact}</a>
            
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              {/* Cart Button */}
              <button 
                onClick={onCartClick}
                className="relative p-2 text-emerald-700 hover:bg-emerald-50 rounded-full transition-all"
              >
                <ShoppingBasket size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1 text-slate-600 hover:text-emerald-600 transition-colors py-2"
                >
                  <Globe size={18} />
                  <span className="uppercase text-sm font-bold">{currentLang}</span>
                  <ChevronDown size={14} />
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-emerald-50 py-2 animate-in fade-in slide-in-from-top-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors ${currentLang === l.code ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-emerald-700"
            >
              <ShoppingBasket size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-emerald-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-50 animate-in slide-in-from-top pb-6">
          <div className="px-4 pt-2 pb-3 space-y-2 flex flex-col items-center">
            <a href="#home" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-slate-700">{t.home}</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-slate-700">{t.about}</a>
            <a href="#products" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-slate-700">{t.products}</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-slate-700">{t.contact}</a>
            <div className="pt-4 flex space-x-4 rtl:space-x-reverse">
               {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setIsOpen(false); }}
                  className={`px-3 py-1 rounded-full border text-xs ${currentLang === l.code ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

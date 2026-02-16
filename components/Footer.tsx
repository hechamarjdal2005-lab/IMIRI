
import React from 'react';
import { Language } from '../types';

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
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-8 mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white tracking-widest">IMIRI</h2>
            <p className="mt-2 max-w-xs text-sm">Empowering communities through nature's purest gifts. Since 2024.</p>
          </div>
          
          <div className="flex space-x-8 rtl:space-x-reverse">
            <a href="#home" className="hover:text-emerald-500 transition-colors">{t.home}</a>
            <a href="#about" className="hover:text-emerald-500 transition-colors">{t.about}</a>
            <a href="#products" className="hover:text-emerald-500 transition-colors">{t.products}</a>
            <a href="#contact" className="hover:text-emerald-500 transition-colors">{t.contact}</a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} IMIRI Cooperative. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with ❤️ for Moroccan Tradition</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

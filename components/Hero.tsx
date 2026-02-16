
import React from 'react';

interface HeroProps {
  t: {
    title: string;
    subtitle: string;
    cta: string;
  };
  isRTL: boolean;
}

const Hero: React.FC<HeroProps> = ({ t, isRTL }) => {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1594913366289-54848d7d9692?auto=format&fit=crop&q=80&w=2000" 
          alt="Moroccan Nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-emerald-900/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 mb-10 leading-relaxed drop-shadow-md">
            {t.subtitle}
          </p>
          <a 
            href="#products" 
            className="inline-block px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl"
          >
            {t.cta}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

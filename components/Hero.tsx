import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { HeroBackground } from '../types';
import { transformHero } from '../utils/transformHero';

interface HeroProps {
  t: {
    title: string;
    subtitle: string;
    cta: string;
  };
  isRTL: boolean;
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const Hero: React.FC<HeroProps> = ({ t, isRTL, lang }) => {
  const [hero, setHero] = useState<HeroBackground | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_background')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        const transformed = transformHero(data);
        setHero(transformed);
      }
    } catch (err) {
      console.error('Error fetching hero:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-pulse text-center">
          <div className="h-16 bg-slate-300 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-300 rounded w-64 mx-auto"></div>
        </div>
      </section>
    );
  }

  // Get content based on language
  const getTitle = () => {
    if (!hero) return t.title;
    switch (lang) {
      case 'en': return hero.title_en;
      case 'fr': return hero.title_fr;
      case 'ar': return hero.title_ar;
      case 'ama': return hero.title_ama;
      default: return hero.title_en;
    }
  };

  const getSubtitle = () => {
    if (!hero) return t.subtitle;
    switch (lang) {
      case 'en': return hero.subtitle_en || t.subtitle;
      case 'fr': return hero.subtitle_fr || t.subtitle;
      case 'ar': return hero.subtitle_ar || t.subtitle;
      case 'ama': return hero.subtitle_ama || t.subtitle;
      default: return hero.subtitle_en || t.subtitle;
    }
  };

  const getCtaText = () => {
    if (!hero) return t.cta;
    switch (lang) {
      case 'en': return hero.cta_text_en;
      case 'fr': return hero.cta_text_fr;
      case 'ar': return hero.cta_text_ar;
      case 'ama': return hero.cta_text_ama;
      default: return hero.cta_text_en;
    }
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${hero?.image_url || 'https://images.unsplash.com/photo-1534234828563-02598db89e1e?w=1920&h=1080&fit=crop'})`
      }}
    >
      {/* Overlay */}
      {hero?.overlay_enabled && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: hero.overlay_color }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
          {getTitle()}
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
          {getSubtitle()}
        </p>
        
        <a
          href={hero?.cta_link || '#products'}
          className="inline-block px-10 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-2xl text-lg"
        >
          {getCtaText()}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
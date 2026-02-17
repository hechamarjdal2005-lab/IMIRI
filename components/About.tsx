import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { About } from '../types';
import { transformAbout } from '../utils/transformAbout';
import { Leaf, Award, Users, MapPin } from 'lucide-react';

interface AboutProps {
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const transformed = transformAbout(data);
        setAbout(transformed);
      }
    } catch (err) {
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-48 mx-auto mb-8"></div>
            <div className="h-4 bg-slate-100 rounded w-full max-w-2xl mx-auto mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-full max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load about information</p>
        </div>
      </section>
    );
  }

  const getSectionLabel = () => {
    switch (lang) {
      case 'en': return about.section_label_en;
      case 'fr': return about.section_label_fr;
      case 'ar': return about.section_label_ar;
      case 'ama': return about.section_label_ama;
      default: return about.section_label_en;
    }
  };

  const getStoryTitle = () => {
    switch (lang) {
      case 'en': return about.story_title_en;
      case 'fr': return about.story_title_fr;
      case 'ar': return about.story_title_ar;
      case 'ama': return about.story_title_ama;
      default: return about.story_title_en;
    }
  };

  const getStoryDescription = () => {
    switch (lang) {
      case 'en': return about.story_description_en;
      case 'fr': return about.story_description_fr;
      case 'ar': return about.story_description_ar;
      case 'ama': return about.story_description_ama;
      default: return about.story_description_en;
    }
  };

  const getBadgeText = () => {
    switch (lang) {
      case 'en': return about.badge_text_en;
      case 'fr': return about.badge_text_fr;
      case 'ar': return about.badge_text_ar;
      case 'ama': return about.badge_text_ama;
      default: return about.badge_text_en;
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'leaf': return <Leaf size={24} />;
      case 'award': return <Award size={24} />;
      case 'users': return <Users size={24} />;
      case 'map-pin': return <MapPin size={24} />;
      default: return <Leaf size={24} />;
    }
  };

  const getValueText = (value: any) => {
    switch (lang) {
      case 'en': return value.text_en;
      case 'fr': return value.text_fr;
      case 'ar': return value.text_ar;
      case 'ama': return value.text_ama;
      default: return value.text_en;
    }
  };

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <p className="text-emerald-600 font-semibold text-sm mb-2">
              {getSectionLabel()}
            </p>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">{getStoryTitle()}</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              {getStoryDescription()}
            </p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {about.values.map((value, index) => (
                <div 
                  key={index}
                  className="p-6 bg-emerald-50/50 rounded-2xl flex flex-col items-center text-center hover:bg-emerald-50 transition-colors"
                >
                  <div className="text-emerald-600 mb-3">
                    {getIconComponent(value.icon)}
                  </div>
                  <p className="text-slate-700 font-medium">{getValueText(value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img 
              src={about.image_url} 
              alt={getStoryTitle()}
              className="rounded-3xl w-full h-[600px] object-cover shadow-2xl"
            />
            <div className="absolute bottom-8 left-8 bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
              <p className="text-2xl font-bold">{getBadgeText()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
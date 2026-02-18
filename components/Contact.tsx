import React, { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import type { Contact } from '../types';
import { transformContact } from '../utils/transformContact';
import { MessageSquare, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

interface ContactProps {
  lang: 'en' | 'fr' | 'ar' | 'ama';
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const transformed = transformContact(data);
        setContact(transformed);
      }
    } catch (err) {
      console.error('Error fetching contact:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-8"></div>
            <div className="space-y-4 max-w-md mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!contact) {
    return (
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load contact information</p>
        </div>
      </section>
    );
  }

  const getTitle = () => {
    switch (lang) {
      case 'en': return contact.title_en;
      case 'fr': return contact.title_fr;
      case 'ar': return contact.title_ar;
      case 'ama': return contact.title_ama;
      default: return contact.title_en;
    }
  };

  const getLocation = () => {
    switch (lang) {
      case 'en': return contact.location_en;
      case 'fr': return contact.location_fr;
      case 'ar': return contact.location_ar;
      case 'ama': return contact.location_ama;
      default: return contact.location_en;
    }
  };

  // Fallback OpenStreetMap URL if no embed URL is set
  const fallbackMapSrc = "https://www.openstreetmap.org/export/embed.html?bbox=-9.65%2C30.38%2C-9.55%2C30.46&layer=mapnik&marker=30.4202%2C-9.5970";

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
          {getTitle()}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info - Left Side */}
          <div className="space-y-6">
            {/* Phone / WhatsApp */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse p-6 rounded-2xl hover:bg-slate-50 transition-colors bg-slate-50/50">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">Chat with us</p>
                <a 
                  href={`https://wa.me/${contact.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse p-6 rounded-2xl hover:bg-slate-50 transition-colors bg-slate-50/50">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">Email Us</p>
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse p-6 rounded-2xl hover:bg-slate-50 transition-colors bg-slate-50/50">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">Our Location</p>
                <p className="text-slate-500">{getLocation()}</p>
                {contact.google_maps_url && (
                  <a 
                    href={contact.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm hover:text-emerald-700 inline-flex items-center mt-2 font-medium"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6">
              <p className="font-semibold text-slate-800 mb-4 text-lg">Follow Us</p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                {contact.facebook_url && (
                  <a 
                    href={contact.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {contact.instagram_url && (
                  <a 
                    href={contact.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Map - Right Side */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100 bg-slate-100">
                <iframe
                  src={contact.map_embed_url || fallbackMapSrc}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                  className="w-full"
                />
              </div>
              <div className="mt-4 text-center">
                <a 
                  href={contact.google_maps_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MapPin size={20} className="mr-2" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React from 'react';
import { MessageSquare, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

interface ContactProps {
  t: {
    title: string;
    whatsapp: string;
    email: string;
    location: string;
  };
  isRTL: boolean;
}

const Contact: React.FC<ContactProps> = ({ t, isRTL }) => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-8">{t.title}</h2>
            
            <div className="space-y-8">
              <div className={`flex items-start ${isRTL ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-4`}>
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{t.whatsapp}</h4>
                  <p className="text-slate-500">{SOCIAL_LINKS.whatsapp}</p>
                </div>
              </div>

              <div className={`flex items-start ${isRTL ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-4`}>
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{t.email}</h4>
                  <p className="text-slate-500">{SOCIAL_LINKS.email}</p>
                </div>
              </div>

              <div className={`flex items-start ${isRTL ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-4`}>
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{t.location}</h4>
                  <p className="text-slate-500">Agadir, Morocco</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-6 rtl:space-x-reverse">
              <a href={SOCIAL_LINKS.facebook} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href={SOCIAL_LINKS.instagram} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="h-[400px] rounded-3xl overflow-hidden shadow-xl border-8 border-slate-50">
            {/* Using a static image as a placeholder for the map */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110043.19323547119!2d-9.610574013446051!3d30.4132174301724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e941445173%3A0xa0f997235a9d6896!2sAgadir%2080000%2C%20Morocco!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


import React from 'react';
import { Leaf, Award, Users, MapPin } from 'lucide-react';

interface AboutProps {
  t: {
    title: string;
    description: string;
    values: {
      natural: string;
      authentic: string;
      empowerment: string;
      local: string;
    };
  };
}

const About: React.FC<AboutProps> = ({ t }) => {
  const valueIcons = [
    { icon: <Leaf className="text-emerald-600" size={32} />, label: t.values.natural },
    { icon: <Award className="text-emerald-600" size={32} />, label: t.values.authentic },
    { icon: <Users className="text-emerald-600" size={32} />, label: t.values.empowerment },
    { icon: <MapPin className="text-emerald-600" size={32} />, label: t.values.local },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{t.title}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4 mb-6">{t.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {t.description}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {valueIcons.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-emerald-50 rounded-2xl text-center">
                  <div className="mb-4">{item.icon}</div>
                  <span className="font-semibold text-slate-800 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200" 
                alt="Our cooperative" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Artistic badge */}
            <div className="absolute -bottom-8 -left-8 bg-emerald-700 text-white p-8 rounded-2xl hidden lg:block shadow-xl">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm uppercase tracking-wider">Natural & Organic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Save, Loader2 } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const tr = {
  fr: {
    title: 'Gestion du contact', titles: 'Titres', contactInfo: 'Informations de contact',
    phone: 'Téléphone', email: 'E-mail', whatsapp: 'WhatsApp',
    locations: 'Adresses (Locations)', mapEmbed: 'URL d\'intégration Google Maps',
    social: 'Réseaux sociaux',
    save: 'Enregistrer', saving: 'Enregistrement...',
    successSave: 'Enregistré avec succès !', errSave: 'Erreur : ',
    loading: 'Chargement...',
  },
  ar: {
    title: 'إدارة معلومات الاتصال', titles: 'العناوين', contactInfo: 'معلومات التواصل',
    phone: 'الهاتف', email: 'البريد الإلكتروني', whatsapp: 'واتساب',
    locations: 'المواقع', mapEmbed: 'رابط خريطة Google (Embed)',
    social: 'التواصل الاجتماعي',
    save: 'حفظ التغييرات', saving: 'جاري الحفظ...',
    successSave: 'تم الحفظ بنجاح!', errSave: 'خطأ: ',
    loading: 'جاري التحميل...',
  }
};

interface ContactData {
  id: number;
  title_en: string; title_fr: string; title_ar: string; title_ama: string;
  phone: string; email: string;
  location_en: string; location_fr: string; location_ar: string; location_ama: string;
  facebook_url: string; instagram_url: string; twitter_url: string;
  whatsapp_number: string; map_embed_url: string;
}

const defaultData: ContactData = {
  id: 0, title_en: '', title_fr: '', title_ar: '', title_ama: '',
  phone: '', email: '',
  location_en: '', location_fr: '', location_ar: '', location_ama: '',
  facebook_url: '', instagram_url: '', twitter_url: '',
  whatsapp_number: '', map_embed_url: ''
};

const langs = ['ar', 'en', 'fr', 'ama'] as const;

export const ContactAdmin: React.FC<{ adminLang: AdminLang }> = ({ adminLang }) => {
  const t = tr[adminLang];
  const isRTL = adminLang === 'ar';
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchContact(); }, []);

  const fetchContact = async () => {
    setLoading(true);
    const { data: row } = await supabase.from('contact').select('*').limit(1).single();
    setData(row ?? defaultData);
    setLoading(false);
  };

  const set = (field: keyof ContactData, value: string) =>
    setData(prev => prev ? { ...prev, [field]: value } : null);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3500); };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { id, ...payload } = data;
    let error;
    if (id && id !== 0) {
      ({ error } = await supabase.from('contact').update(payload).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('contact').insert([payload]).select().single();
      error = e;
      if (!e && inserted) setData({ ...data, id: inserted.id });
    }
    setSaving(false);
    showMsg(error ? t.errSave + error.message : t.successSave);
  };

  if (loading) return <div className="text-center py-12 text-gray-400">{t.loading}</div>;
  if (!data) return null;

  const inp = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm";
  const lbl = "text-xs text-gray-500 mb-1 block";
  const secTitle = "text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 mt-6 block";
  const isErr = (m: string) => m.includes('rr') || m.includes('خط') || m.includes('reur');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>

      {message && (
        <div className={`p-3 mb-5 rounded-lg text-sm ${isErr(message) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Titles */}
      <span className={secTitle}>{t.titles}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className={lbl}>{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`title_${lang}`]}
              onChange={e => set(`title_${lang}` as keyof ContactData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <span className={secTitle}>{t.contactInfo}</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
        <div>
          <label className={lbl}>{t.phone}</label>
          <input className={inp} value={data.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label className={lbl}>{t.email}</label>
          <input type="email" className={inp} value={data.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className={lbl}>{t.whatsapp}</label>
          <input className={inp} placeholder="+212600000000" value={data.whatsapp_number}
            onChange={e => set('whatsapp_number', e.target.value)} />
        </div>
      </div>

      {/* Locations */}
      <span className={secTitle}>{t.locations}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {langs.map(lang => (
          <div key={lang}>
            <label className={lbl}>{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`location_${lang}`]}
              onChange={e => set(`location_${lang}` as keyof ContactData, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="pb-6 border-b border-gray-100">
        <label className={lbl}>{t.mapEmbed}</label>
        <input className={inp} placeholder="https://www.google.com/maps/embed?..."
          value={data.map_embed_url} onChange={e => set('map_embed_url', e.target.value)} />
        {data.map_embed_url && (
          <div className="mt-3 rounded-xl overflow-hidden border h-44">
            <iframe src={data.map_embed_url} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
          </div>
        )}
      </div>

      {/* Social */}
      <span className={secTitle}>{t.social}</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Facebook', field: 'facebook_url' as keyof ContactData, placeholder: 'https://facebook.com/...' },
          { label: 'Instagram', field: 'instagram_url' as keyof ContactData, placeholder: 'https://instagram.com/...' },
          { label: 'Twitter / X', field: 'twitter_url' as keyof ContactData, placeholder: 'https://twitter.com/...' },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className={lbl}>{label}</label>
            <input className={inp} placeholder={placeholder}
              value={(data as any)[field]} onChange={e => set(field, e.target.value)} />
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors gap-2">
        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {saving ? t.saving : t.save}
      </button>
    </div>
  );
};
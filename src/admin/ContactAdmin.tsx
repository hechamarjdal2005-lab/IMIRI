import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2 } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const tr = {
  fr: {
    title: 'Gestion du contact', titles: 'Titres', contactInfo: 'Informations de contact',
    phone: 'Téléphone', email: 'E-mail', whatsapp: 'WhatsApp',
    locations: 'Adresses', mapEmbed: "URL d'intégration Google Maps",
    social: 'Réseaux sociaux', save: 'Enregistrer', saving: 'Enregistrement...',
    successSave: 'Enregistré !', errSave: 'Erreur : ', loading: 'Chargement...',
  },
  ar: {
    title: 'إدارة معلومات الاتصال', titles: 'العناوين', contactInfo: 'معلومات التواصل',
    phone: 'الهاتف', email: 'البريد الإلكتروني', whatsapp: 'واتساب',
    locations: 'المواقع', mapEmbed: 'رابط خريطة Google (Embed)',
    social: 'التواصل الاجتماعي', save: 'حفظ', saving: 'جاري الحفظ...',
    successSave: 'تم الحفظ!', errSave: 'خطأ: ', loading: 'جاري التحميل...',
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

const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #d1d5db', borderRadius: 8,
  padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = { fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' };
const secTitle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 12, marginTop: 24, display: 'block',
};

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
  const isErr = (m: string) => m.includes('Err') || m.includes('خط') || m.includes('reur');

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

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>{t.loading}</div>;
  if (!data) return null;

  const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 };
  const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 };
  const divider: React.CSSProperties = { borderBottom: '1px solid #f3f4f6', paddingBottom: 20, marginBottom: 4 };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 24, marginTop: 0 }}>{t.title}</h2>

      {message && (
        <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 14, background: isErr(message) ? '#fef2f2' : '#f0fdf4', color: isErr(message) ? '#dc2626' : '#16a34a' }}>
          {message}
        </div>
      )}

      {/* Titles */}
      <span style={secTitle}>{t.titles}</span>
      <div style={{ ...grid4, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`title_${lang}`]}
              onChange={e => set(`title_${lang}` as keyof ContactData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Contact info */}
      <span style={secTitle}>{t.contactInfo}</span>
      <div style={{ ...grid3, ...divider }}>
        <div>
          <label style={lbl}>{t.phone}</label>
          <input style={inp} value={data.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>{t.email}</label>
          <input type="email" style={inp} value={data.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>{t.whatsapp}</label>
          <input style={inp} placeholder="+212661675643" value={data.whatsapp_number}
            onChange={e => set('whatsapp_number', e.target.value)} />
        </div>
      </div>

      {/* Locations */}
      <span style={secTitle}>{t.locations}</span>
      <div style={{ ...grid4, marginBottom: 12 }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`location_${lang}`]}
              onChange={e => set(`location_${lang}` as keyof ContactData, e.target.value)} />
          </div>
        ))}
      </div>
      <div style={divider}>
        <label style={lbl}>{t.mapEmbed}</label>
        <input style={inp} placeholder="https://www.google.com/maps/embed?..."
          value={data.map_embed_url} onChange={e => set('map_embed_url', e.target.value)} />
        {data.map_embed_url && (
          <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', height: 180 }}>
            <iframe src={data.map_embed_url} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
          </div>
        )}
      </div>

      {/* Social */}
      <span style={secTitle}>{t.social}</span>
      <div style={{ ...grid3, marginBottom: 32 }}>
        {[
          { label: 'Facebook', field: 'facebook_url', ph: 'https://facebook.com/...' },
          { label: 'Instagram', field: 'instagram_url', ph: 'https://instagram.com/...' },
          { label: 'Twitter / X', field: 'twitter_url', ph: 'https://twitter.com/...' },
        ].map(({ label, field, ph }) => (
          <div key={field}>
            <label style={lbl}>{label}</label>
            <input style={inp} placeholder={ph}
              value={(data as any)[field]} onChange={e => set(field as keyof ContactData, e.target.value)} />
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: saving ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? t.saving : t.save}
      </button>
    </div>
  );
};
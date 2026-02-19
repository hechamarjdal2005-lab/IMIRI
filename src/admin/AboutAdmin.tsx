import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const BUCKET = 'uploads';

const tr = {
  fr: {
    title: 'Gestion de "À propos"', save: 'Enregistrer', saving: 'Enregistrement...',
    loading: 'Chargement...', successSave: 'Enregistré !', errSave: 'Erreur : ', errUpload: 'Erreur upload : ',
    secLabel: 'Libellé de section', secStory: 'Histoire', secBadge: 'Badge',
    secImage: 'Image principale', imageUrl: "URL de l'image",
    orUpload: 'ou importer depuis votre ordinateur', uploadBtn: 'Choisir une image', uploading: 'Envoi...',
    secValues: 'Nos valeurs', addValue: 'Ajouter', valueN: 'Valeur',
    titleLbl: 'Titre', descLbl: 'Description', noValues: 'Aucune valeur',
  },
  ar: {
    title: 'إدارة "من نحن"', save: 'حفظ', saving: 'جاري الحفظ...',
    loading: 'جاري التحميل...', successSave: 'تم الحفظ!', errSave: 'خطأ: ', errUpload: 'خطأ رفع: ',
    secLabel: 'عنوان القسم', secStory: 'القصة', secBadge: 'الشارة',
    secImage: 'الصورة الرئيسية', imageUrl: 'رابط الصورة',
    orUpload: 'أو رفع من الحاسوب', uploadBtn: 'اختر صورة', uploading: 'جاري الرفع...',
    secValues: 'قيمنا', addValue: 'إضافة', valueN: 'القيمة',
    titleLbl: 'العنوان', descLbl: 'الوصف', noValues: 'لا توجد قيم',
  }
};

interface ValueItem {
  title_en: string; title_fr: string; title_ar: string; title_ama: string;
  description_en: string; description_fr: string; description_ar: string; description_ama: string;
}
interface AboutData {
  id: number;
  story_title_en: string; story_title_fr: string; story_title_ar: string; story_title_ama: string;
  story_description_en: string; story_description_fr: string; story_description_ar: string; story_description_ama: string;
  badge_text_en: string; badge_text_fr: string; badge_text_ar: string; badge_text_ama: string;
  image_url: string; values: ValueItem[];
  section_label_en: string; section_label_fr: string; section_label_ar: string; section_label_ama: string;
}

const defaultData: AboutData = {
  id: 0,
  story_title_en: '', story_title_fr: '', story_title_ar: '', story_title_ama: '',
  story_description_en: '', story_description_fr: '', story_description_ar: '', story_description_ama: '',
  badge_text_en: '', badge_text_fr: '', badge_text_ar: '', badge_text_ama: '',
  image_url: '', values: [],
  section_label_en: 'OUR STORY', section_label_fr: 'NOTRE HISTOIRE',
  section_label_ar: 'قصتنا', section_label_ama: 'ⴰⵔⵓⵢ ⵏⵖ'
};

const langs = ['ar', 'en', 'fr', 'ama'] as const;

const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #d1d5db', borderRadius: 8,
  padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = { fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' };
const secTitle = (mt = 24): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 12, marginTop: mt, display: 'block',
});
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
const divider: React.CSSProperties = { borderBottom: '1px solid #f3f4f6', paddingBottom: 20 };

export const AboutAdmin: React.FC<{ adminLang: AdminLang }> = ({ adminLang }) => {
  const t = tr[adminLang];
  const isRTL = adminLang === 'ar';
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAbout(); }, []);

  const fetchAbout = async () => {
    setLoading(true);
    const { data: row } = await supabase.from('about').select('*').limit(1).single();
    setData(row ?? defaultData);
    setLoading(false);
  };

  const set = (field: keyof AboutData, value: any) =>
    setData(prev => prev ? { ...prev, [field]: value } : null);

  const setVal = (idx: number, field: keyof ValueItem, value: string) => {
    if (!data) return;
    const vals = [...data.values];
    vals[idx] = { ...vals[idx], [field]: value };
    setData({ ...data, values: vals });
  };

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3500); };
  const isErr = (m: string) => m.includes('Err') || m.includes('خط') || m.includes('reur');

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `about_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
    if (error) { showMsg(t.errUpload + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    set('image_url', urlData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { id, ...payload } = data;
    let error;
    if (id && id !== 0) {
      ({ error } = await supabase.from('about').update(payload).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('about').insert([payload]).select().single();
      error = e;
      if (!e && inserted) setData({ ...data, id: inserted.id });
    }
    setSaving(false);
    showMsg(error ? t.errSave + error.message : t.successSave);
  };

  const addValue = () => {
    if (!data) return;
    setData({ ...data, values: [...data.values, { title_en: '', title_fr: '', title_ar: '', title_ama: '', description_en: '', description_fr: '', description_ar: '', description_ama: '' }] });
  };

  const removeValue = (idx: number) => {
    if (!data) return;
    setData({ ...data, values: data.values.filter((_, i) => i !== idx) });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>{t.loading}</div>;
  if (!data) return null;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 24, marginTop: 0 }}>{t.title}</h2>

      {message && (
        <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 14, background: isErr(message) ? '#fef2f2' : '#f0fdf4', color: isErr(message) ? '#dc2626' : '#16a34a' }}>
          {message}
        </div>
      )}

      {/* Section Label */}
      <span style={secTitle(0)}>{t.secLabel}</span>
      <div style={{ ...grid4, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`section_label_${lang}`]}
              onChange={e => set(`section_label_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Story Titles */}
      <span style={secTitle()}>{t.secStory}</span>
      <div style={{ ...grid4, marginBottom: 12 }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`story_title_${lang}`]}
              onChange={e => set(`story_title_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>
      <div style={{ ...grid2, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <textarea style={{ ...inp, resize: 'vertical' } as React.CSSProperties} rows={3}
              value={(data as any)[`story_description_${lang}`]}
              onChange={e => set(`story_description_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Badge */}
      <span style={secTitle()}>{t.secBadge}</span>
      <div style={{ ...grid4, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`badge_text_${lang}`]}
              onChange={e => set(`badge_text_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Image */}
      <span style={secTitle()}>{t.secImage}</span>
      <div style={divider}>
        <label style={lbl}>{t.imageUrl}</label>
        <input style={{ ...inp, marginBottom: 12 }} value={data.image_url}
          onChange={e => set('image_url', e.target.value)} placeholder="https://..." />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{t.orUpload}</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />

        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', border: '2px dashed #93c5fd', borderRadius: 12, background: 'transparent', color: '#2563eb', fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? t.uploading : t.uploadBtn}
        </button>

        {data.image_url && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={data.image_url} alt="preview" style={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <button onClick={() => set('image_url', '')}
              style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Values */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1 }}>{t.secValues}</span>
        <button onClick={addValue}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> {t.addValue}
        </button>
      </div>

      {data.values.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14, padding: '16px 0' }}>{t.noValues}</p>
      )}

      {data.values.map((val, idx) => (
        <div key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{t.valueN} #{idx + 1}</span>
            <button onClick={() => removeValue(idx)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
          </div>
          <div style={{ ...grid4, marginBottom: 8 }}>
            {langs.map(lang => (
              <div key={lang}>
                <label style={lbl}>{t.titleLbl} {lang.toUpperCase()}</label>
                <input style={inp} value={(val as any)[`title_${lang}`]}
                  onChange={e => setVal(idx, `title_${lang}` as keyof ValueItem, e.target.value)} />
              </div>
            ))}
          </div>
          <div style={grid2}>
            {langs.map(lang => (
              <div key={lang}>
                <label style={lbl}>{t.descLbl} {lang.toUpperCase()}</label>
                <textarea style={{ ...inp, resize: 'vertical' } as React.CSSProperties} rows={2}
                  value={(val as any)[`description_${lang}`]}
                  onChange={e => setVal(idx, `description_${lang}` as keyof ValueItem, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: saving ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 24 }}>
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? t.saving : t.save}
      </button>
    </div>
  );
};
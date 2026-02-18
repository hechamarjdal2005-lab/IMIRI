import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const BUCKET = 'uploads';

const tr = {
  fr: {
    title: 'Gestion de "À propos"', saveBtn: 'Enregistrer', saving: 'Enregistrement...',
    sectionLabel: 'Libellé de section', story: 'Histoire', badge: 'Badge',
    mainImage: 'Image principale', imageUrl: "URL de l'image", orUpload: 'ou importer depuis votre ordinateur',
    uploadBtn: 'Choisir une image', uploading: 'Envoi...', values: 'Nos valeurs',
    addValue: 'Ajouter une valeur', valueN: 'Valeur', titleLbl: 'Titre', descLbl: 'Description',
    noValues: 'Aucune valeur ajoutée', loading: 'Chargement...',
    successSave: 'Enregistré avec succès !', errSave: 'Erreur : ', errUpload: 'Erreur upload : ',
  },
  ar: {
    title: 'إدارة قسم "من نحن"', saveBtn: 'حفظ التغييرات', saving: 'جاري الحفظ...',
    sectionLabel: 'عنوان القسم', story: 'القصة', badge: 'الشارة',
    mainImage: 'الصورة الرئيسية', imageUrl: 'رابط الصورة', orUpload: 'أو رفع من الحاسوب',
    uploadBtn: 'اختر صورة', uploading: 'جاري الرفع...', values: 'قيمنا',
    addValue: 'إضافة قيمة', valueN: 'القيمة', titleLbl: 'العنوان', descLbl: 'الوصف',
    noValues: 'لا توجد قيم مضافة', loading: 'جاري التحميل...',
    successSave: 'تم الحفظ بنجاح!', errSave: 'خطأ: ', errUpload: 'خطأ رفع: ',
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

  const set = (field: keyof AboutData, value: any) => setData(prev => prev ? { ...prev, [field]: value } : null);
  const setVal = (idx: number, field: keyof ValueItem, value: string) => {
    if (!data) return;
    const vals = [...data.values];
    vals[idx] = { ...vals[idx], [field]: value };
    setData({ ...data, values: vals });
  };

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3500); };

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

  if (loading) return <div className="text-center py-12 text-gray-400">{t.loading}</div>;
  if (!data) return null;

  const inp = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm";
  const isErr = (m: string) => m.includes('rr') || m.includes('خط') || m.includes('reur');
  const secTitle = "text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 mt-6 block";

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>

      {message && (
        <div className={`p-3 mb-5 rounded-lg text-sm ${isErr(message) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Section Label */}
      <span className={secTitle}>{t.sectionLabel}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`section_label_${lang}`]}
              onChange={e => set(`section_label_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Story */}
      <span className={secTitle}>{t.story}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {langs.map(lang => (
          <div key={lang}>
            <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`story_title_${lang}`]}
              onChange={e => set(`story_title_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
            <textarea className={inp} rows={3} value={(data as any)[`story_description_${lang}`]}
              onChange={e => set(`story_description_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Badge */}
      <span className={secTitle}>{t.badge}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`badge_text_${lang}`]}
              onChange={e => set(`badge_text_${lang}` as keyof AboutData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Image */}
      <span className={secTitle}>{t.mainImage}</span>
      <div className="pb-6 border-b border-gray-100">
        <label className="text-xs text-gray-500 mb-1 block">{t.imageUrl}</label>
        <input className={`${inp} mb-3`} value={data.image_url}
          onChange={e => set('image_url', e.target.value)} placeholder="https://..." />

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">{t.orUpload}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />

        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 rounded-xl px-4 py-3 text-sm transition-colors disabled:opacity-50 w-full justify-center">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? t.uploading : t.uploadBtn}
        </button>

        {data.image_url && (
          <div className="relative w-32 h-32 mt-3">
            <img src={data.image_url} alt="preview" className="w-32 h-32 object-cover rounded-xl border shadow-sm" />
            <button onClick={() => set('image_url', '')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Values */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t.values}</span>
        <button onClick={() => data && setData({
          ...data, values: [...data.values, {
            title_en: '', title_fr: '', title_ar: '', title_ama: '',
            description_en: '', description_fr: '', description_ar: '', description_ama: ''
          }]
        })} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-xs font-medium">
          <Plus size={14} /> {t.addValue}
        </button>
      </div>

      {data.values.length === 0 && <p className="text-gray-400 text-sm text-center py-4">{t.noValues}</p>}

      {data.values.map((val, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">{t.valueN} #{idx + 1}</span>
            <button onClick={() => setData({ ...data, values: data.values.filter((_, i) => i !== idx) })}
              className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {langs.map(lang => (
              <div key={lang}>
                <label className="text-xs text-gray-500 mb-1 block">{t.titleLbl} {lang.toUpperCase()}</label>
                <input className={inp} value={(val as any)[`title_${lang}`]}
                  onChange={e => setVal(idx, `title_${lang}` as keyof ValueItem, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {langs.map(lang => (
              <div key={lang}>
                <label className="text-xs text-gray-500 mb-1 block">{t.descLbl} {lang.toUpperCase()}</label>
                <textarea className={inp} rows={2} value={(val as any)[`description_${lang}`]}
                  onChange={e => setVal(idx, `description_${lang}` as keyof ValueItem, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} disabled={saving}
        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors gap-2 mt-6">
        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {saving ? t.saving : t.saveBtn}
      </button>
    </div>
  );
};
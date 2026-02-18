import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Upload, X, Eye, EyeOff } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const BUCKET = 'uploads';

const tr = {
  fr: {
    title: 'Gestion du Hero', save: 'Enregistrer', saving: 'Enregistrement...',
    loading: 'Chargement...', successSave: 'Enregistré avec succès !',
    errSave: 'Erreur : ', errUpload: 'Erreur upload : ',
    // Sections
    secBackground: 'Arrière-plan & Overlay',
    secTitles: 'Titres (Titles)',
    secSubtitles: 'Sous-titres (Subtitles)',
    secCTA: 'Bouton d\'action (CTA)',
    secLogo: 'Logo & Nom du site',
    secStatus: 'Statut',
    // Fields
    imageUrl: 'URL de l\'image de fond',
    orUpload: 'ou importer depuis votre ordinateur',
    uploadBg: 'Choisir une image de fond',
    uploadLogo: 'Choisir un logo',
    uploading: 'Envoi...',
    overlayColor: 'Couleur overlay (rgba)',
    overlayEnabled: 'Activer l\'overlay',
    ctaLink: 'Lien du bouton (CTA Link)',
    logoUrl: 'URL du logo',
    logoHeight: 'Hauteur du logo (ex: 40px)',
    isActive: 'Activer ce Hero',
    active: 'Actif', inactive: 'Inactif',
  },
  ar: {
    title: 'إدارة قسم Hero', save: 'حفظ التغييرات', saving: 'جاري الحفظ...',
    loading: 'جاري التحميل...', successSave: 'تم الحفظ بنجاح!',
    errSave: 'خطأ: ', errUpload: 'خطأ رفع: ',
    secBackground: 'الخلفية والـ Overlay',
    secTitles: 'العناوين (Titles)',
    secSubtitles: 'العناوين الفرعية (Subtitles)',
    secCTA: 'زر الإجراء (CTA)',
    secLogo: 'الشعار واسم الموقع',
    secStatus: 'الحالة',
    imageUrl: 'رابط صورة الخلفية',
    orUpload: 'أو رفع من الحاسوب',
    uploadBg: 'اختر صورة الخلفية',
    uploadLogo: 'اختر الشعار (Logo)',
    uploading: 'جاري الرفع...',
    overlayColor: 'لون الـ Overlay (rgba)',
    overlayEnabled: 'تفعيل الـ Overlay',
    ctaLink: 'رابط الزر (CTA Link)',
    logoUrl: 'رابط الشعار (Logo)',
    logoHeight: 'ارتفاع الشعار (مثال: 40px)',
    isActive: 'تفعيل هذا الـ Hero',
    active: 'مفعل', inactive: 'غير مفعل',
  }
};

interface HeroData {
  id: number;
  image_url: string;
  overlay_color: string;
  overlay_enabled: boolean;
  title_en: string; title_fr: string; title_ar: string; title_ama: string;
  subtitle_en: string; subtitle_fr: string; subtitle_ar: string; subtitle_ama: string;
  cta_text_en: string; cta_text_fr: string; cta_text_ar: string; cta_text_ama: string;
  cta_link: string;
  is_active: boolean;
  logo_url: string;
  logo_height: string;
  site_name_en: string; site_name_fr: string; site_name_ar: string; site_name_ama: string;
}

const defaultData: HeroData = {
  id: 0,
  image_url: '', overlay_color: 'rgba(0, 0, 0, 0.4)', overlay_enabled: true,
  title_en: '', title_fr: '', title_ar: '', title_ama: '',
  subtitle_en: '', subtitle_fr: '', subtitle_ar: '', subtitle_ama: '',
  cta_text_en: 'Explore Products', cta_text_fr: 'Explorer les Produits',
  cta_text_ar: 'استكشف المنتجات', cta_text_ama: 'ⵙⴼ ⵙⵔⵏ',
  cta_link: '#products', is_active: true,
  logo_url: '', logo_height: '40px',
  site_name_en: 'IMIRI', site_name_fr: 'IMIRI', site_name_ar: 'إميري', site_name_ama: 'IMIRI',
};

const langs = ['ar', 'en', 'fr', 'ama'] as const;

export const HeroAdmin: React.FC<{ adminLang: AdminLang }> = ({ adminLang }) => {
  const t = tr[adminLang];
  const isRTL = adminLang === 'ar';

  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState('');
  const [previewOverlay, setPreviewOverlay] = useState(false);

  const bgRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchHero(); }, []);

  const fetchHero = async () => {
    setLoading(true);
    const { data: row } = await supabase.from('hero_background').select('*').limit(1).single();
    setData(row ?? defaultData);
    setLoading(false);
  };

  const set = (field: keyof HeroData, value: any) =>
    setData(prev => prev ? { ...prev, [field]: value } : null);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3500); };

  const handleUpload = async (
    file: File,
    prefix: string,
    setUploading: (v: boolean) => void,
    field: 'image_url' | 'logo_url'
  ) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
    if (error) { showMsg(t.errUpload + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    set(field, urlData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { id, ...payload } = data;
    let error;
    if (id && id !== 0) {
      ({ error } = await supabase.from('hero_background').update(payload).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase
        .from('hero_background').insert([payload]).select().single();
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
  const secTitle = "text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 mt-7 block";
  const isErr = (m: string) => m.includes('rr') || m.includes('خط') || m.includes('reur');

  const UploadBtn = ({
    onClick, uploading: upl, label
  }: { onClick: () => void; uploading: boolean; label: string }) => (
    <button type="button" onClick={onClick} disabled={upl}
      className="flex items-center gap-2 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50 w-full justify-center">
      {upl ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
      {upl ? t.uploading : label}
    </button>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>

      {message && (
        <div className={`p-3 mb-5 rounded-lg text-sm ${isErr(message) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* ── Background & Overlay ── */}
      <span className={secTitle}>{t.secBackground}</span>
      <div className="pb-6 border-b border-gray-100">
        {/* Image URL */}
        <label className={lbl}>{t.imageUrl}</label>
        <input className={`${inp} mb-2`} value={data.image_url}
          onChange={e => set('image_url', e.target.value)} placeholder="https://..." />

        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">{t.orUpload}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <input ref={bgRef} type="file" accept="image/*" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'hero', setUploadingBg, 'image_url'); }} />
        <UploadBtn onClick={() => bgRef.current?.click()} uploading={uploadingBg} label={t.uploadBg} />

        {/* Preview */}
        {data.image_url && (
          <div className="relative mt-3 rounded-xl overflow-hidden border" style={{ height: '160px' }}>
            <img src={data.image_url} alt="bg preview" className="w-full h-full object-cover" />
            {data.overlay_enabled && (
              <div className="absolute inset-0" style={{ background: data.overlay_color }} />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm font-semibold drop-shadow">
                {data.title_fr || data.title_ar || 'Titre'}
              </p>
            </div>
            <button onClick={() => set('image_url', '')}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Overlay settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className={lbl}>{t.overlayColor}</label>
            <input className={inp} value={data.overlay_color}
              onChange={e => set('overlay_color', e.target.value)}
              placeholder="rgba(0, 0, 0, 0.4)" />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={data.overlay_enabled}
                onChange={e => set('overlay_enabled', e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
            <span className="text-sm text-gray-600">{t.overlayEnabled}</span>
          </div>
        </div>
      </div>

      {/* ── Titles ── */}
      <span className={secTitle}>{t.secTitles}</span>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className={lbl}>{lang.toUpperCase()}</label>
            <input className={inp} value={(data as any)[`title_${lang}`]}
              onChange={e => set(`title_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* ── Subtitles ── */}
      <span className={secTitle}>{t.secSubtitles}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 border-b border-gray-100">
        {langs.map(lang => (
          <div key={lang}>
            <label className={lbl}>{lang.toUpperCase()}</label>
            <textarea className={inp} rows={2} value={(data as any)[`subtitle_${lang}`] || ''}
              onChange={e => set(`subtitle_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <span className={secTitle}>{t.secCTA}</span>
      <div className="pb-6 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {langs.map(lang => (
            <div key={lang}>
              <label className={lbl}>CTA {lang.toUpperCase()}</label>
              <input className={inp} value={(data as any)[`cta_text_${lang}`] || ''}
                onChange={e => set(`cta_text_${lang}` as keyof HeroData, e.target.value)} />
            </div>
          ))}
        </div>
        <div>
          <label className={lbl}>{t.ctaLink}</label>
          <input className={inp} value={data.cta_link || ''}
            onChange={e => set('cta_link', e.target.value)} placeholder="#products" />
        </div>
      </div>

      {/* ── Logo & Site Name ── */}
      <span className={secTitle}>{t.secLogo}</span>
      <div className="pb-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className={lbl}>{t.logoUrl}</label>
            <input className={`${inp} mb-2`} value={data.logo_url || ''}
              onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'logo', setUploadingLogo, 'logo_url'); }} />
            <UploadBtn onClick={() => logoRef.current?.click()} uploading={uploadingLogo} label={t.uploadLogo} />
            {data.logo_url && (
              <div className="relative mt-2 inline-block">
                <img src={data.logo_url} alt="logo" style={{ height: data.logo_height || '40px' }}
                  className="object-contain rounded border p-1 bg-gray-50" />
                <button onClick={() => set('logo_url', '')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className={lbl}>{t.logoHeight}</label>
            <input className={inp} value={data.logo_height || '40px'}
              onChange={e => set('logo_height', e.target.value)} placeholder="40px" />
          </div>
        </div>

        {/* Site Names */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {langs.map(lang => (
            <div key={lang}>
              <label className={lbl}>Nom {lang.toUpperCase()}</label>
              <input className={inp} value={(data as any)[`site_name_${lang}`] || ''}
                onChange={e => set(`site_name_${lang}` as keyof HeroData, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Status ── */}
      <span className={secTitle}>{t.secStatus}</span>
      <div className="flex items-center gap-3 mb-8">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={data.is_active}
            onChange={e => set('is_active', e.target.checked)} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
        </label>
        <span className={`text-sm font-medium ${data.is_active ? 'text-green-600' : 'text-gray-400'}`}>
          {data.is_active ? t.active : t.inactive}
        </span>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors gap-2 font-medium">
        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {saving ? t.saving : t.save}
      </button>
    </div>
  );
};
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Upload, X } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const BUCKET = 'uploads';

const tr = {
  fr: {
    title: 'Gestion du Hero', save: 'Enregistrer', saving: 'Enregistrement...',
    loading: 'Chargement...', successSave: 'Enregistré !', errSave: 'Erreur : ', errUpload: 'Erreur upload : ',
    secBg: 'Arrière-plan & Overlay', secTitles: 'Titres', secSub: 'Sous-titres',
    secCTA: "Bouton d'action (CTA)", secLogo: 'Logo & Nom du site', secStatus: 'Statut',
    imageUrl: "URL de l'image de fond", orUpload: 'ou importer depuis votre ordinateur',
    uploadBg: 'Choisir une image de fond', uploadLogo: 'Choisir un logo',
    uploading: 'Envoi...', overlayColor: 'Couleur overlay (rgba)',
    overlayOn: "Activer l'overlay", ctaLink: 'Lien du bouton',
    logoUrl: 'URL du logo', logoHeight: 'Hauteur logo (ex: 40px)',
    siteName: 'Nom du site', isActive: 'Activer ce Hero',
    active: 'Actif ✓', inactive: 'Inactif',
  },
  ar: {
    title: 'إدارة قسم Hero', save: 'حفظ', saving: 'جاري الحفظ...',
    loading: 'جاري التحميل...', successSave: 'تم الحفظ!', errSave: 'خطأ: ', errUpload: 'خطأ رفع: ',
    secBg: 'الخلفية والـ Overlay', secTitles: 'العناوين', secSub: 'العناوين الفرعية',
    secCTA: 'زر الإجراء (CTA)', secLogo: 'الشعار واسم الموقع', secStatus: 'الحالة',
    imageUrl: 'رابط صورة الخلفية', orUpload: 'أو رفع من الحاسوب',
    uploadBg: 'اختر صورة الخلفية', uploadLogo: 'اختر الشعار',
    uploading: 'جاري الرفع...', overlayColor: 'لون الـ Overlay (rgba)',
    overlayOn: 'تفعيل الـ Overlay', ctaLink: 'رابط الزر',
    logoUrl: 'رابط الشعار', logoHeight: 'ارتفاع الشعار (مثال: 40px)',
    siteName: 'اسم الموقع', isActive: 'تفعيل هذا الـ Hero',
    active: 'مفعل ✓', inactive: 'غير مفعل',
  }
};

interface HeroData {
  id: number;
  image_url: string; overlay_color: string; overlay_enabled: boolean;
  title_en: string; title_fr: string; title_ar: string; title_ama: string;
  subtitle_en: string; subtitle_fr: string; subtitle_ar: string; subtitle_ama: string;
  cta_text_en: string; cta_text_fr: string; cta_text_ar: string; cta_text_ama: string;
  cta_link: string; is_active: boolean;
  logo_url: string; logo_height: string;
  site_name_en: string; site_name_fr: string; site_name_ar: string; site_name_ama: string;
}

const defaultData: HeroData = {
  id: 0, image_url: '', overlay_color: 'rgba(0, 0, 0, 0.4)', overlay_enabled: true,
  title_en: '', title_fr: '', title_ar: '', title_ama: '',
  subtitle_en: '', subtitle_fr: '', subtitle_ar: '', subtitle_ama: '',
  cta_text_en: 'Explore Products', cta_text_fr: 'Explorer les Produits',
  cta_text_ar: 'استكشف المنتجات', cta_text_ama: 'ⵙⴼ ⵙⵔⵏ',
  cta_link: '#products', is_active: true,
  logo_url: '', logo_height: '40px',
  site_name_en: 'IMIRI', site_name_fr: 'IMIRI', site_name_ar: 'إميري', site_name_ama: 'IMIRI',
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

export const HeroAdmin: React.FC<{ adminLang: AdminLang }> = ({ adminLang }) => {
  const t = tr[adminLang];
  const isRTL = adminLang === 'ar';

  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState('');

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
  const isErr = (m: string) => m.includes('Err') || m.includes('خط') || m.includes('reur');

  const handleUpload = async (file: File, prefix: string, setUpl: (v: boolean) => void, field: 'image_url' | 'logo_url') => {
    setUpl(true);
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
    if (error) { showMsg(t.errUpload + error.message); setUpl(false); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    set(field, urlData.publicUrl);
    setUpl(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { id, ...payload } = data;
    let error;
    if (id && id !== 0) {
      ({ error } = await supabase.from('hero_background').update(payload).eq('id', id));
    } else {
      const { data: inserted, error: e } = await supabase.from('hero_background').insert([payload]).select().single();
      error = e;
      if (!e && inserted) setData({ ...data, id: inserted.id });
    }
    setSaving(false);
    showMsg(error ? t.errSave + error.message : t.successSave);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>{t.loading}</div>;
  if (!data) return null;

  const UploadBtn = ({ onClick, upl, label }: { onClick: () => void; upl: boolean; label: string }) => (
    <button type="button" onClick={onClick} disabled={upl}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 12, border: '2px dashed #93c5fd', borderRadius: 12, background: 'transparent', color: '#2563eb', fontSize: 14, cursor: 'pointer' }}>
      {upl ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
      {upl ? t.uploading : label}
    </button>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 24, marginTop: 0 }}>{t.title}</h2>

      {message && (
        <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 14, background: isErr(message) ? '#fef2f2' : '#f0fdf4', color: isErr(message) ? '#dc2626' : '#16a34a' }}>
          {message}
        </div>
      )}

      {/* Background */}
      <span style={secTitle(0)}>{t.secBg}</span>
      <div style={divider}>
        <label style={lbl}>{t.imageUrl}</label>
        <input style={{ ...inp, marginBottom: 12 }} value={data.image_url}
          onChange={e => set('image_url', e.target.value)} placeholder="https://..." />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{t.orUpload}</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        <input ref={bgRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'hero', setUploadingBg, 'image_url'); }} />
        <div style={{ marginBottom: 12 }}>
          <UploadBtn onClick={() => bgRef.current?.click()} upl={uploadingBg} label={t.uploadBg} />
        </div>

        {/* Preview */}
        {data.image_url && (
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 160, marginBottom: 16 }}>
            <img src={data.image_url} alt="bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {data.overlay_enabled && (
              <div style={{ position: 'absolute', inset: 0, background: data.overlay_color }} />
            )}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {data.title_fr || data.title_ar || 'Titre'}
              </p>
            </div>
            <button onClick={() => set('image_url', '')}
              style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', border: 'none', borderRadius: '50%', width: 24, height: 24, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Overlay */}
        <div style={grid2}>
          <div>
            <label style={lbl}>{t.overlayColor}</label>
            <input style={inp} value={data.overlay_color}
              onChange={e => set('overlay_color', e.target.value)} placeholder="rgba(0,0,0,0.4)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={data.overlay_enabled}
                onChange={e => set('overlay_enabled', e.target.checked)}
                style={{ width: 40, height: 20, cursor: 'pointer', accentColor: '#2563eb' }} />
            </label>
            <span style={{ fontSize: 13, color: '#4b5563' }}>{t.overlayOn}</span>
          </div>
        </div>
      </div>

      {/* Titles */}
      <span style={secTitle()}>{t.secTitles}</span>
      <div style={{ ...grid4, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`title_${lang}`]}
              onChange={e => set(`title_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Subtitles */}
      <span style={secTitle()}>{t.secSub}</span>
      <div style={{ ...grid2, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{lang.toUpperCase()}</label>
            <textarea style={{ ...inp, resize: 'vertical' } as React.CSSProperties} rows={2}
              value={(data as any)[`subtitle_${lang}`] || ''}
              onChange={e => set(`subtitle_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <span style={secTitle()}>{t.secCTA}</span>
      <div style={{ ...grid4, marginBottom: 12 }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>CTA {lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`cta_text_${lang}`] || ''}
              onChange={e => set(`cta_text_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>
      <div style={divider}>
        <label style={lbl}>{t.ctaLink}</label>
        <input style={inp} value={data.cta_link || ''} placeholder="#products"
          onChange={e => set('cta_link', e.target.value)} />
      </div>

      {/* Logo */}
      <span style={secTitle()}>{t.secLogo}</span>
      <div style={{ ...grid2, marginBottom: 12 }}>
        <div>
          <label style={lbl}>{t.logoUrl}</label>
          <input style={{ ...inp, marginBottom: 8 }} value={data.logo_url || ''}
            onChange={e => set('logo_url', e.target.value)} placeholder="https://..." />
          <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'logo', setUploadingLogo, 'logo_url'); }} />
          <UploadBtn onClick={() => logoRef.current?.click()} upl={uploadingLogo} label={t.uploadLogo} />
          {data.logo_url && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: 8 }}>
              <img src={data.logo_url} alt="logo" style={{ height: data.logo_height || '40px', objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb', padding: 4, background: '#f9fafb' }} />
              <button onClick={() => set('logo_url', '')}
                style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', border: 'none', borderRadius: '50%', width: 20, height: 20, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={12} />
              </button>
            </div>
          )}
        </div>
        <div>
          <label style={lbl}>{t.logoHeight}</label>
          <input style={inp} value={data.logo_height || '40px'}
            onChange={e => set('logo_height', e.target.value)} placeholder="40px" />
        </div>
      </div>

      {/* Site names */}
      <div style={{ ...grid4, ...divider }}>
        {langs.map(lang => (
          <div key={lang}>
            <label style={lbl}>{t.siteName} {lang.toUpperCase()}</label>
            <input style={inp} value={(data as any)[`site_name_${lang}`] || ''}
              onChange={e => set(`site_name_${lang}` as keyof HeroData, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Status */}
      <span style={secTitle()}>{t.secStatus}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <input type="checkbox" checked={data.is_active}
          onChange={e => set('is_active', e.target.checked)}
          style={{ width: 40, height: 20, cursor: 'pointer', accentColor: '#16a34a' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: data.is_active ? '#16a34a' : '#9ca3af' }}>
          {data.is_active ? t.active : t.inactive}
        </span>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: saving ? '#9ca3af' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? t.saving : t.save}
      </button>
    </div>
  );
};
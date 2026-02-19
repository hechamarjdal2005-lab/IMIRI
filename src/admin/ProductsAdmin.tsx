import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit, Trash2, Save, Loader2, X, Upload, ImageIcon } from 'lucide-react';
import type { AdminLang } from './AdminLayout';

const BUCKET = 'uploads';

const tr = {
  fr: {
    title: 'Gestion des produits', newProduct: 'Nouveau produit',
    editProduct: 'Modifier', addProduct: 'Ajouter un produit',
    names: 'Nom', descriptions: 'Description', priceImage: 'Prix & Image',
    price: 'Prix *', currency: 'Devise', imageUrl: "URL de l'image",
    orUpload: 'ou importer depuis votre ordinateur', uploadBtn: 'Choisir une image',
    uploading: 'Envoi...', save: 'Enregistrer', saving: 'Enregistrement...',
    cancel: 'Annuler', confirmDelete: 'Confirmer la suppression ?',
    noProducts: 'Aucun produit', errRequired: 'Erreur : Nom (AR) et prix obligatoires',
    errSave: 'Erreur : ', errUpload: 'Erreur upload : ',
    successSave: 'Enregistré !', successDelete: 'Supprimé !',
    colImage: 'Image', colName: 'Nom', colPrice: 'Prix', colActions: 'Actions',
    loading: 'Chargement...',
  },
  ar: {
    title: 'إدارة المنتجات', newProduct: 'منتج جديد',
    editProduct: 'تعديل', addProduct: 'إضافة منتج',
    names: 'الاسم', descriptions: 'الوصف', priceImage: 'السعر والصورة',
    price: 'السعر *', currency: 'العملة', imageUrl: 'رابط الصورة',
    orUpload: 'أو رفع من الحاسوب', uploadBtn: 'اختر صورة',
    uploading: 'جاري الرفع...', save: 'حفظ', saving: 'جاري الحفظ...',
    cancel: 'إلغاء', confirmDelete: 'تأكيد الحذف؟',
    noProducts: 'لا توجد منتجات', errRequired: 'خطأ: الاسم (AR) والسعر مطلوبان',
    errSave: 'خطأ: ', errUpload: 'خطأ رفع: ',
    successSave: 'تم الحفظ!', successDelete: 'تم الحذف!',
    colImage: 'الصورة', colName: 'الاسم', colPrice: 'السعر', colActions: 'إجراءات',
    loading: 'جاري التحميل...',
  }
};

interface Product {
  id: string;
  name_en: string; name_fr: string; name_ar: string; name_ama: string;
  description_en: string; description_fr: string; description_ar: string; description_ama: string;
  price: number; image_url: string; price_label?: string;
}

const empty: Partial<Product> = {
  name_en: '', name_fr: '', name_ar: '', name_ama: '',
  description_en: '', description_fr: '', description_ar: '', description_ama: '',
  price: 0, image_url: '', price_label: 'DH',
};

const langs = ['ar', 'en', 'fr', 'ama'] as const;

// ── Shared style helpers ──────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #d1d5db', borderRadius: 8,
  padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const lbl: React.CSSProperties = { fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' };
const secTitle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 12, marginTop: 20, display: 'block',
};
const card: React.CSSProperties = {
  border: '1px solid #e5e7eb', borderRadius: 16, background: '#f9fafb', padding: 24, marginBottom: 24,
};
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 };

export const ProductsAdmin: React.FC<{ adminLang: AdminLang }> = ({ adminLang }) => {
  const t = tr[adminLang];
  const isRTL = adminLang === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Product>>({});
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3500); };
  const isErr = (m: string) => m.includes('Err') || m.includes('خط') || m.includes('reur');

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `product_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true });
    if (error) { showMsg(t.errUpload + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    setCurrent(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!current.name_ar || !current.price) { showMsg(t.errRequired); return; }
    setSaving(true);
    const payload = {
      name_en: current.name_en || '', name_fr: current.name_fr || '',
      name_ar: current.name_ar || '', name_ama: current.name_ama || '',
      description_en: current.description_en || '', description_fr: current.description_fr || '',
      description_ar: current.description_ar || '', description_ama: current.description_ama || '',
      price: Number(current.price), price_label: current.price_label || 'DH',
      image_url: current.image_url || '',
    };
    let error;
    if (current.id) ({ error } = await supabase.from('products').update(payload).eq('id', current.id));
    else ({ error } = await supabase.from('products').insert([payload]));
    setSaving(false);
    if (error) showMsg(t.errSave + error.message);
    else { showMsg(t.successSave); setIsEditing(false); setCurrent({}); fetchProducts(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) showMsg(t.errSave + error.message);
    else { showMsg(t.successDelete); fetchProducts(); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>{t.loading}</div>;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0 }}>{t.title}</h2>
        {!isEditing && (
          <button onClick={() => { setCurrent({ ...empty }); setIsEditing(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={17} /> {t.newProduct}
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 14, background: isErr(message) ? '#fef2f2' : '#f0fdf4', color: isErr(message) ? '#dc2626' : '#16a34a' }}>
          {message}
        </div>
      )}

      {/* ── Form ── */}
      {isEditing && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: 0 }}>{current.id ? t.editProduct : t.addProduct}</h3>
            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
          </div>

          {/* Names */}
          <span style={secTitle}>{t.names}</span>
          <div style={grid4}>
            {langs.map(lang => (
              <div key={lang}>
                <label style={lbl}>{lang.toUpperCase()}{lang === 'ar' ? ' *' : ''}</label>
                <input style={inp} value={(current as any)[`name_${lang}`] || ''}
                  onChange={e => setCurrent({ ...current, [`name_${lang}`]: e.target.value })} />
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <span style={secTitle}>{t.descriptions}</span>
          <div style={grid2}>
            {langs.map(lang => (
              <div key={lang}>
                <label style={lbl}>{lang.toUpperCase()}</label>
                <textarea style={{ ...inp, resize: 'vertical' } as React.CSSProperties} rows={2}
                  value={(current as any)[`description_${lang}`] || ''}
                  onChange={e => setCurrent({ ...current, [`description_${lang}`]: e.target.value })} />
              </div>
            ))}
          </div>

          {/* Price */}
          <span style={secTitle}>{t.priceImage}</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={lbl}>{t.price}</label>
              <input type="number" style={inp} value={current.price || ''}
                onChange={e => setCurrent({ ...current, price: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label style={lbl}>{t.currency}</label>
              <input style={inp} value={current.price_label || 'DH'}
                onChange={e => setCurrent({ ...current, price_label: e.target.value })} />
            </div>
          </div>

          {/* Image URL */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>{t.imageUrl}</label>
            <input style={inp} value={current.image_url || ''}
              onChange={e => setCurrent({ ...current, image_url: e.target.value })} placeholder="https://..." />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{t.orUpload}</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />

          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', border: '2px dashed #93c5fd', borderRadius: 12, background: 'transparent', color: '#2563eb', fontSize: 14, cursor: 'pointer', marginBottom: 16 }}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? t.uploading : t.uploadBtn}
          </button>

          {/* Preview */}
          {current.image_url && (
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <img src={current.image_url} alt="preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <button onClick={() => setCurrent({ ...current, image_url: '' })}
                style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} />
              </button>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: saving ? '#9ca3af' : '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? t.saving : t.save}
            </button>
            <button onClick={() => setIsEditing(false)}
              style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {products.length === 0 && !isEditing ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <ImageIcon size={40} style={{ opacity: 0.3 }} />
          <p style={{ margin: 0 }}>{t.noProducts}</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {[t.colImage, t.colName, t.colPrice, t.colActions].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontWeight: 600, color: '#6b7280', textAlign: isRTL ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name_ar} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                      : <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} style={{ color: '#d1d5db' }} /></div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1f2937' }}>{p.name_fr || p.name_ar}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>{p.name_ar}</p>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#374151' }}>{p.price} {p.price_label}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => { setCurrent(p); setIsEditing(true); }}
                        style={{ padding: 8, background: '#eff6ff', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#2563eb' }}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(p.id)}
                        style={{ padding: 8, background: '#fef2f2', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#dc2626' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
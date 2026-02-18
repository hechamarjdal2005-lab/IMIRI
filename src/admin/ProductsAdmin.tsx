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
    price: 'Prix *', currency: 'Devise', imageUrl: 'URL de l\'image',
    orUpload: 'ou importer depuis votre ordinateur', uploadBtn: 'Choisir une image',
    uploading: 'Envoi en cours...', save: 'Enregistrer', saving: 'Enregistrement...',
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

  const inp = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm";
  const langs = ['ar', 'en', 'fr', 'ama'] as const;
  const isErr = (m: string) => m.includes('rr') || m.includes('خط') || m.includes('reur');

  if (loading) return <div className="text-center py-12 text-gray-400">{t.loading}</div>;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
        {!isEditing && (
          <button onClick={() => { setCurrent({ ...empty }); setIsEditing(true); }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 gap-2 text-sm font-medium">
            <Plus size={17} /> {t.newProduct}
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${isErr(message) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {isEditing && (
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-700">{current.id ? t.editProduct : t.addProduct}</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>

          {/* Names */}
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{t.names}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {langs.map(lang => (
              <div key={lang}>
                <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}{lang === 'ar' ? ' *' : ''}</label>
                <input className={inp} value={(current as any)[`name_${lang}`] || ''}
                  onChange={e => setCurrent({ ...current, [`name_${lang}`]: e.target.value })} />
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{t.descriptions}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {langs.map(lang => (
              <div key={lang}>
                <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
                <textarea className={inp} rows={2} value={(current as any)[`description_${lang}`] || ''}
                  onChange={e => setCurrent({ ...current, [`description_${lang}`]: e.target.value })} />
              </div>
            ))}
          </div>

          {/* Price */}
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{t.priceImage}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t.price}</label>
              <input type="number" className={inp} value={current.price || ''}
                onChange={e => setCurrent({ ...current, price: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t.currency}</label>
              <input className={inp} value={current.price_label || 'DH'}
                onChange={e => setCurrent({ ...current, price_label: e.target.value })} />
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">{t.imageUrl}</label>
            <input className={inp} value={current.image_url || ''}
              onChange={e => setCurrent({ ...current, image_url: e.target.value })}
              placeholder="https://..." />
          </div>

          {/* Upload divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{t.orUpload}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />

          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 rounded-xl px-4 py-3 text-sm transition-colors disabled:opacity-50 w-full justify-center mb-4">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? t.uploading : t.uploadBtn}
          </button>

          {/* Preview */}
          {current.image_url && (
            <div className="relative w-24 h-24 mb-4">
              <img src={current.image_url} alt="preview" className="w-24 h-24 object-cover rounded-xl border shadow-sm" />
              <button onClick={() => setCurrent({ ...current, image_url: '' })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 disabled:bg-gray-400 gap-2 text-sm font-medium">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? t.saving : t.save}
            </button>
            <button onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300 text-sm">
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !isEditing ? (
        <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-3">
          <ImageIcon size={40} className="opacity-30" />
          <p>{t.noProducts}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className={isRTL ? 'text-right' : 'text-left'}>
                {[t.colImage, t.colName, t.colPrice, t.colActions].map(h => (
                  <th key={h} className="p-3 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name_ar} className="w-12 h-12 object-cover rounded-lg" />
                      : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon size={18} className="text-gray-300" /></div>}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-gray-800">{p.name_fr || p.name_ar}</p>
                    <p className="text-gray-400 text-xs">{p.name_ar}</p>
                  </td>
                  <td className="p-3 font-medium text-gray-700">{p.price} {p.price_label}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setCurrent(p); setIsEditing(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
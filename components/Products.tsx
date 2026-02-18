import React, { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { Language, Product } from '../types';
import { transformProduct } from '../utils/transformProduct';
import { Plus } from 'lucide-react';

interface ProductsProps {
  t: {
    title: string;
    addToBasket: string;
    price: string;
  };
  lang: Language;
  onAdd: (product: Product) => void;
}

interface ProductRow {
  id: string;
  name_en: string;
  name_fr: string;
  name_ar: string;
  name_ama: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  description_ama: string;
  price: number;
  price_label: string;
  image_url: string;
}

const Products: React.FC<ProductsProps> = ({ t, lang, onAdd }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformed = data.map(transformProduct);
        setProducts(transformed);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-24 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-24 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name[lang]} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-700 font-bold text-sm shadow-sm">
                  {product.price} {product.priceLabel}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name[lang]}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                  {product.description[lang]}
                </p>
                <button 
                  onClick={() => onAdd(product)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Plus size={20} />
                  <span>{t.addToBasket}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
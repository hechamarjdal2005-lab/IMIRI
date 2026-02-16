
import React from 'react';
import { PRODUCTS } from '../constants';
import { Language, Product } from '../types';
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

const Products: React.FC<ProductsProps> = ({ t, lang, onAdd }) => {
  return (
    <section id="products" className="py-24 bg-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name[lang]} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-700 font-bold text-sm shadow-sm">
                  {product.priceLabel}
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

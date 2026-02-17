import { Product, Language } from '../types';

// This matches your Supabase table structure
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

export function transformProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: {
      en: row.name_en,
      fr: row.name_fr,
      ar: row.name_ar,
      ama: row.name_ama,
    },
    description: {
      en: row.description_en,
      fr: row.description_fr,
      ar: row.description_ar,
      ama: row.description_ama,
    },
    price: row.price,
    priceLabel: row.price_label,
    image: row.image_url,
  };
}
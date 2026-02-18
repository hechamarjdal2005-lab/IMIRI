
export type Language = 'en' | 'fr' | 'ar' | 'ama';

export interface Product {
  id: string;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  price: number;
  priceLabel: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Translation {
  nav: {
    home: string;
    about: string;
    products: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
    values: {
      natural: string;
      authentic: string;
      empowerment: string;
      local: string;
    };
  };
  products: {
    title: string;
    addToBasket: string;
    price: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    sendOrder: string;
    items: string;
  };
  contact: {
    title: string;
    whatsapp: string;
    email: string;
    location: string;
  };
}

export interface AboutValue {
  icon: string;
  text_en: string;
  text_fr: string;
  text_ar: string;
  text_ama: string;
}

export interface About {
  id: number;
  story_title_en: string;
  story_title_fr: string;
  story_title_ar: string;
  story_title_ama: string;
  section_label_en: string;
  section_label_fr: string;
  section_label_ar: string;
  section_label_ama: string;
  story_description_en: string;
  story_description_fr: string;
  story_description_ar: string;
  story_description_ama: string;
  badge_text_en: string;
  badge_text_fr: string;
  badge_text_ar: string;
  badge_text_ama: string;
  image_url: string;
  values: AboutValue[];
}

export interface Contact {
  id: number;
  title_en: string;
  title_fr: string;
  title_ar: string;
  title_ama: string;
  phone: string;
  email: string;
  location_en: string;
  location_fr: string;
  location_ar: string;
  location_ama: string;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  whatsapp_number: string | null;
  map_embed_url: string | null;
}

export interface HeroBackground {
  id: number;
  image_url: string;
  overlay_color: string;
  overlay_enabled: boolean;
  logo_url: string | null;
  logo_height: string;
  site_name_en: string;
  site_name_fr: string;
  site_name_ar: string;
  site_name_ama: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  title_ama: string;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  subtitle_ar: string | null;
  subtitle_ama: string | null;
  cta_text_en: string;
  cta_text_fr: string;
  cta_text_ar: string;
  cta_text_ama: string;
  cta_link: string;
  is_active: boolean;
}
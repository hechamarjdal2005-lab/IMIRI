import { Contact } from '../types';

interface ContactRow {
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

export function transformContact(row: ContactRow): Contact {
  return {
    id: row.id,
    title_en: row.title_en,
    title_fr: row.title_fr,
    title_ar: row.title_ar,
    title_ama: row.title_ama,
    phone: row.phone,
    email: row.email,
    location_en: row.location_en,
    location_fr: row.location_fr,
    location_ar: row.location_ar,
    location_ama: row.location_ama,
    facebook_url: row.facebook_url,
    instagram_url: row.instagram_url,
    twitter_url: row.twitter_url,
    whatsapp_number: row.whatsapp_number,
    map_embed_url: row.map_embed_url,
  };
}

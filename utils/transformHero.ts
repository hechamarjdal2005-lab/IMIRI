import { HeroBackground } from '../types';

interface HeroBackgroundRow {
  id: number;
  image_url: string;
  overlay_color: string;
  overlay_enabled: boolean;
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
  logo_url: string | null;
  logo_height: string;
  site_name_en: string;
  site_name_fr: string;
  site_name_ar: string;
  site_name_ama: string;
}

export function transformHero(row: HeroBackgroundRow): HeroBackground {
  return {
    id: row.id,
    image_url: row.image_url,
    overlay_color: row.overlay_color,
    overlay_enabled: row.overlay_enabled,
    logo_url: row.logo_url,
    logo_height: row.logo_height,
    site_name_en: row.site_name_en,
    site_name_fr: row.site_name_fr,
    site_name_ar: row.site_name_ar,
    site_name_ama: row.site_name_ama,
    title_en: row.title_en,
    title_fr: row.title_fr,
    title_ar: row.title_ar,
    title_ama: row.title_ama,
    subtitle_en: row.subtitle_en,
    subtitle_fr: row.subtitle_fr,
    subtitle_ar: row.subtitle_ar,
    subtitle_ama: row.subtitle_ama,
    cta_text_en: row.cta_text_en,
    cta_text_fr: row.cta_text_fr,
    cta_text_ar: row.cta_text_ar,
    cta_text_ama: row.cta_text_ama,
    cta_link: row.cta_link,
    is_active: row.is_active,
  };
}
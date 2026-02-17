import { About } from '../types';

interface AboutRow {
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
  values: any;
}

export function transformAbout(row: AboutRow): About {
  return {
    id: row.id,
    story_title_en: row.story_title_en,
    story_title_fr: row.story_title_fr,
    story_title_ar: row.story_title_ar,
    story_title_ama: row.story_title_ama,
    section_label_en: row.section_label_en,
    section_label_fr: row.section_label_fr,
    section_label_ar: row.section_label_ar,
    section_label_ama: row.section_label_ama,
    story_description_en: row.story_description_en,
    story_description_fr: row.story_description_fr,
    story_description_ar: row.story_description_ar,
    story_description_ama: row.story_description_ama,
    badge_text_en: row.badge_text_en,
    badge_text_fr: row.badge_text_fr,
    badge_text_ar: row.badge_text_ar,
    badge_text_ama: row.badge_text_ama,
    image_url: row.image_url,
    values: row.values,
  };
}

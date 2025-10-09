export interface LocalizedText {
  fr: string;
  en: string;
}

export interface TourPrice {
  amount_thb: number;
  amount_eur?: number | null;
  child_price_thb?: number | null;
  child_price_eur?: number | null;
  b2b_price_thb?: number | null;
  b2b_price_eur?: number | null;
  includes_tax: boolean;
  notes: LocalizedText;
}

export interface TourDuration {
  days: number;
  nights: number;
  hours?: number;
  display?: LocalizedText;
}

export interface TourImage {
  url: string;
  alt: LocalizedText;
}

export interface Tour {
  id: string;
  slug: LocalizedText;
  title: LocalizedText;
  subtitle?: LocalizedText;
  destination: string;
  category: LocalizedText;
  duration: TourDuration;
  prices: TourPrice;
  what_included: LocalizedText[];
  what_not_included: LocalizedText[];
  language_support: string[];
  images: TourImage[];
  destination_image?: string;
  booking_method: 'form' | 'whatsapp' | 'email' | 'externalLink';
  related_tour_ids: string[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    og_image?: string;
  };
}

export interface Destination {
  name: LocalizedText;
  slug: LocalizedText;
  hero_image: string;
  intro: LocalizedText;
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    og_image?: string;
  };
}

export interface Category {
  name: LocalizedText;
  slug: LocalizedText;
  icon?: string;
}
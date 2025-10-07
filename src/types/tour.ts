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

// New schema-aligned interface for Supabase tours
export interface SupabaseTourComplete {
  id: string;
  slug_en: string | null;
  slug_fr: string | null;
  title_en: string | null;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  destination: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  price: number | null;
  child_price: number | null;
  currency: string;
  status: string | null;
  published_at: string | null;
  is_private: boolean | null;
  group_size_min: number | null;
  group_size_max: number | null;
  difficulty_level: string | null;
  booking_method: string | null;
  languages: string[] | null;
  included_items: string[] | null;
  excluded_items: string[] | null;
  highlights: any;
  activities: any;
  itinerary: any;
  gallery_images_urls: any;
  hero_image_url: string | null;
  thumbnail_image_url: string | null;
  page?: {
    id: string;
    url: string;
    slug: string | null;
    title: string | null;
  } | null;
  page_categories?: {
    categories: {
      name: string;
    } | null;
  }[] | null;
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
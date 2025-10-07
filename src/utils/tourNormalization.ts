export interface RawTour {
  id: string;
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
  hero_image_url: string | null;
  thumbnail_image_url: string | null;
  gallery_images_urls: any;
  activities: any;
  highlights: any;
  included_items: string[] | null;
  excluded_items: string[] | null;
  itinerary: any;
  difficulty_level: string | null;
  group_size_min: number | null;
  group_size_max: number | null;
  languages: string[] | null;
  is_private: boolean | null;
  published_at: string | null;
  page_categories?: any;
}

export interface NormalizedTour {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: {
    days: number;
    nights: number;
    label: string;
  };
  price: {
    adult: number | null;
    child: number | null;
    currency: string;
  };
  difficulty: string;
  groupSize: {
    min: number;
    max: number;
  };
  languages: string[];
  heroImage: string | null;
  thumbnailImage: string | null;
  galleryImages: string[];
  highlights: string[];
  activities: string[];
  includedItems: string[];
  excludedItems: string[];
  itinerary: any[];
  status: string;
  isPrivate: boolean;
  categoryName: string | null;
}

function toArray<T = string>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed as T[] : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizeTour(raw: RawTour, locale: 'en' | 'fr'): NormalizedTour {
  const title = locale === 'fr' 
    ? (raw.title_fr || raw.title_en || 'Untitled Tour')
    : (raw.title_en || raw.title_fr || 'Untitled Tour');
    
  const description = locale === 'fr'
    ? (raw.description_fr || raw.description_en || '')
    : (raw.description_en || raw.description_fr || '');

  const days = raw.duration_days ?? 1;
  const nights = raw.duration_nights ?? 0;
  const durationLabel = days === 1 ? '1 day' : `${days} days`;

  return {
    id: raw.id,
    title,
    description,
    destination: raw.destination || 'Unknown',
    duration: {
      days,
      nights,
      label: durationLabel,
    },
    price: {
      adult: raw.price,
      child: raw.child_price,
      currency: raw.currency || 'THB',
    },
    difficulty: raw.difficulty_level || 'moderate',
    groupSize: {
      min: raw.group_size_min ?? 2,
      max: raw.group_size_max ?? 8,
    },
    languages: toArray(raw.languages),
    heroImage: raw.hero_image_url,
    thumbnailImage: raw.thumbnail_image_url,
    galleryImages: toArray<string>(raw.gallery_images_urls),
    highlights: toArray<string>(raw.highlights),
    activities: toArray<string>(raw.activities),
    includedItems: raw.included_items || [],
    excludedItems: raw.excluded_items || [],
    itinerary: toArray(raw.itinerary),
    status: raw.status || 'draft',
    isPrivate: raw.is_private ?? false,
    categoryName: raw.page_categories?.[0]?.categories?.name || null,
  };
}

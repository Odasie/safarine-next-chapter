export type Highlights = { included?: string[]; excluded?: string[] };

// DEPRECATED: Use formatPrice from CurrencyContext for currency-aware formatting
export function formatPrice(value?: number | string | null, currency: string = "THB"): string {
  console.warn('DEPRECATED: formatPrice from lib/tours.ts - Use formatPrice from CurrencyContext instead');
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return `${value.toLocaleString('fr-FR')} ${currency}`;
  } catch {
    return `${value} ${currency}`;
  }
}

export function durationToText(days?: number | null, fallback?: string): string {
  if (typeof days === "number" && !Number.isNaN(days)) {
    return days <= 1 ? "1 jour" : `${days} jours`;
  }
  return fallback ?? "";
}

export function extractHighlights(data?: any): Highlights {
  const included = Array.isArray(data?.included) ? data.included : [];
  const excluded = Array.isArray(data?.excluded) ? data.excluded : [];
  return { included, excluded };
}

// Utility functions for robust slug handling
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  // Remove leading slashes and tours prefix
  return slug.replace(/^\/?(tours\/)?/, '').trim();
}

export function createTourUrl(slug: string): string {
  const normalizedSlug = normalizeSlug(slug);
  return `/tours/${normalizedSlug}`;
}

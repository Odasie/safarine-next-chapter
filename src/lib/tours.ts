export type Highlights = { included?: string[]; excluded?: string[] };

export function formatPrice(value?: number | string | null, currency: string = "THB"): string {
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

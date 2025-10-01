/* 
  Supabase Edge Function: import-safarine
  - Scrapes provided safarine.com URLs using Firecrawl
  - Upserts pages, uploads images to storage, saves image metadata
  - Extracts tour price (THB) and duration (days) heuristically from content
*/

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ImportRequest = {
  urls?: string[];
};

type FirecrawlScrapeResponse = {
  success: boolean;
  data?: {
    url?: string;
    title?: string;
    description?: string;
    markdown?: string;
    html?: string;
    images?: string[];
  };
  error?: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function toSlugFromUrl(u: string): string {
  try {
    const url = new URL(u);
    const path = url.pathname.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
    return path || "index";
  } catch {
    return u.replace(/^https?:\/\//, "").replace(/[^a-z0-9-/]/gi, "-");
  }
}

function isDataUrl(src: string) {
  return src.startsWith("data:");
}

function normalizeImageUrl(src: string, baseUrl: string): string | null {
  try {
    if (isDataUrl(src)) return null;
    const url = new URL(src, baseUrl);
    // Skip tracking pixels or svg favicons
    if (url.pathname.endsWith(".svg")) return url.toString();
    return url.toString();
  } catch {
    return null;
  }
}

async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", buf);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getExtFromUrlOrType(u: string, contentType?: string): string {
  const byUrl = u.split("?")[0].split("#")[0].split(".").pop();
  if (byUrl && byUrl.length <= 4) {
    const clean = byUrl.toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "avif"].includes(clean)) return clean;
  }
  if (contentType) {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
      "image/avif": "avif",
    };
    if (map[contentType]) return map[contentType];
  }
  return "jpg";
}

function extractPriceTHB(text: string | undefined): number | null {
  if (!text) return null;
  // Look for amounts followed by THB or ฿ or common separators
  const regexes = [
    /\b([1-9]\d{2,}(?:[.,]\d{3})*)\s*(?:THB|฿)\b/i,
    /\b(?:THB|฿)\s*([1-9]\d{2,}(?:[.,]\d{3})*)\b/i,
  ];
  for (const re of regexes) {
    const m = text.match(re);
    if (m?.[1]) {
      const numeric = Number(m[1].replace(/[.,\s]/g, ""));
      if (!Number.isNaN(numeric)) return numeric;
    }
  }
  // fallback: any large number (>= 500) could be price
  const m2 = text.match(/\b([5-9]\d{2,})\b/);
  if (m2?.[1]) {
    const numeric = Number(m2[1]);
    if (!Number.isNaN(numeric)) return numeric;
  }
  return null;
}

function extractDurationDays(text: string | undefined): number | null {
  if (!text) return null;
  // French: "2 jours", "1 jour", "3 JOURS"
  const m1 = text.match(/\b(\d+)\s+jours?\b/i);
  if (m1?.[1]) return Number(m1[1]);
  // Also capture "X day(s)" in English just in case
  const m2 = text.match(/\b(\d+)\s+days?\b/i);
  if (m2?.[1]) return Number(m2[1]);
  return null;
}

async function scrapeWithFirecrawl(url: string): Promise<FirecrawlScrapeResponse> {
  try {
    const resp = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "html"],
        includeHtml: true,
      }),
    });
    const data = await resp.json();
    return data as FirecrawlScrapeResponse;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

async function upsertPage(url: string, slug: string, title?: string, description?: string, markdown?: string) {
  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        url,
        slug,
        title: title ?? slug,
        meta_title: title ?? slug,
        meta_desc: description ?? null,
        lang: "fr",
        content_md: markdown ?? null,
      },
      { onConflict: "slug" }
    )
    .select("id, slug")
    .single();
  if (error) throw error;
  return data!;
}

async function ensureImageRecord(page_id: string, storagePath: string, meta: {
  alt?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  source_url?: string | null;
  title?: string | null;
  checksum?: string | null;
}) {
  // Prefer dedupe by checksum if present
  if (meta.checksum) {
    const { data: existing, error: selErr } = await supabase
      .from("images")
      .select("id, page_id")
      .eq("checksum", meta.checksum)
      .maybeSingle();
    if (selErr) throw selErr;

    const publicUrl = supabase.storage.from("site-images").getPublicUrl(storagePath).data.publicUrl;

    if (existing?.id) {
      // Update page link (keep the most recent page)
    const { error: updErr } = await supabase
        .from("images")
        .update({
          page_id,
          alt: meta.alt || 'Safarine image',
          src: publicUrl,
          mime_type: meta.mime_type ?? null,
          size_bytes: meta.size_bytes ?? null,
          title: meta.title ?? null,
          source_url: meta.source_url ?? null,
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;
      return existing.id;
    }
  }

  const publicUrl = supabase.storage.from("site-images").getPublicUrl(storagePath).data.publicUrl;

  const { data: inserted, error: insErr } = await supabase
    .from("images")
    .insert({
      page_id,
      alt: meta.alt || 'Safarine image',
      src: publicUrl,
      mime_type: meta.mime_type ?? null,
      size_bytes: meta.size_bytes ?? null,
      title: meta.title ?? null,
      source_url: meta.source_url ?? null,
      checksum: meta.checksum ?? null,
    })
    .select("id")
    .single();
  if (insErr) throw insErr;
  return inserted.id;
}

async function upsertTourFromContent(page_id: string, content: string, heroImage?: string | null) {
  const priceTHB = extractPriceTHB(content);
  const durationDays = extractDurationDays(content);

  if (!priceTHB && !durationDays && !heroImage) {
    return { upserted: false };
  }

  // Check existing by page_id
  const { data: existing, error: selErr } = await supabase
    .from("tours")
    .select("id")
    .eq("page_id", page_id)
    .maybeSingle();
  if (selErr) throw selErr;

  if (existing?.id) {
    const { error: updErr } = await supabase
      .from("tours")
      .update({
        price: priceTHB ?? undefined,
        duration_days: durationDays ?? undefined,
        hero_image: heroImage ?? undefined,
        currency: "THB",
        is_private: true,
      })
      .eq("id", existing.id);
    if (updErr) throw updErr;
    return { upserted: true, id: existing.id };
  } else {
    const { data: ins, error: insErr } = await supabase
      .from("tours")
      .insert({
        page_id,
        price: priceTHB ?? null,
        duration_days: durationDays ?? null,
        hero_image: heroImage ?? null,
        currency: "THB",
        is_private: true,
      })
      .select("id")
      .single();
    if (insErr) throw insErr;
    return { upserted: true, id: ins.id };
  }
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (!FIRECRAWL_API_KEY) {
    return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: ImportRequest;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const defaultUrls = dedupe([
    "http://safarine.com/le-papier-khoi",
    "http://safarine.com/le-fleuve-chao-praya",
    "http://safarine.com/kamphaeng-phet",
    "http://safarine.com/le-lezard-a-longue-queue",
    "http://safarine.com/breve-chronologie-histoire-thailande",
    "http://safarine.com/le-sucre-de-coco",
    "http://safarine.com/les-jours-de-bouddha-thailande",
    "http://safarine.com/le-khlui-flute-traditionnelle",
    "http://safarine.com/-culture-et-histoire-de-la-thailande",
    "http://safarine.com/-les-cathedrales-de-thailande",
    "http://safarine.com/-chiang-mai",
    "http://safarine.com/-les-thailandais-des-montagnes-du-nord-thailandais",
    "http://safarine.com/-kanchanaburi",
    "http://safarine.com/-nature-faune-et-flore",
    "http://safarine.com/-fleuves-et-rivieres-de-thailande",
    "http://safarine.com/-sur-la-route-de-kanchanaburi",
    "http://safarine.com/-informations-voyage",
    "http://safarine.com/-offres-speciales",
    "http://safarine.com/-news",
    "http://safarine.com/-informations",
    "http://safarine.com/breve-chronologie-de-l-histoire-thailandaise",
    "http://safarine.com/les-jours-de-bouddha-en-thailande",
  ]);

  const urls = dedupe((body.urls && Array.isArray(body.urls) ? body.urls : defaultUrls).map(u => u.trim()).filter(Boolean));

  const summary = {
    pagesProcessed: 0,
    pagesSucceeded: 0,
    imagesUploaded: 0,
    imagesSkipped: 0,
    toursUpserted: 0,
    errors: [] as { url: string; message: string }[],
    sampleImages: [] as string[],
  };

  for (const url of urls) {
    summary.pagesProcessed++;
    const slug = toSlugFromUrl(url);

    try {
      const result = await scrapeWithFirecrawl(url);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Unknown error from Firecrawl");
      }

      const { title, description, markdown, html, images } = result.data;
      const page = await upsertPage(url, slug, title, description, markdown ?? "");

      // Collect image URLs
      let imgUrls: string[] = Array.isArray(images) ? images.slice() : [];
      if ((!imgUrls || imgUrls.length === 0) && html) {
        // Fallback: parse img src from HTML
        const srcMatches = Array.from(html.matchAll(/<img\b[^>]*?\bsrc=["']?([^"' >]+)["']?[^>]*>/gi)).map(m => m[1]);
        imgUrls.push(...srcMatches);
      }
      imgUrls = dedupe(imgUrls.map(src => normalizeImageUrl(src, url)).filter((v): v is string => !!v));

      let firstPublicImage: string | null = null;

      for (const imgUrl of imgUrls) {
        try {
          // Fetch the image
          const res = await fetch(imgUrl);
          if (!res.ok) {
            summary.imagesSkipped++;
            continue;
          }
          const contentType = res.headers.get("content-type") || undefined;
          const buf = await res.arrayBuffer();
          // Skip very tiny files (< 1KB) likely to be icons
          if (buf.byteLength < 1024) {
            summary.imagesSkipped++;
            continue;
          }
          const checksum = await sha256Hex(buf);
          const ext = getExtFromUrlOrType(imgUrl, contentType);
          const storagePath = `safarine-com/${slug}/${checksum}.${ext}`;

          // Upload (idempotent via upsert)
          const { error: upErr } = await supabase.storage
            .from("site-images")
            .upload(storagePath, buf, {
              contentType: contentType ?? `image/${ext}`,
              upsert: true,
            });
          if (upErr && !`${upErr.message}`.includes("already exists")) {
            throw upErr;
          }

          // Save record with proper alt text
          const altText = title || slug || 'Safarine image';
          await ensureImageRecord(page.id, storagePath, {
            alt: altText,
            mime_type: contentType ?? null,
            size_bytes: buf.byteLength,
            source_url: imgUrl,
            title: title ?? null,
            checksum,
          });

          const publicUrl = supabase.storage.from("site-images").getPublicUrl(storagePath).data.publicUrl;
          if (!firstPublicImage) firstPublicImage = publicUrl;
          if (summary.sampleImages.length < 5) summary.sampleImages.push(publicUrl);
          summary.imagesUploaded++;
        } catch (imgErr) {
          summary.imagesSkipped++;
          summary.errors.push({ url: imgUrl, message: (imgErr as Error).message });
        }
      }

      // Try to upsert a tour row from content if applicable
      const contentToParse = [markdown ?? "", description ?? "", title ?? ""].join("\n\n");
      try {
        const tu = await upsertTourFromContent(page.id, contentToParse, firstPublicImage);
        if (tu.upserted) summary.toursUpserted++;
      } catch (tourErr) {
        summary.errors.push({ url, message: "Tour upsert failed: " + (tourErr as Error).message });
      }

      summary.pagesSucceeded++;
    } catch (err) {
      summary.errors.push({ url, message: (err as Error).message });
    }
  }

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

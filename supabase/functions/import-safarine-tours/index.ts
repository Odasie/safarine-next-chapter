import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Basic helpers
function toSlug(v?: string | null): string | null {
  if (!v) return null;
  return v
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitList(v?: string | null): string[] {
  if (!v) return [];
  return v
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function fileNameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const base = u.pathname.split("/").filter(Boolean).pop() || "image";
    return base.replace(/[^a-zA-Z0-9._-]/g, "_");
  } catch {
    return "image";
  }
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Price validation helper
function validatePrice(value: string, fieldName: string): { valid: boolean; price: number | null; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: true, price: null }; // Optional field
  }
  
  const cleaned = value.trim().replace(/[^\d.,]/g, ''); // Remove non-numeric except . and ,
  const normalized = cleaned.replace(',', '.'); // Handle comma as decimal separator
  const parsed = parseFloat(normalized);
  
  if (isNaN(parsed)) {
    return { valid: false, price: null, error: `${fieldName} must be a valid number` };
  }
  
  if (parsed <= 0) {
    return { valid: false, price: null, error: `${fieldName} must be greater than 0` };
  }
  
  if (parsed > 1000000) {
    return { valid: false, price: null, error: `${fieldName} seems unreasonably high (max 1,000,000)` };
  }
  
  return { valid: true, price: Math.round(parsed * 100) / 100 }; // Round to 2 decimal places
}

function parseTsv(tsv: string): Record<string, string>[] {
  const lines = tsv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split("\t").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

// Normalization utilities for Step 2
function normalizeList(cell: string | null | undefined, fieldName: string): string[] {
  if (!cell) return [];
  const trimmed = cell.trim();
  if (!trimmed) return [];
  
  // Try parsing as JSON first
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(x => x && typeof x === 'string');
    } catch (e) {
      console.warn(`${fieldName}: JSON parse failed, using delimiter split`);
    }
  }
  
  // Fallback to delimiter split
  return splitList(trimmed);
}

function normalizeJsonArray(cell: string | null | undefined, fieldName: string): string | null {
  if (!cell) return null;
  const trimmed = cell.trim();
  if (!trimmed) return null;
  
  // If already valid JSON array, return as-is
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return trimmed;
    } catch (e) {
      console.warn(`${fieldName}: Invalid JSON array, converting from delimited list`);
    }
  }
  
  // Convert semicolon/comma list to JSON array
  const list = splitList(trimmed);
  return JSON.stringify(list);
}

function normalizeStatus(cell: string | null | undefined): string {
  if (!cell) return 'draft';
  const lower = cell.toLowerCase().trim();
  if (['published', 'draft', 'archived'].includes(lower)) return lower;
  return 'draft';
}

function normalizeTimestamp(cell: string | null | undefined): string | null {
  if (!cell) return null;
  const trimmed = cell.trim();
  if (!trimmed) return null;
  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

function normalizeNumber(cell: string | null | undefined): number | null {
  if (!cell) return null;
  const num = parseInt(cell, 10);
  return isNaN(num) ? null : num;
}

// Normalize empty strings to NULL
function normalizeToNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

// Slug columns to ignore - slugs are auto-generated server-side
const IGNORED_SLUG_COLUMNS = ['slug_en', 'slug_fr', 'url_slug_en', 'url_slug_fr', 'urlslugen', 'urlslugfr'];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const tsv: string = body.tsv || body.tsvText || "";
    let rows: Record<string, string>[] = Array.isArray(body.rows) ? body.rows : [];
    if (!rows.length && tsv) rows = parseTsv(tsv);

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "No data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bucket = "site-images";

    let processed = 0;
    let pagesCreated = 0;
    let pagesUpdated = 0;
    let toursCreated = 0;
    let toursUpdated = 0;
    let imagesUploaded = 0;
    let categoriesLinked = 0;
    const validationErrors: string[] = [];
    const errors: string[] = [];
    const priceValidations = { valid: 0, invalid: 0 };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;
      processed++;
      const rowErrors: string[] = [];

      // Tolerant key matching
      const getField = (key: string): string | undefined => {
        const lowerKey = key.toLowerCase().replace(/[_\s]/g, '');
        const entry = Object.entries(row).find(([k]) => 
          k.toLowerCase().replace(/[_\s]/g, '') === lowerKey
        );
        return entry ? entry[1] : undefined;
      };

      // Extract fields with preference for new names, fallback to legacy
      const url = getField('url')?.trim();
      
      // Titles - required for URL generation
      const title_en = getField('title_en') || getField('titleen');
      const title_fr = getField('title_fr') || getField('titlefr');
      
      // Log warning if legacy slug columns are detected (once per file at first occurrence)
      if (i === 0) {
        const detectedSlugColumns = IGNORED_SLUG_COLUMNS.filter(col => getField(col));
        if (detectedSlugColumns.length > 0) {
          console.warn(`Import file contains legacy slug columns (${detectedSlugColumns.join(', ')}) - ignoring; slugs are auto-generated server-side`);
        }
      }

      const description_en = getField('description_en') || getField('descriptionen');
      const description_fr = getField('description_fr') || getField('descriptionfr');
      const destination = getField('destination')?.trim() || 'Kanchanaburi';
      const duration_days = normalizeNumber(getField('duration_days') || getField('durationdays'));
      const duration_nights = normalizeNumber(getField('duration_nights') || getField('durationnights'));

      // Prices
      const priceStr = getField('price')?.trim();
      const childPriceStr = getField('child_price') || getField('childprice');
      const b2bPriceStr = getField('b2b_price') || getField('b2bprice');

      const validatedPrice = validatePrice(priceStr || '', 'price');
      const validatedChildPrice = childPriceStr ? validatePrice(childPriceStr, 'child_price') : { valid: true, price: null };
      const validatedB2bPrice = b2bPriceStr ? validatePrice(b2bPriceStr, 'b2b_price') : { valid: true, price: null };

      if (validatedPrice.valid) priceValidations.valid++;
      else priceValidations.invalid++;
      if (validatedChildPrice.valid) priceValidations.valid++;
      else priceValidations.invalid++;
      if (validatedB2bPrice.valid) priceValidations.valid++;
      else priceValidations.invalid++;

      if (!validatedPrice.valid) rowErrors.push(validatedPrice.error || 'Invalid price');
      if (!validatedChildPrice.valid) rowErrors.push(validatedChildPrice.error || 'Invalid child_price');
      if (!validatedB2bPrice.valid) rowErrors.push(validatedB2bPrice.error || 'Invalid b2b_price');

      // Lists: prefer included_items/excluded_items, fallback to what_included/what_not_included
      let included_items = normalizeList(getField('included_items') || getField('includeditems'), 'included_items');
      let excluded_items = normalizeList(getField('excluded_items') || getField('excludeditems'), 'excluded_items');
      
      if (included_items.length === 0) {
        const legacy_included = normalizeList(getField('whatincluded'), 'what_included (legacy)');
        if (legacy_included.length > 0) {
          included_items = legacy_included;
          console.warn(`Row ${rowNum}: Using legacy what_included`);
        }
      }
      if (excluded_items.length === 0) {
        const legacy_excluded = normalizeList(getField('whatnotincluded'), 'what_not_included (legacy)');
        if (legacy_excluded.length > 0) {
          excluded_items = legacy_excluded;
          console.warn(`Row ${rowNum}: Using legacy what_not_included`);
        }
      }

      // JSONB arrays
      const highlightsRaw = normalizeJsonArray(getField('highlights'), 'highlights');
      const activitiesRaw = normalizeJsonArray(getField('activities'), 'activities');
      const galleryImagesUrlsRaw = normalizeJsonArray(getField('gallery_images_urls') || getField('galleryimagesurls'), 'gallery_images_urls');

      let highlights_array = null;
      let activities_array = null;
      let gallery_images_urls_array = null;

      try {
        highlights_array = highlightsRaw ? JSON.parse(highlightsRaw) : [];
      } catch (e) {
        rowErrors.push('Invalid highlights JSON');
      }
      try {
        activities_array = activitiesRaw ? JSON.parse(activitiesRaw) : [];
      } catch (e) {
        rowErrors.push('Invalid activities JSON');
      }
      try {
        gallery_images_urls_array = galleryImagesUrlsRaw ? JSON.parse(galleryImagesUrlsRaw) : [];
      } catch (e) {
        rowErrors.push('Invalid gallery_images_urls JSON');
      }

      // Status and published_at
      let status = normalizeStatus(getField('status'));
      let published_at = normalizeTimestamp(getField('published_at') || getField('publishedat'));
      
      if (status === 'published' && !published_at) {
        published_at = new Date().toISOString();
        console.log(`Row ${rowNum}: Auto-set published_at for published tour`);
      }

      const primaryImageUrl = getField('primaryimage')?.trim();
      const destinationImageUrl = getField('destinationimage')?.trim();

      // If errors, skip processing
      if (rowErrors.length > 0) {
        errors.push(`Row ${rowNum}: ${rowErrors.join('; ')}`);
        validationErrors.push(...rowErrors.map(e => `Row ${rowNum}: ${e}`));
        continue;
      }

      // Upsert page - generate URL from title, let DB generate slug from url
      const urlSlug = toSlug(title_en || title_fr || '') || 'tour';
      const pageUrl = `/tours/${urlSlug}`;
      
      // Query by URL (canonical source) instead of slug
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('url', pageUrl)
        .maybeSingle();

      let pageId: string;
      if (existingPage) {
        const { data: updatedPage, error: pageUpdateError } = await supabase
          .from('pages')
          .update({
            url: pageUrl,
            title: normalizeToNull(title_en || title_fr),
            meta_title: normalizeToNull(title_en || title_fr),
            meta_desc: normalizeToNull(description_en || description_fr),
            lang: 'en',
          })
          .eq('id', existingPage.id)
          .select('id')
          .single();

        if (pageUpdateError || !updatedPage) {
          errors.push(`Row ${rowNum}: Page update failed: ${pageUpdateError?.message}`);
          continue;
        }
        pageId = updatedPage.id;
        pagesUpdated++;
      } else {
        // Omit slug field - let DB generate it from url via default expression
        const { data: newPage, error: pageInsertError } = await supabase
          .from('pages')
          .insert({
            url: pageUrl,
            title: normalizeToNull(title_en || title_fr),
            meta_title: normalizeToNull(title_en || title_fr),
            meta_desc: normalizeToNull(description_en || description_fr),
            lang: 'en',
            parent_url: null,
            level: 1,
            content_md: null,
          })
          .select('id')
          .single();

        if (pageInsertError || !newPage) {
          errors.push(`Row ${rowNum}: Page insert failed: ${pageInsertError?.message}`);
          continue;
        }
        pageId = newPage.id;
        pagesCreated++;
      }

      // Link category
      const categoryName = destination;
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle();

      let categoryId: string | null = null;
      if (category) {
        categoryId = category.id;
      } else {
        const { data: newCat, error: catError } = await supabase
          .from('categories')
          .insert({ name: categoryName })
          .select('id')
          .single();
        if (!catError && newCat) {
          categoryId = newCat.id;
        }
      }

      if (categoryId) {
        const { data: existingLink } = await supabase
          .from('page_categories')
          .select('*')
          .eq('page_id', pageId)
          .eq('category_id', categoryId)
          .maybeSingle();

        if (!existingLink) {
          await supabase.from('page_categories').insert({ page_id: pageId, category_id: categoryId });
          categoriesLinked++;
        }
      }

      // Upload images
      let primaryImgRecord = null;
      let destImgRecord = null;

      if (primaryImageUrl) {
        try {
          const fileName = fileNameFromUrl(primaryImageUrl);
          const imgResp = await fetch(primaryImageUrl);
          if (!imgResp.ok) throw new Error(`HTTP ${imgResp.status}`);
          const imgBuffer = await imgResp.arrayBuffer();
          const checksum = await sha256Hex(imgBuffer);

          const { data: existingImg } = await supabase
            .from('images')
            .select('*')
            .eq('checksum', checksum)
            .maybeSingle();

          if (existingImg) {
            primaryImgRecord = existingImg;
          } else {
            const storagePath = `tours/${destination}/${fileName}`;
            const { error: uploadError } = await supabase.storage
              .from('tour-images')
              .upload(storagePath, imgBuffer, { contentType: 'image/webp', upsert: true });

            if (!uploadError) {
              const publicUrl = supabase.storage.from('tour-images').getPublicUrl(storagePath).data.publicUrl;
              const { data: newImg } = await supabase
                .from('images')
                .insert({
                  file_path: storagePath,
                  source_url: primaryImageUrl,
                  checksum,
                  category: 'tours',
                  image_type: 'hero',
                  published: true,
                })
                .select('*')
                .single();
              if (newImg) {
                primaryImgRecord = newImg;
                imagesUploaded++;
              }
            }
          }
        } catch (e: any) {
          console.error(`Row ${rowNum}: Primary image upload failed:`, e.message);
        }
      }

      if (destinationImageUrl) {
        try {
          const fileName = fileNameFromUrl(destinationImageUrl);
          const imgResp = await fetch(destinationImageUrl);
          if (!imgResp.ok) throw new Error(`HTTP ${imgResp.status}`);
          const imgBuffer = await imgResp.arrayBuffer();
          const checksum = await sha256Hex(imgBuffer);

          const { data: existingImg } = await supabase
            .from('images')
            .select('*')
            .eq('checksum', checksum)
            .maybeSingle();

          if (existingImg) {
            destImgRecord = existingImg;
          } else {
            const storagePath = `destinations/${destination}/${fileName}`;
            const { error: uploadError } = await supabase.storage
              .from('tour-images')
              .upload(storagePath, imgBuffer, { contentType: 'image/webp', upsert: true });

            if (!uploadError) {
              const publicUrl = supabase.storage.from('tour-images').getPublicUrl(storagePath).data.publicUrl;
              const { data: newImg } = await supabase
                .from('images')
                .insert({
                  file_path: storagePath,
                  source_url: destinationImageUrl,
                  checksum,
                  category: 'destinations',
                  image_type: 'thumbnail',
                  published: true,
                })
                .select('*')
                .single();
              if (newImg) {
                destImgRecord = newImg;
                imagesUploaded++;
              }
            }
          }
        } catch (e: any) {
          console.error(`Row ${rowNum}: Destination image upload failed:`, e.message);
        }
      }

      // Upsert tour - omit slug_en/slug_fr (generated server-side)
      const tourPayload = {
        page_id: pageId,
        title_en: normalizeToNull(title_en),
        title_fr: normalizeToNull(title_fr),
        description_en: normalizeToNull(description_en),
        description_fr: normalizeToNull(description_fr),
        destination: normalizeToNull(destination) || 'Kanchanaburi',
        duration_days: duration_days,
        duration_nights: duration_nights,
        price: validatedPrice.price,
        child_price: validatedChildPrice.price,
        b2b_price: validatedB2bPrice.price,
        currency: 'THB',
        status,
        published_at,
        included_items,
        excluded_items,
        highlights: highlights_array,
        activities: activities_array,
        gallery_images_urls: gallery_images_urls_array,
        hero_image_url: normalizeToNull(primaryImgRecord?.file_path || primaryImageUrl),
        thumbnail_image_url: normalizeToNull(destImgRecord?.file_path || destinationImageUrl),
      };

      const { data: existingTour } = await supabase
        .from('tours')
        .select('id')
        .eq('page_id', pageId)
        .maybeSingle();

      if (existingTour) {
        const { error: tourUpdateError } = await supabase
          .from('tours')
          .update(tourPayload)
          .eq('id', existingTour.id);
        
        if (tourUpdateError) {
          errors.push(`Row ${rowNum}: Tour update failed: ${tourUpdateError.message.substring(0, 100)}`);
        } else {
          toursUpdated++;
        }
      } else {
        const { error: tourInsertError } = await supabase
          .from('tours')
          .insert(tourPayload);
        
        if (tourInsertError) {
          errors.push(`Row ${rowNum}: Tour insert failed: ${tourInsertError.message.substring(0, 100)}`);
        } else {
          toursCreated++;
        }
      }
    }

    const summary = {
      processed,
      pages_created: pagesCreated,
      pages_updated: pagesUpdated,
      tours_created: toursCreated,
      tours_updated: toursUpdated,
      categories_linked: categoriesLinked,
      images_uploaded: imagesUploaded,
      price_validations: priceValidations,
      validation_errors: validationErrors,
      errors,
    };

    return new Response(JSON.stringify(summary, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

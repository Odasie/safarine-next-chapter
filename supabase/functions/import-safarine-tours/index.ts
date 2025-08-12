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

    const summary: any = {
      processed: 0,
      pages_created: 0,
      pages_updated: 0,
      tours_created: 0,
      tours_updated: 0,
      images_uploaded: 0,
      categories_linked: 0,
      errors: [] as string[],
    };

    for (const row of rows) {
      try {
        // Map inputs with tolerant keys
        const get = (k: string) => row[k] ?? row[k.toLowerCase()] ?? "";
        const slug = toSlug(get("url_slug_fr") || get("url_slug_en") || get("title_fr") || get("title_en"));
        if (!slug) throw new Error("Missing slug");

        const title = get("title_fr") || get("title_en") || slug;
        const meta_desc = get("description_fr") || get("description_en") || "";
        const content_md = meta_desc;
        const destination = get("destination");
        const categoryName = get("category_fr") || get("category_en");
        const durationDaysRaw = get("duration_days");
        const duration_days = durationDaysRaw ? Number(durationDaysRaw) : null;
        const what_included = splitList(get("what_included"));
        const what_not_included = splitList(get("what_not_included"));
        const image_url = get("image_url");
        const destination_image_url = get("destination_image_url");

        // Upsert page by slug manually (select -> insert/update)
        const { data: existingPage, error: findPageErr } = await supabase
          .from("pages")
          .select("id, slug")
          .eq("slug", slug)
          .maybeSingle();
        if (findPageErr) throw findPageErr;

        let pageId: string | null = existingPage?.id ?? null;
        if (!pageId) {
          const { data: inserted, error: insErr } = await supabase
            .from("pages")
            .insert({
              url: `https://www.safarine.com/${slug}`,
              slug,
              title,
              meta_title: title,
              meta_desc,
              content_md,
              lang: "fr",
            })
            .select("id")
            .single();
          if (insErr) throw insErr;
          pageId = inserted.id;
          summary.pages_created++;
        } else {
          const { error: updErr } = await supabase
            .from("pages")
            .update({ title, meta_title: title, meta_desc, content_md, lang: "fr" })
            .eq("id", pageId);
          if (updErr) throw updErr;
          summary.pages_updated++;
        }

        // Category handling
        if (categoryName && pageId) {
          const { data: cat, error: catSelErr } = await supabase
            .from("categories")
            .select("id, name")
            .eq("name", categoryName)
            .maybeSingle();
          if (catSelErr) throw catSelErr;

          let categoryId = cat?.id ?? null;
          if (!categoryId) {
            const { data: newCat, error: insCatErr } = await supabase
              .from("categories")
              .insert({ name: categoryName })
              .select("id")
              .single();
            if (insCatErr) throw insCatErr;
            categoryId = newCat.id;
          }

          // Link page to category if not already
          const { data: link, error: linkSelErr } = await supabase
            .from("page_categories")
            .select("page_id, category_id")
            .eq("page_id", pageId)
            .eq("category_id", categoryId)
            .maybeSingle();
          if (linkSelErr && linkSelErr.code !== "PGRST116") throw linkSelErr; // ignore no rows error shape

          if (!link) {
            const { error: linkInsErr } = await supabase
              .from("page_categories")
              .insert({ page_id: pageId, category_id: categoryId });
            if (linkInsErr) throw linkInsErr;
            summary.categories_linked++;
          }
        }

        // Upload images (primary + destination)
        const uploadedPublicUrls: string[] = [];
        for (const srcUrl of [image_url, destination_image_url].filter(Boolean)) {
          try {
            const res = await fetch(srcUrl!);
            if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
            const arrayBuf = await res.arrayBuffer();
            const checksum = await sha256Hex(arrayBuf);
            const contentType = res.headers.get("content-type") || "image/jpeg";
            const baseName = fileNameFromUrl(srcUrl!);
            const path = `tours/${slug}/${baseName}`;

            // Upload with upsert to avoid duplicates in storage
            const { error: upErr } = await supabase.storage
              .from(bucket)
              .upload(path, new Uint8Array(arrayBuf), {
                contentType,
                upsert: true,
              } as any);
            if (upErr && !String(upErr.message || "").includes("exists")) throw upErr;

            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
            const publicUrl = pub.publicUrl;
            uploadedPublicUrls.push(publicUrl);

            // Ensure image record (dedupe by checksum)
            if (pageId) {
              const { data: imgExisting, error: imgSelErr } = await supabase
                .from("images")
                .select("id, checksum")
                .eq("checksum", checksum)
                .maybeSingle();
              if (imgSelErr) throw imgSelErr;
              if (!imgExisting) {
                const { error: imgInsErr } = await supabase.from("images").insert({
                  page_id: pageId,
                  src: publicUrl,
                  alt: title,
                  title,
                  checksum,
                  mime_type: contentType,
                });
                if (imgInsErr) throw imgInsErr;
                summary.images_uploaded++;
              }
            }
          } catch (imgErr) {
            console.error("Image upload error", imgErr);
            summary.errors.push(`Image error for slug ${slug}: ${imgErr?.message || imgErr}`);
          }
        }

        // Upsert tour by page_id
        if (pageId) {
          const { data: existingTour, error: tourSelErr } = await supabase
            .from("tours")
            .select("id")
            .eq("page_id", pageId)
            .maybeSingle();
          if (tourSelErr) throw tourSelErr;

          const hero_image = uploadedPublicUrls[0] || null;
          const tourPayload: any = {
            page_id: pageId,
            duration_days: duration_days ?? null,
            price: null,
            currency: "THB",
            hero_image,
            highlights: { included: what_included, excluded: what_not_included },
          };

          if (!existingTour) {
            const { error: insTourErr } = await supabase.from("tours").insert(tourPayload);
            if (insTourErr) throw insTourErr;
            summary.tours_created++;
          } else {
            const { error: updTourErr } = await supabase
              .from("tours")
              .update(tourPayload)
              .eq("page_id", pageId);
            if (updTourErr) throw updTourErr;
            summary.tours_updated++;
          }
        }

        summary.processed++;
      } catch (rowErr: any) {
        console.error("Row error", rowErr);
        summary.errors.push(rowErr?.message || String(rowErr));
      }
    }

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

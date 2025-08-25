import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface CSVRow {
  "Category": string;
  "Subcategory": string;
  "Image Name": string;
  "File Path": string;
  "Comments": string;
  "Published": string;
  "URL Path": string;
  "Dimensions (WxH)": string;
  "Format": string;
  "Priority": string;
  "Usage Context": string;
  "Alt Text (EN)": string;
  "Alt Text (FR)": string;
  "Description (EN)": string;
  "Description (FR)": string;
  "Keywords": string;
  "Tour ID": string;
  "Tour Slug": string;
  "Loading Strategy": string;
  "File Size Target": string;
  "Responsive Variant": string;
  "Notes": string;
}

function parseDimensions(dimensionStr: string): { width: number; height: number } {
  const match = dimensionStr.match(/(\d+)x(\d+)/);
  if (!match) return { width: 1920, height: 1080 };
  return {
    width: parseInt(match[1]),
    height: parseInt(match[2])
  };
}

function parseFileSize(sizeStr: string): number {
  const match = sizeStr.match(/(\d+)KB/i);
  return match ? parseInt(match[1]) : 200;
}

function csvToArray(csvString: string): CSVRow[] {
  const lines = csvString.split('\n');
  const headers = lines[0].split('\t'); // Assuming TSV format
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split('\t');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
      });
      return row as CSVRow;
    });
}

function convertCSVRowToImageRecord(row: CSVRow): any {
  const dimensions = parseDimensions(row["Dimensions (WxH)"]);
  const fileSize = parseFileSize(row["File Size Target"]);
  
  return {
    // Core image data
    file_path: row["File Path"] || row["URL Path"],
    file_name: row["Image Name"],
    src: row["File Path"] || row["URL Path"],
    width: dimensions.width,
    height: dimensions.height,
    file_size_kb: fileSize,
    
    // Categorization
    category: row["Category"].toLowerCase(),
    subcategory: row["Subcategory"]?.toLowerCase() || null,
    image_type: row["Image Name"].includes('hero') ? 'hero' : 
                row["Image Name"].includes('thumb') ? 'thumbnail' : 'gallery',
    
    // Multilingual content
    alt_en: row["Alt Text (EN)"] || `${row["Category"]} ${row["Image Name"]}`,
    alt_fr: row["Alt Text (FR)"] || `${row["Category"]} ${row["Image Name"]}`,
    title_en: row["Description (EN)"] || null,
    title_fr: row["Description (FR)"] || null,
    description_en: row["Description (EN)"] || null,
    description_fr: row["Description (FR)"] || null,
    
    // SEO and metadata
    keywords_en: row["Keywords"] ? row["Keywords"].split(',').map(k => k.trim()) : null,
    keywords_fr: row["Keywords"] ? row["Keywords"].split(',').map(k => k.trim()) : null,
    tags: row["Keywords"] ? row["Keywords"].split(',').map(k => k.trim()) : null,
    
    // Display and behavior
    position: 0,
    featured: row["Image Name"].includes('hero') || row["Image Name"].includes('featured'),
    loading_strategy: row["Loading Strategy"].toLowerCase() || 'lazy',
    priority: row["Priority"].toLowerCase() || 'medium',
    responsive_variant: row["Responsive Variant"].toLowerCase() || 'desktop',
    usage_context: row["Usage Context"] ? row["Usage Context"].split('/').map(u => u.trim()) : null,
    
    // Relationships
    tour_id: row["Tour ID"] ? parseInt(row["Tour ID"]) : null,
    page_id: null, // Will be set based on category/subcategory mapping
    
    // Workflow management
    published: row["Published"].toLowerCase() === 'yes' || row["Published"] === '1',
    comments: row["Comments"] || row["Notes"] || null
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvData, dryRun = false } = await req.json();
    
    if (!csvData) {
      return new Response(
        JSON.stringify({ error: 'CSV data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing CSV import request...');
    
    // Parse CSV data
    const csvRows = csvToArray(csvData);
    console.log(`Parsed ${csvRows.length} rows from CSV`);
    
    // Convert to image records
    const imageRecords = csvRows.map(convertCSVRowToImageRecord);
    
    // Validation results
    const validationResults = {
      totalRows: csvRows.length,
      validRecords: 0,
      invalidRecords: [],
      dimensionViolations: 0,
      missingRequiredFields: 0,
      duplicatePaths: 0
    };

    // Validate records
    const validRecords = [];
    const seenPaths = new Set();
    
    for (let i = 0; i < imageRecords.length; i++) {
      const record = imageRecords[i];
      const errors = [];
      
      // Check required fields
      if (!record.alt_en || !record.alt_fr) {
        errors.push('Missing required alt text');
        validationResults.missingRequiredFields++;
      }
      
      // Check dimensions
      if (record.width > 1920 || record.height > 1080) {
        errors.push(`Dimensions ${record.width}x${record.height} exceed max 1920x1080`);
        validationResults.dimensionViolations++;
      }
      
      // Check duplicates
      if (seenPaths.has(record.file_path)) {
        errors.push('Duplicate file path');
        validationResults.duplicatePaths++;
      } else {
        seenPaths.add(record.file_path);
      }
      
      if (errors.length === 0) {
        validRecords.push(record);
        validationResults.validRecords++;
      } else {
        validationResults.invalidRecords.push({
          row: i + 1,
          file_path: record.file_path,
          errors
        });
      }
    }

    console.log(`Validation complete: ${validRecords.length} valid, ${validationResults.invalidRecords.length} invalid`);

    // If dry run, return validation results only
    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          validation: validationResults,
          sampleRecords: validRecords.slice(0, 5)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert valid records
    let insertResults = { data: [], error: null };
    if (validRecords.length > 0) {
      console.log(`Inserting ${validRecords.length} valid records...`);
      insertResults = await supabase
        .from('images')
        .insert(validRecords)
        .select();
      
      if (insertResults.error) {
        console.error('Insert error:', insertResults.error);
      } else {
        console.log(`Successfully inserted ${insertResults.data?.length || 0} records`);
      }
    }

    // Run validation function
    const { data: validationCheck } = await supabase
      .rpc('validate_117_image_system');

    return new Response(
      JSON.stringify({
        success: !insertResults.error,
        inserted: insertResults.data?.length || 0,
        validation: validationResults,
        systemValidation: validationCheck,
        error: insertResults.error
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('CSV import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
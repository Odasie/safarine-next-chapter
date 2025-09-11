import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, type, message, source = 'contact_page' }: ContactFormRequest = await req.json();

    console.log('Processing contact form submission:', { name, email, type, source });

    // Store the lead in the database
    const { data: lead, error: insertError } = await supabase
      .from('contact_leads')
      .insert({
        name,
        email,
        phone,
        message_type: type,
        message,
        source,
        status: 'new'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing contact lead:', insertError);
      throw new Error('Failed to store contact information');
    }

    console.log('Contact lead stored successfully:', lead.id);

    // Send notification email to b2b@safarine.com
    const adminEmailResponse = await resend.emails.send({
      from: "Safarine Contact Form <noreply@safarine.com>",
      to: ["b2b@safarine.com"],
      subject: `New Contact Lead: ${type || 'General Inquiry'} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
            New Contact Lead Received
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message Type:</strong> ${type || 'General inquiry'}</p>
            <p><strong>Source:</strong> ${source}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Lead ID: ${lead.id}<br>
              Submitted: ${new Date(lead.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Error sending admin notification email:", adminEmailResponse.error);
      // Don't throw error - we still want to send customer confirmation
    } else {
      console.log("Admin notification email sent successfully");
    }

    // Send confirmation email to the customer
    const customerEmailResponse = await resend.emails.send({
      from: "Safarine Tours <noreply@safarine.com>",
      to: [email],
      subject: "Thank you for contacting Safarine Tours",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
            Thank you for contacting us!
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
          
          <p style="line-height: 1.6;">
            Thank you for reaching out to Safarine Tours. We have received your ${type || 'inquiry'} 
            and our team will review it carefully.
          </p>
          
          <p style="line-height: 1.6;">
            We typically respond to inquiries within 24-48 hours. If you need immediate assistance, 
            please don't hesitate to call us at <strong>+66-860491662</strong>.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Type:</strong> ${type || 'General inquiry'}</p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="line-height: 1.6;">
            Best regards,<br>
            <strong>The Safarine Tours Team</strong><br>
            Kanchanaburi & Chiang Mai, Thailand<br>
            Phone: +66-860491662<br>
            Licence: 14/03149
          </p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 5px; font-size: 12px; color: #666;">
            <p style="margin: 0;">
              This is an automated confirmation. Please do not reply to this email.<br>
              If you have additional questions, please contact us through our website or phone.
            </p>
          </div>
        </div>
      `,
    });

    if (customerEmailResponse.error) {
      console.error("Error sending customer confirmation email:", customerEmailResponse.error);
    } else {
      console.log("Customer confirmation email sent successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        leadId: lead.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing your request' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
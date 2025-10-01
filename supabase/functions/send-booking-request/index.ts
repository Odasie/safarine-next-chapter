import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface BookingRequest {
  tourId?: string;
  tourTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bookingDate: string;
  adults: number;
  children: number;
  totalPrice?: number;
  currency?: string;
  destination?: string;
  duration?: { days: number; nights: number };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingRequest = await req.json();
    
    console.log('Processing booking request:', {
      tourTitle: bookingData.tourTitle,
      email: bookingData.email,
      bookingDate: bookingData.bookingDate
    });

    // Validate required fields
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || 
        !bookingData.bookingDate || !bookingData.adults) {
      throw new Error('Missing required booking information');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store booking request in database
    const { data: leadData, error: leadError } = await supabase
      .from('contact_leads')
      .insert({
        name: `${bookingData.firstName} ${bookingData.lastName}`,
        email: bookingData.email,
        phone: bookingData.phone || null,
        message: `Booking Request - ${bookingData.tourTitle}\n\nDate: ${bookingData.bookingDate}\nParticipants: ${bookingData.adults} adults${bookingData.children > 0 ? `, ${bookingData.children} children` : ''}\n${bookingData.totalPrice ? `Estimated Total: ${bookingData.currency} ${bookingData.totalPrice}` : ''}`,
        message_type: 'booking_request',
        source: 'booking_form',
        status: 'new'
      })
      .select()
      .single();

    if (leadError) {
      console.error('Database error:', leadError);
      throw new Error('Failed to store booking request');
    }

    // Format duration text
    const durationText = bookingData.duration 
      ? `${bookingData.duration.days} day${bookingData.duration.days > 1 ? 's' : ''}${bookingData.duration.nights > 0 ? `, ${bookingData.duration.nights} night${bookingData.duration.nights > 1 ? 's' : ''}` : ''}`
      : '';

    // Send admin notification email
    const adminEmailHtml = `
      <h2>New Booking Request</h2>
      <p>A new booking request has been received:</p>
      
      <h3>Tour Details</h3>
      <ul>
        <li><strong>Tour:</strong> ${bookingData.tourTitle}</li>
        ${bookingData.destination ? `<li><strong>Destination:</strong> ${bookingData.destination}</li>` : ''}
        ${durationText ? `<li><strong>Duration:</strong> ${durationText}</li>` : ''}
        <li><strong>Booking Date:</strong> ${bookingData.bookingDate}</li>
      </ul>

      <h3>Customer Information</h3>
      <ul>
        <li><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</li>
        <li><strong>Email:</strong> ${bookingData.email}</li>
        ${bookingData.phone ? `<li><strong>Phone:</strong> ${bookingData.phone}</li>` : ''}
      </ul>

      <h3>Participants</h3>
      <ul>
        <li><strong>Adults:</strong> ${bookingData.adults}</li>
        ${bookingData.children > 0 ? `<li><strong>Children:</strong> ${bookingData.children}</li>` : ''}
        <li><strong>Total Participants:</strong> ${bookingData.adults + bookingData.children}</li>
      </ul>

      ${bookingData.totalPrice ? `
      <h3>Pricing</h3>
      <ul>
        <li><strong>Estimated Total:</strong> ${bookingData.currency} ${bookingData.totalPrice.toLocaleString()}</li>
      </ul>
      ` : ''}

      <p><strong>Request ID:</strong> ${leadData.id}</p>
      <p><em>Please respond to this booking request within 24 hours.</em></p>
    `;

    const { error: adminEmailError } = await resend.emails.send({
      from: 'Safarine Bookings <bookings@safarine.com>',
      to: ['b2b@safarine.com'],
      subject: `New Booking Request: ${bookingData.tourTitle}`,
      html: adminEmailHtml,
    });

    if (adminEmailError) {
      console.error('Admin email error:', adminEmailError);
      // Don't throw - continue to send customer email
    }

    // Send customer confirmation email
    const customerEmailHtml = `
      <h2>Thank You for Your Booking Request!</h2>
      <p>Dear ${bookingData.firstName},</p>
      
      <p>We have received your booking request for <strong>${bookingData.tourTitle}</strong> and will contact you within 24 hours to confirm your reservation.</p>

      <h3>Your Booking Details</h3>
      <ul>
        <li><strong>Tour:</strong> ${bookingData.tourTitle}</li>
        ${bookingData.destination ? `<li><strong>Destination:</strong> ${bookingData.destination}</li>` : ''}
        ${durationText ? `<li><strong>Duration:</strong> ${durationText}</li>` : ''}
        <li><strong>Preferred Date:</strong> ${bookingData.bookingDate}</li>
        <li><strong>Participants:</strong> ${bookingData.adults} adult${bookingData.adults > 1 ? 's' : ''}${bookingData.children > 0 ? `, ${bookingData.children} child${bookingData.children > 1 ? 'ren' : ''}` : ''}</li>
        ${bookingData.totalPrice ? `<li><strong>Estimated Total:</strong> ${bookingData.currency} ${bookingData.totalPrice.toLocaleString()}</li>` : ''}
      </ul>

      <h3>Next Steps</h3>
      <ol>
        <li>Our team will review your booking request</li>
        <li>We will contact you via email or phone to confirm availability</li>
        <li>Once confirmed, we will provide payment instructions</li>
        <li>After payment, you will receive your booking confirmation and tour details</li>
      </ol>

      <p>If you have any questions, please don't hesitate to contact us:</p>
      <ul>
        <li>Email: b2b@safarine.com</li>
        <li>Phone: +66 123 456 789</li>
      </ul>

      <p>We look forward to providing you with an unforgettable experience!</p>
      
      <p>Best regards,<br>The Safarine Team</p>

      <hr>
      <p style="font-size: 12px; color: #666;">
        <strong>Booking Reference:</strong> ${leadData.id}<br>
        This is an automated confirmation. Please do not reply to this email.
      </p>
    `;

    const { error: customerEmailError } = await resend.emails.send({
      from: 'Safarine <noreply@safarine.com>',
      to: [bookingData.email],
      subject: `Booking Request Received - ${bookingData.tourTitle}`,
      html: customerEmailHtml,
    });

    if (customerEmailError) {
      console.error('Customer email error:', customerEmailError);
      throw new Error('Failed to send confirmation email');
    }

    console.log('Booking request processed successfully:', leadData.id);

    return new Response(
      JSON.stringify({
        success: true,
        bookingId: leadData.id,
        message: 'Booking request received successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error processing booking request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process booking request'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);

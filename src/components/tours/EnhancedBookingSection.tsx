import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { BookingRequestModal } from '@/components/booking/BookingRequestModal';

interface EnhancedBookingSectionProps {
  tourTitle: string;
  tourPrice?: number;
  childPrice?: number;
  currency: string;
  bookingMethod?: string;
  destination?: string;
  duration?: { days: number; nights: number };
}

const EnhancedBookingSection = ({
  tourTitle,
  tourPrice,
  childPrice,
  currency,
  bookingMethod = 'form',
  destination,
  duration
}: EnhancedBookingSectionProps) => {
  const { t } = useLocale();
  const { formatPrice } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTourDetails = () => {
    const durationText = duration 
      ? `${duration.days} ${duration.days === 1 ? 'day' : 'days'}${duration.nights > 0 ? `, ${duration.nights} ${duration.nights === 1 ? 'night' : 'nights'}` : ''}`
      : '';
    
    const priceText = tourPrice 
      ? `Adult: ${formatPrice(tourPrice)}${childPrice ? `, Child: ${formatPrice(childPrice)}` : ''}`
      : '';

    return `Tour: ${tourTitle}
${destination ? `Destination: ${destination}` : ''}
${durationText ? `Duration: ${durationText}` : ''}
${priceText ? `Pricing: ${priceText}` : ''}

Please provide your preferred dates and number of participants.`;
  };

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(`Hello! I'm interested in booking the following tour:\n\n${formatTourDetails()}`);
    const whatsappUrl = `https://wa.me/66123456789?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailBooking = () => {
    const subject = encodeURIComponent(`Tour Booking Inquiry: ${tourTitle}`);
    const body = encodeURIComponent(`Hello,\n\nI would like to book the following tour:\n\n${formatTourDetails()}\n\nBest regards`);
    const emailUrl = `mailto:bookings@safarine.com?subject=${subject}&body=${body}`;
    window.open(emailUrl, '_blank');
  };

  const handleFormBooking = () => {
    setIsModalOpen(true);
  };

  const renderBookingButtons = () => {
    switch (bookingMethod) {
      case 'whatsapp':
        return (
          <div className="space-y-3">
            <Button 
              onClick={handleWhatsAppBooking}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('booking.book_whatsapp', 'Book via WhatsApp')}
            </Button>
            <Button 
              onClick={handleEmailBooking}
              variant="outline" 
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('booking.email_inquiry', 'Email Inquiry')}
            </Button>
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-3">
            <Button 
              onClick={handleEmailBooking}
              className="w-full"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('booking.book_email', 'Book via Email')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              {t('booking.call_us', 'Call for Details')}
            </Button>
          </div>
        );
      
      case 'form':
      default:
        return (
          <div className="space-y-3">
            <Button 
              onClick={handleFormBooking}
              className="w-full"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('booking.book_now', 'Book Now')}
            </Button>
            <Button 
              onClick={handleEmailBooking}
              variant="outline" 
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('booking.get_info', 'Get More Information')}
            </Button>
          </div>
        );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {t('booking.ready_to_book', 'Ready to Book?')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              {t('booking.contact_details', 'Contact us to secure your spot on this amazing adventure!')}
            </p>
          </div>
          {renderBookingButtons()}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              {t('booking.response_time', '✅ Quick response within 24 hours')}
            </p>
          </div>
        </CardContent>
      </Card>

      <BookingRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        tourTitle={tourTitle}
        tourPrice={tourPrice}
        childPrice={childPrice}
        currency={currency}
        destination={destination}
        duration={duration}
      />
    </>
  );
};

export default EnhancedBookingSection;
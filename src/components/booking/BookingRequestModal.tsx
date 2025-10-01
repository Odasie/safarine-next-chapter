import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale } from '@/contexts/LocaleContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, Minus, Plus, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().optional(),
  countryCode: z.string().default('+66'),
  bookingDate: z.date({ required_error: 'Please select a booking date' }),
  adults: z.number().min(1, 'At least 1 adult required').max(20),
  children: z.number().min(0).max(20),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourTitle: string;
  tourId?: string;
  tourPrice?: number;
  childPrice?: number;
  currency?: string;
  destination?: string;
  duration?: { days: number; nights: number };
}

export const BookingRequestModal = ({
  open,
  onOpenChange,
  tourTitle,
  tourId,
  tourPrice,
  childPrice,
  currency = 'THB',
  destination,
  duration
}: BookingRequestModalProps) => {
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 1,
      children: 0,
      countryCode: '+66',
      termsAccepted: false
    }
  });

  const bookingDate = watch('bookingDate');
  const termsAccepted = watch('termsAccepted');

  const handleAdultsChange = (delta: number) => {
    const newValue = Math.max(1, Math.min(20, adults + delta));
    setAdults(newValue);
    setValue('adults', newValue);
  };

  const handleChildrenChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(20, children + delta));
    setChildren(newValue);
    setValue('children', newValue);
  };

  const calculateTotalPrice = () => {
    if (!tourPrice) return null;
    const adultsTotal = adults * tourPrice;
    const childrenTotal = children * (childPrice || tourPrice * 0.7);
    return adultsTotal + childrenTotal;
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const totalPrice = calculateTotalPrice();
      
      // Call edge function to send booking request
      const { data: result, error } = await supabase.functions.invoke('send-booking-request', {
        body: {
          tourId,
          tourTitle,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone ? `${data.countryCode}${data.phone}` : null,
          bookingDate: format(data.bookingDate, 'yyyy-MM-dd'),
          adults: data.adults,
          children: data.children,
          totalPrice,
          currency,
          destination,
          duration
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success(t('booking.request_sent', 'Booking request sent successfully!'));
      
      setTimeout(() => {
        onOpenChange(false);
        reset();
        setIsSuccess(false);
        setAdults(1);
        setChildren(0);
      }, 3000);
      
    } catch (error: any) {
      console.error('Booking request error:', error);
      toast.error(t('booking.request_error', 'Failed to send booking request. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-2">
              {t('booking.success_title', 'Booking Request Received!')}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t('booking.success_message', 'We\'ve received your booking request and will contact you within 24 hours to confirm your reservation.')}
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('booking.modal_title', 'Book Your Experience')}
          </DialogTitle>
          <DialogDescription>
            {tourTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Booking Date */}
          <div className="space-y-2">
            <Label htmlFor="bookingDate">
              {t('booking.date_label', 'Preferred Date')} *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !bookingDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingDate ? format(bookingDate, 'PPP') : t('booking.select_date', 'Select a date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bookingDate}
                  onSelect={(date) => date && setValue('bookingDate', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.bookingDate && (
              <p className="text-sm text-destructive">{errors.bookingDate.message}</p>
            )}
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <Label>{t('booking.participants_label', 'Number of Participants')}</Label>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t('booking.adults', 'Adults')}</p>
                <p className="text-sm text-muted-foreground">{t('booking.adults_desc', 'Age 12+')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleAdultsChange(-1)}
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleAdultsChange(1)}
                  disabled={adults >= 20}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{t('booking.children', 'Children')}</p>
                <p className="text-sm text-muted-foreground">{t('booking.children_desc', 'Age 3-11')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleChildrenChange(-1)}
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleChildrenChange(1)}
                  disabled={children >= 20}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t('booking.first_name', 'First Name')} *
              </Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder={t('booking.first_name_placeholder', 'John')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t('booking.last_name', 'Last Name')} *
              </Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder={t('booking.last_name_placeholder', 'Doe')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t('booking.email', 'Email Address')} *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder={t('booking.email_placeholder', 'john.doe@example.com')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('booking.phone', 'Phone Number')} ({t('booking.optional', 'Optional')})
            </Label>
            <div className="flex gap-2">
              <select
                {...register('countryCode')}
                className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="+66">+66</option>
                <option value="+33">+33</option>
                <option value="+44">+44</option>
                <option value="+1">+1</option>
              </select>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="123456789"
                className="flex-1"
              />
            </div>
          </div>

          {/* Price Summary */}
          {tourPrice && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>{adults} × {t('booking.adults', 'Adults')}</span>
                <span>{currency} {(adults * tourPrice).toLocaleString()}</span>
              </div>
              {children > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{children} × {t('booking.children', 'Children')}</span>
                  <span>{currency} {(children * (childPrice || tourPrice * 0.7)).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>{t('booking.estimated_total', 'Estimated Total')}</span>
                <span>{currency} {calculateTotalPrice()?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('booking.terms_text', 'I agree to the terms and conditions and understand that this is a booking request that requires confirmation.')} *
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('booking.submitting', 'Submitting...')}
              </>
            ) : (
              t('booking.submit', 'Request Booking')
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t('booking.confirmation_note', 'We will contact you within 24 hours to confirm your booking and provide payment instructions.')}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

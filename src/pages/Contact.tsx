import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Phone } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/hooks/use-translations";
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message: string;
}
const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          type: data.type,
          message: data.message,
          source: 'contact_page'
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: t('contact.success', 'Thank you! Your message has been sent successfully.')
      });
      reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: t('contact.error', 'Sorry, there was an error sending your message. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="container mx-auto py-10">
      <Helmet>
        <title>{t('meta.contact.title', 'Contact Us | Safarine Tours Thailand')}</title>
        <meta name="description" content={t('meta.contact.description', 'Get in touch with Safarine Tours for custom private tours in Thailand. Contact our team today.')} />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{t('contact.page.title', 'Contact Us')}</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">{t('contact.form.name', 'Full Name')}</label>
          <Input 
            id="name" 
            {...register("name", {
              required: "Name is required"
            })} 
            placeholder="Your full name" 
          />
          {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">{t('contact.form.email', 'Email Address')}</label>
          <Input 
            id="email" 
            type="email" 
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} 
            placeholder="your.email@example.com" 
          />
          {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">{t('contact.form.phone', 'Phone Number')}</label>
          <Input id="phone" {...register("phone")} placeholder="+66 123 456 789" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">{t('contact.form.message_type', 'Message Type')}</label>
          <Select onValueChange={(value) => setValue("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">{t('contact.type.booking', 'Booking Request')}</SelectItem>
              <SelectItem value="custom">{t('contact.type.custom', 'Custom Tour')}</SelectItem>
              <SelectItem value="general">{t('contact.type.general', 'General Inquiry')}</SelectItem>
              <SelectItem value="partnership">{t('contact.type.partnership', 'Partnership')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">{t('contact.form.message', 'Your Message')}</label>
          <Textarea 
            id="message" 
            rows={6} 
            {...register("message", {
              required: "Message is required"
            })} 
            placeholder="Tell us about your trip plans..." 
          />
          {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('contact.form.submitting', 'Sending...') : t('contact.form.submit', 'Send Message')}
          </Button>
        </div>
      </form>

      <aside className="mt-8 text-sm text-muted-foreground space-y-1">
        <p>Safarine Tours – Kanchanaburi & Chiang Mai, Thailand</p>
        <p>Safarine Tours - Licence n° 14/03149</p>
        <p className="flex items-center gap-2">
          <Phone className="h-3 w-3" />
          +66-860491662
        </p>
      </aside>
    </div>;
};
export default Contact;
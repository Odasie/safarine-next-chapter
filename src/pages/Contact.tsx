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
import { useLocale } from "@/contexts/LocaleContext";
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message: string;
}
const Contact = () => {
  const { toast } = useToast();
  const { t } = useLocale();
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
        title: t("contact.form.success.title"),
        description: t("contact.form.success.description")
      });
      reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: t("contact.form.error.title"),
        description: t("contact.form.error.description"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="container mx-auto py-10">
      <Helmet>
        <title>{t("contact.title")} | Safarine Tours</title>
        <meta name="description" content={t("contact.meta.description")} />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{t("contact.title")}</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">{t("contact.form.name")}</label>
          <Input 
            id="name" 
            {...register("name", {
              required: t("contact.form.validation.nameRequired")
            })} 
            placeholder={t("contact.form.placeholders.name")} 
          />
          {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">{t("contact.form.email")}</label>
          <Input 
            id="email" 
            type="email" 
            {...register("email", {
              required: t("contact.form.validation.emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("contact.form.validation.emailInvalid")
              }
            })} 
            placeholder={t("contact.form.placeholders.email")} 
          />
          {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">{t("contact.form.phone")}</label>
          <Input id="phone" {...register("phone")} placeholder={t("contact.form.placeholders.phone")} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">{t("contact.form.messageType")}</label>
          <Select onValueChange={(value) => setValue("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("contact.form.placeholders.messageType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">{t("contact.form.types.booking")}</SelectItem>
              <SelectItem value="custom">{t("contact.form.types.custom")}</SelectItem>
              <SelectItem value="info">{t("contact.form.types.info")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">{t("contact.form.message")}</label>
          <Textarea 
            id="message" 
            rows={6} 
            {...register("message", {
              required: t("contact.form.validation.messageRequired")
            })} 
            placeholder={t("contact.form.placeholders.message")} 
          />
          {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
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
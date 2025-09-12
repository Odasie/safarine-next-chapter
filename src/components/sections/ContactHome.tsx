import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";

interface ContactHomeForm {
  name: string;
  email: string;
  message: string;
}

const ContactHome = () => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactHomeForm>();
  
  const onSubmit = async (data: ContactHomeForm) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          name: data.name,
          email: data.email,
          message: data.message,
          source: 'homepage'
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
  return <section className="bg-accent/10" aria-labelledby="contact-title">
      <div className="container mx-auto grid gap-8 py-12 md:grid-cols-2">
        <div>
          <h2 id="contact-title" className="text-2xl md:text-3xl font-bold">{t("contact.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("contact.home.subtitle")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>117 soi Tha Makham, moo 2, A. Mueang, C. Kanchanaburi 71000, Thailand
Safarine Tours - Licence n° 14/03149</li>
            <li>contact@safarine.com</li>
            <li>+66-860491662</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-card p-6 shadow">
          <div className="grid gap-4">
            <div>
              <Input 
                {...register("name", { 
                  required: t("contact.form.validation.nameRequired") 
                })}
                placeholder={t("contact.form.placeholders.name")}
                aria-label={t("contact.form.name")}
              />
              {errors.name && (
                <span className="text-sm text-destructive">{errors.name.message}</span>
              )}
            </div>
            <div>
              <Input 
                type="email" 
                {...register("email", { 
                  required: t("contact.form.validation.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("contact.form.validation.emailInvalid")
                  }
                })}
                placeholder={t("contact.form.placeholders.email")}
                aria-label={t("contact.form.email")}
              />
              {errors.email && (
                <span className="text-sm text-destructive">{errors.email.message}</span>
              )}
            </div>
            <div>
              <Textarea 
                {...register("message", { 
                  required: t("contact.form.validation.messageRequired") 
                })}
                placeholder={t("contact.form.placeholders.message")}
                aria-label={t("contact.form.message")}
                rows={4} 
              />
              {errors.message && (
                <span className="text-sm text-destructive">{errors.message.message}</span>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>;
};
export default ContactHome;
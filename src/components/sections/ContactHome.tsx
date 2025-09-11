import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactHomeForm {
  name: string;
  email: string;
  message: string;
}

const ContactHome = () => {
  const { toast } = useToast();
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
        title: "Message envoyé avec succès",
        description: "Nous vous répondrons dans les 24-48 heures."
      });
      reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Veuillez réessayer ou nous appeler au +66-860491662.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="bg-accent/10" aria-labelledby="contact-title">
      <div className="container mx-auto grid gap-8 py-12 md:grid-cols-2">
        <div>
          <h2 id="contact-title" className="text-2xl md:text-3xl font-bold">Contactez-nous</h2>
          <p className="mt-2 text-muted-foreground">Specialists in tailor-made and off-the-beaten track travel</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>117 soi Tha Makham, moo 2, A. Mueang, C. Kanchanaburi 71000, Thailand
Safarine Tours - Licence n° 14/03149</li>
            <li>contact@safarine.com</li>
            <li>+66-860491662</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-card p-6 shadow">
          <div className="grid gap-4">
            <Input 
              {...register("name", { required: true })}
              placeholder="Nom" 
              aria-label="Nom" 
            />
            <Input 
              type="email" 
              {...register("email", { required: true })}
              placeholder="Email" 
              aria-label="Email" 
            />
            <Textarea 
              {...register("message", { required: true })}
              placeholder="Message" 
              aria-label="Message" 
              rows={4} 
            />
            <div className="flex justify-end">
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>;
};
export default ContactHome;
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactHomeForm {
  name: string;
  email: string;
  message: string;
}

const ContactHome = () => {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<ContactHomeForm>();
  
  const onSubmit = (data: ContactHomeForm) => {
    console.log("Contact form submitted", data);
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons rapidement."
    });
    reset(); // Clear all form fields after successful submission
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
              <Button type="submit" variant="accent">Envoyer</Button>
            </div>
          </div>
        </form>
      </div>
    </section>;
};
export default ContactHome;
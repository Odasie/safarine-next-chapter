import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactHome = () => {
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons rapidement." });
  };

  return (
    <section className="bg-accent/10" aria-labelledby="contact-title">
      <div className="container mx-auto grid gap-8 py-12 md:grid-cols-2">
        <div>
          <h2 id="contact-title" className="text-2xl md:text-3xl font-bold">Contactez-nous</h2>
          <p className="mt-2 text-muted-foreground">Specialists in tailor-made and off-the-beaten track travel</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>117 soi Tha Makham, moo 2, A. Mueang, C. Kanchanaburi 71000, Thailand</li>
            <li>contact@safarine.com</li>
            <li>+66 000-000-000</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} className="rounded-xl border bg-card p-6 shadow">
          <div className="grid gap-4">
            <Input placeholder="Nom" aria-label="Nom" />
            <Input type="email" placeholder="Email" aria-label="Email" />
            <Textarea placeholder="Message" aria-label="Message" rows={4} />
            <div className="flex justify-end">
              <Button type="submit" variant="accent">Envoyer</Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactHome;

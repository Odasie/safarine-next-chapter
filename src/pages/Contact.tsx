import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  message: string;
}
const Contact = () => {
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit
  } = useForm<ContactForm>();
  const onSubmit = (data: ContactForm) => {
    console.log("Contact form submitted", data);
    toast({
      title: "Message sent",
      description: "We'll get back to you shortly."
    });
  };
  return <div className="container mx-auto py-10">
      <Helmet>
        <title>Contact | Safarine Tours</title>
        <meta name="description" content="Contactez-nous pour vos demandes de circuits privés en Thaïlande." />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Contactez-nous</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input id="name" {...register("name", {
          required: true
        })} placeholder="Your full name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" type="email" {...register("email", {
          required: true
        })} placeholder="you@example.com" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <Input id="phone" {...register("phone")} placeholder="+66 ..." />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Message type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">Booking inquiry</SelectItem>
              <SelectItem value="custom">Custom tour request</SelectItem>
              <SelectItem value="info">General information</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <Textarea id="message" rows={6} {...register("message", {
          required: true
        })} placeholder="Tell us about your plans" />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">Send Message</Button>
        </div>
      </form>

      <aside className="mt-8 text-sm text-muted-foreground">
        <p>Safarine Tours – Kanchanaburi & Chiang Mai, Thailand

Safarine Tours - Licence n° 14/03149
+66-860491662</p>
      </aside>
    </div>;
};
export default Contact;
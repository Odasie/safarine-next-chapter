
import { ResponsiveImage } from "@/components/ui/responsive-image";

const WhySafarine = () => {
  return (
    <section aria-labelledby="why-title">
      <div className="container mx-auto grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="why-title" className="mb-4 text-2xl md:text-3xl font-bold">Pourquoi choisir Safarine ?</h2>
          <ul className="mb-6 space-y-2 text-sm md:text-base">
            <li>• Immersion locale authentique</li>
            <li>• Respect des communautés et de la nature</li>
            <li>• Randonnées hors sentiers battus</li>
            <li>• Accompagnateurs passionnés et francophones</li>
          </ul>
          <p className="text-muted-foreground text-sm md:text-base max-w-prose">
            Depuis 1995, Safarine Tours organise des tours privés, des treks, des balades en kayak en Thaïlande. Nous proposons des expériences sur mesure, loin du tourisme de masse, en harmonie avec la nature et les habitants.
          </p>
        </div>
        <ResponsiveImage 
          src="/images/sections/why-safarine.webp"
          mobileSrc="/images/sections/why-safarine-mobile.webp"
          alt="Train longeant une falaise en Thaïlande" 
          className="h-64 w-full rounded-xl object-cover shadow"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
};

export default WhySafarine;

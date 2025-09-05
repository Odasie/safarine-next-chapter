import SearchBar from "@/components/search/SearchBar";
import { useLocale } from "@/contexts/LocaleContext";
import { useState } from "react";

const Hero = () => {
  const { t } = useLocale();
  const [imageError, setImageError] = useState(false);
  
  return (
    <section className="relative overflow-hidden">
      {/* Responsive Hero Images with fallback */}
      {!imageError ? (
        <picture className="absolute inset-0 -z-20">
          {/* Desktop Image */}
          <source 
            media="(min-width: 768px)" 
            srcSet="/images/heroes/hero-hp.webp" 
            type="image/webp"
          />
          {/* Mobile Image */}
          <img 
            src="/images/heroes/hero-hp-mobile.webp" 
            alt="Safarine Tours - Discover Thailand's hidden gems" 
            className="h-full w-full object-cover" 
            loading="eager" 
            fetchPriority="high"
            onError={() => setImageError(true)}
          />
        </picture>
      ) : (
        // Fallback gradient background if images fail to load
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800" />
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden />

      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          {t('hero.title') || 'Découvrez la Thaïlande Authentique'}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
          {t('hero.subtitle') || 'Trek, culture et immersion loin du tourisme de masse'}
        </p>
        <div className="w-full max-w-3xl rounded-full border border-white/20 bg-white/90 backdrop-blur p-4 shadow-lg">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
export default Hero;



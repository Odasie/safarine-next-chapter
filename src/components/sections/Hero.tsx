import SearchBar from "@/components/search/SearchBar";
import { useLocale } from "@/contexts/LocaleContext";
import { useState } from "react";

const Hero = () => {
  const { t, isLoading } = useLocale();
  const [imageError, setImageError] = useState(false);
  
  if (isLoading) {
    return (
      <section className="relative overflow-hidden min-h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800" />
        <div className="relative z-10 container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-white">
          <div className="h-12 w-96 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-80 bg-white/20 rounded animate-pulse" />
          <div className="w-full max-w-3xl h-16 bg-white/20 rounded-full animate-pulse" />
        </div>
      </section>
    );
  }
  
  return (
    <section className="relative overflow-hidden min-h-[60vh]">
      {/* Responsive Hero Images with correct naming */}
      {!imageError ? (
        <picture className="absolute inset-0 w-full h-full">
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
            className="w-full h-full object-cover" 
            loading="eager" 
            fetchPriority="high"
            onError={() => setImageError(true)}
          />
        </picture>
      ) : (
        // Fallback gradient background if images fail to load
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800" />
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          {t('homepage.hero.title', 'Private Tours Thailand')}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
          {t('homepage.hero.subtitle', 'Trek, culture and immersion away from mass tourism')}
        </p>
        <div className="w-full max-w-3xl rounded-full border border-white/20 bg-white/90 backdrop-blur p-4 shadow-lg">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
export default Hero;

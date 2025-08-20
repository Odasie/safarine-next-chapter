import SearchBar from "@/components/search/SearchBar";
import { useLocale } from "@/contexts/LocaleContext";
import heroImage from "@/assets/hero-thailand-cliffs.jpg";
const Hero = () => {
  const { t } = useLocale();
  
  return (
    <section className="relative overflow-hidden">
      <img src={heroImage} alt="Thailand cliffs and tropical landscape" className="absolute inset-0 -z-20 h-full w-full object-cover" aria-hidden loading="eager" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-foreground/60" aria-hidden />

      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-950">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-slate-800">
          {t('hero.subtitle')}
        </p>
        <div className="w-full max-w-3xl rounded-full border border-primary-foreground/20 bg-card/80 backdrop-blur p-4 shadow-sm">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};
export default Hero;
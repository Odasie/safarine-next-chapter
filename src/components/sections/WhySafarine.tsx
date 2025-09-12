
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { useLocale } from "@/contexts/LocaleContext";

const WhySafarine = () => {
  const { t } = useLocale();
  
  return (
    <section aria-labelledby="why-title">
      <div className="container mx-auto grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="why-title" className="mb-4 text-2xl md:text-3xl font-bold">{t('whySafarine.title')}</h2>
          <ul className="mb-6 space-y-2 text-sm md:text-base">
            <li>• {t('whySafarine.features.authentic')}</li>
            <li>• {t('whySafarine.features.respect')}</li>
            <li>• {t('whySafarine.features.offBeaten')}</li>
            <li>• {t('whySafarine.features.guides')}</li>
          </ul>
          <p className="text-muted-foreground text-sm md:text-base max-w-prose">
            {t('whySafarine.description')}
          </p>
        </div>
        <ResponsiveImage 
          src="/images/about/why-safarine.webp"
          mobileSrc="/images/about/why-safarine-tablet.webp"
          alt={t('whySafarine.image.alt')} 
          className="h-64 w-full rounded-xl object-cover shadow"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  );
};

export default WhySafarine;

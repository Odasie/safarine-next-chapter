import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

const ProCTA = () => {
  const { locale, t } = useLocale();
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <section className="bg-accent text-accent-foreground" aria-labelledby="pro-cta-title">
      <div className="container mx-auto py-10 text-center">
        <h2 id="pro-cta-title" className="mb-4 text-xl md:text-2xl font-semibold">{t('pro.cta.title')}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="accent">
            <Link to={getLocalizedPath("/contact")} aria-label={t('pro.cta.signup')}>{t('pro.cta.signup')}</Link>
          </Button>
          <Button asChild variant="outline" className="text-foreground">
            <Link to={getLocalizedPath("/contact")} aria-label={t('pro.cta.login')}>{t('pro.cta.login')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProCTA;

import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { useLocale } from "@/contexts/LocaleContext";
const SiteFooter = () => {
  const { locale, t } = useLocale();
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return <footer className="bg-accent text-accent-foreground mt-12" role="contentinfo">
      <div className="container mx-auto grid gap-8 py-10 md:grid-cols-4">
        <div>
          <Link to={getLocalizedPath("/")} className="flex items-center gap-3" aria-label={t('aria.homeLink')}>
            <ResponsiveLogo 
              className="h-6 md:h-8" 
              theme="light" 
            />
            <div className="leading-tight">
              
              <span className="block text-xs opacity-90">Private Tours Thailand</span>
            </div>
          </Link>
          <p className="mt-3 text-sm opacity-90">{t('footer.tagline')}</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label={t('aria.facebook')} className="hover:opacity-80"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label={t('aria.instagram')} className="hover:opacity-80"><Instagram className="h-5 w-5" /></a>
            <a href={getLocalizedPath("/contact")} aria-label={t('aria.email')} className="hover:opacity-80"><Mail className="h-5 w-5" /></a>
          </div>
        </div>

        <nav className="grid gap-2 text-sm" aria-label="Footer navigation">
          <Link to={getLocalizedPath("/tours")} className="hover:underline">{t('footer.navigation.tours')}</Link>
          <Link to={getLocalizedPath("/about")} className="hover:underline">{t('footer.navigation.about')}</Link>
          <Link to={getLocalizedPath("/contact")} className="hover:underline">{t('footer.navigation.contact')}</Link>
          <a href="#" className="hover:underline">{t('footer.navigation.proLogin')}</a>
        </nav>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">{t('footer.offices.title')}</h3>
          <p>{t('footer.offices.kanchanaburi')}</p>
          <p>{t('footer.offices.chiangmai')}</p>
        </div>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">{t('footer.legal.title')}</h3>
          <p>© {new Date().getFullYear()} Safarine Tours. {t('footer.legal.copyright')}.</p>
        </div>
      </div>
    </footer>;
};
export default SiteFooter;
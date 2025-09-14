import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslations } from "@/hooks/use-translations";
const SiteFooter = () => {
  const { locale } = useLocale();
  const { t } = useTranslations();
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return <footer className="bg-accent text-accent-foreground mt-12" role="contentinfo">
      <div className="container mx-auto grid gap-8 py-10 md:grid-cols-4">
        <div>
          <Link to={getLocalizedPath("/")} className="flex items-center gap-3" aria-label="Safarine Tours">
            <ResponsiveLogo 
              className="h-6 md:h-8" 
              theme="light" 
            />
            <div className="leading-tight">
              
              <span className="block text-xs opacity-90">Private Tours Thailand</span>
            </div>
          </Link>
          <p className="mt-3 text-sm opacity-90">{t('footer.tagline', 'Private tours in Thailand')}</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="hover:opacity-80"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80"><Instagram className="h-5 w-5" /></a>
            <a href={getLocalizedPath("/contact")} aria-label="Email" className="hover:opacity-80"><Mail className="h-5 w-5" /></a>
          </div>
        </div>

        <nav className="grid gap-2 text-sm" aria-label="Footer navigation">
          <Link to={getLocalizedPath("/tours")} className="hover:underline">{t('navigation.tours', 'Tours')}</Link>
          <Link to={getLocalizedPath("/about")} className="hover:underline">{t('navigation.about', 'About')}</Link>
          <Link to={getLocalizedPath("/contact")} className="hover:underline">{t('navigation.contact', 'Contact')}</Link>
          <a href="#" className="hover:underline">{t('footer.pro_login', 'Pro Login')}</a>
        </nav>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">Offices</h3>
          <p>{t('footer.office.kanchanaburi', 'Kanchanaburi Office')}</p>
          <p>{t('footer.office.chiang_mai', 'Chiang Mai Office')}</p>
        </div>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">Legal</h3>
          <p>{t('footer.copyright', '© {year} Safarine Tours. All rights reserved.', { year: new Date().getFullYear().toString() })}</p>
        </div>
      </div>
    </footer>;
};
export default SiteFooter;
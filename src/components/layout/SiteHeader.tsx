import { Link, NavLink } from "react-router-dom";
import { Search, User, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@clerk/clerk-react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "text-primary-foreground" : "text-primary-foreground/90 hover:text-primary-foreground"
  }`;

const SiteHeader = () => {
  const { locale, t, isLoading } = useLocale();
  const { isSignedIn } = useAuth();
  
  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="h-8 md:h-10 w-32 bg-primary-foreground/20 rounded animate-pulse" />
          <div className="hidden md:flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-16 bg-primary-foreground/20 rounded animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 bg-primary-foreground/20 rounded animate-pulse" />
            <div className="h-8 w-8 bg-primary-foreground/20 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  const getProPath = () => {
    return isSignedIn ? getLocalizedPath("/pro") : getLocalizedPath("/pro/login");
  };

  return (
    <header data-fallback="1" className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to={getLocalizedPath("/")} className="flex items-center gap-3" aria-label="Safarine Tours">
          <ResponsiveLogo 
            className="h-8 md:h-10" 
            theme="light" 
          />
          <span className="sr-only">Safarine Tours</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2" aria-label={t('aria.main_navigation', 'Main navigation')}>
          <NavLink to={getLocalizedPath("/tours")} className={navLinkClass}>{t('navigation.tours', 'Tours')}</NavLink>
          <NavLink to={getLocalizedPath("/about")} className={navLinkClass}>{t('navigation.about', 'About')}</NavLink>
          <Link to={getProPath()} className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-primary-foreground/90 hover:text-primary-foreground">{t('navigation.pro', 'Pro')}</Link>
          <NavLink to={getLocalizedPath("/contact")} className={navLinkClass}>{t('navigation.contact', 'Contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-transparent px-3 py-2 text-sm hover:bg-primary-foreground/10 transition-colors" aria-label={t('aria.search_button', 'Search tours')}>
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{t('navigation.search', 'Search')}</span>
        </button>
          
          <LanguageSwitcher />
          <CurrencySwitcher />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

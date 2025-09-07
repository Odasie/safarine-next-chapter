import { Link, NavLink } from "react-router-dom";
import { Search, User, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { ResponsiveLogo } from "@/components/ui/ResponsiveLogo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocale } from "@/contexts/LocaleContext";
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "text-primary-foreground" : "text-primary-foreground/90 hover:text-primary-foreground"
  }`;

const SiteHeader = () => {
  const { locale, t } = useLocale();
  const { user, signOut, loading } = useUnifiedAuth();
  
  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header data-fallback="1" className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to={getLocalizedPath("/")} className="flex items-center gap-3" aria-label="Safarine Tours home">
          <ResponsiveLogo 
            className="h-8 md:h-10" 
            theme="light" 
          />
          <span className="sr-only">SAFARINE • Private Tours Thailand</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
          <NavLink to={getLocalizedPath("/tours")} className={navLinkClass}>{t('menu.tours')}</NavLink>
          <NavLink to={getLocalizedPath("/about")} className={navLinkClass}>{t('menu.about')}</NavLink>
          <NavLink to={getLocalizedPath("/pro")} className={navLinkClass}>{t('menu.pro')}</NavLink>
          <NavLink to={getLocalizedPath("/contact")} className={navLinkClass}>{t('menu.contact')}</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-transparent px-3 py-2 text-sm hover:bg-primary-foreground/10 transition-colors" aria-label="Recherche">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">{t('search.cta')}</span>
          </button>
          
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">{t('menu.account')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={getLocalizedPath("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      {t('profile.title')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Link to={getLocalizedPath("/auth")}>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">{t('auth.login.title')}</span>
                </Link>
              </Button>
            )
          )}
          
          <LanguageSwitcher />
          <CurrencySwitcher />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

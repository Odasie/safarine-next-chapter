import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
    isActive ? "text-primary" : "text-foreground"
  }`;

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Safarine Tours home">
          <img
            src="/lovable-uploads/2d6b3de1-d290-4fbf-a4b8-20ae81812df2.png"
            alt="Safarine Tours — Private Tours Thailand logo"
            className="h-8 w-auto invert md:h-10"
            width="162"
            height="52"
          />
          <span className="sr-only">SAFARINE • Private Tours Thailand</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
          <NavLink to="/tours" className={navLinkClass}>Nos circuits/Activités</NavLink>
          <NavLink to="/about" className={navLinkClass}>À propos</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Connexion Pro</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Search">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button className="rounded-md px-3 py-2 text-sm border border-input hover:bg-muted transition-colors" aria-label="Toggle language">
            FR/EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

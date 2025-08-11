import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-accent text-accent-foreground mt-12" role="contentinfo">
      <div className="container mx-auto grid gap-8 py-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2" aria-label="Safarine Tours home">
            <div className="h-8 w-8 rounded-full bg-primary" aria-hidden />
            <div className="leading-tight">
              <span className="block font-semibold tracking-wide">SAFARINE</span>
              <span className="block text-xs opacity-90">Private Tours Thailand</span>
            </div>
          </Link>
          <p className="mt-3 text-sm opacity-90">Authentic Thai experiences for 30 years.</p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="hover:opacity-80"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80"><Instagram className="h-5 w-5" /></a>
            <a href="/contact" aria-label="Email" className="hover:opacity-80"><Mail className="h-5 w-5" /></a>
          </div>
        </div>

        <nav className="grid gap-2 text-sm" aria-label="Footer navigation">
          <Link to="/tours" className="hover:underline">Nos circuits/Activités</Link>
          <Link to="/about" className="hover:underline">À propos</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <a href="#" className="hover:underline">Connexion Pro</a>
        </nav>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">Agences</h3>
          <p>Kanchanaburi, Thailand</p>
          <p>Chiang Mai, Thailand</p>
        </div>

        <div className="text-sm">
          <h3 className="mb-2 font-semibold">Infos légales</h3>
          <p>© {new Date().getFullYear()} Safarine Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

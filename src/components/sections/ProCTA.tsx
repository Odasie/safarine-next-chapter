import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProCTA = () => {
  return (
    <section className="bg-accent text-accent-foreground" aria-labelledby="pro-cta-title">
      <div className="container mx-auto py-10 text-center">
        <h2 id="pro-cta-title" className="mb-4 text-xl md:text-2xl font-semibold">Professionnels ? Connectez-vous !</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="accent">
            <Link to="/contact" aria-label="Inscription Pro">Inscription Pro</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact" aria-label="Connexion Pro">Connexion Pro</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProCTA;

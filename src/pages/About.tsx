import { Helmet } from "react-helmet-async";
import { useLocale } from "@/contexts/LocaleContext";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Shield, Heart, Globe, Star, Phone } from "lucide-react";
const About = () => {
  const {
    t,
    locale
  } = useLocale();
  const canonicalUrl = `${window.location.origin}/${locale}/about`;
  return <div>
      <Helmet>
        <title>{t('about.meta.title')}</title>
        <meta name="description" content={t('about.meta.description')} />
        <meta name="keywords" content="Thailand tours, authentic travel, Kanchanaburi, private tours, sustainable tourism, local guides" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={t('about.meta.title')} />
        <meta property="og:description" content={t('about.meta.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <ResponsiveImage src="/images/about/company-story-hero.webp" mobileSrc="/images/about/company-story-hero-mobile.webp" alt="Safarine Tours Thailand company story" className="absolute inset-0 -z-20 h-full w-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-foreground/60" />
        
        <div className="container mx-auto py-24 text-center text-primary-foreground">
          <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary-foreground">
            {locale === 'fr' ? 'Depuis 1995' : 'Since 1995'}
          </Badge>
          <h1 className="mb-4 text-4xl md:text-6xl font-bold text-slate-950">
            {t('about.hero.title')}
          </h1>
          <p className="mb-6 text-xl md:text-2xl max-w-3xl mx-auto text-lime-800">
            {t('about.hero.subtitle')}
          </p>
          <p className="text-lg max-w-2xl mx-auto text-slate-950">
            {t('about.hero.description')}
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-3xl md:text-4xl font-bold text-foreground">
                {t('about.story.title')}
              </h2>
              <h3 className="mb-4 text-xl font-semibold text-primary">
                {t('about.story.subtitle')}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.story.content')}
              </p>
              <div className="mt-6">
                <Button asChild className="mr-4">
                  <Link to={`/${locale}/contact`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {t('about.cta.contact')}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/${locale}/tours`}>
                    {t('about.cta.plan')}
                  </Link>
                </Button>
              </div>
            </div>
            <ResponsiveImage src="/images/about/why-safarine.webp" mobileSrc="/images/about/why-safarine-tablet.webp" alt="Safarine Tours authentic Thailand experience" className="h-96 w-full rounded-xl object-cover shadow-lg" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
              {t('about.pillar.headline')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.pillar.subheadline')}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">
                  {t('about.pillar.authenticity.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('about.pillar.authenticity.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">
                  {t('about.pillar.sustainability.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('about.pillar.sustainability.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">
                  {t('about.pillar.personalization.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('about.pillar.personalization.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
              {t('about.team.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Team member cards would go here - for now showing placeholder structure */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-foreground">David Barthez</CardTitle>
                <p className="text-primary font-medium">{locale === 'fr' ? 'Fondateur & Directeur' : 'Founder & Director'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {locale === 'fr' ? 'En Thaïlande depuis le début des années 2000, David est le leader passionné de Safarine Tours.' : 'In Thailand since the early 2000s, David is the passionate leader of Safarine Tours.'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-foreground">Earth</CardTitle>
                <p className="text-primary font-medium">{locale === 'fr' ? 'Guide Experte Locale' : 'Expert Local Guide'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {locale === 'fr' ? 'Guide locale expérimentée avec une connaissance approfondie de la culture thaïlandaise.' : 'Experienced local guide with deep knowledge of Thai culture.'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-foreground">Note</CardTitle>
                <p className="text-primary font-medium">{locale === 'fr' ? 'Coordinatrice Voyages' : 'Travel Coordinator'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {locale === 'fr' ? 'Spécialiste en organisation de voyages personnalisés et expériences authentiques.' : 'Specialist in organizing personalized trips and authentic experiences.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
              {t('about.features.title')}
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('about.features.network.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('about.features.network.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('about.features.safety.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('about.features.safety.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('about.features.authentic.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('about.features.authentic.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {t('about.features.francophone.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('about.features.francophone.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            {locale === 'fr' ? 'Prêt pour Votre Aventure Thaïlandaise ?' : 'Ready for Your Thai Adventure?'}
          </h2>
          <p className="mb-8 text-muted-foreground text-lg max-w-2xl mx-auto">
            {locale === 'fr' ? 'Contactez notre équipe dexperts pour planifier votre voyage personnalisé en Thaïlande.' : 'Contact our expert team to plan your personalized trip to Thailand.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="tel:+66860491662">
                <Phone className="mr-2 h-4 w-4" />
                {t('about.cta.contact')}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={`/${locale}/tours`}>
                {t('about.cta.plan')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default About;
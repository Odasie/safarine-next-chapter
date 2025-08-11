import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>À propos | Safarine Tours</title>
        <meta name="description" content="SAFARINE AU CŒUR DE LA THAÏLANDE DEPUIS 30 ANS! Découvrez notre histoire, notre mission et nos engagements." />
        <link rel="canonical" href={`${window.location.origin}/about`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Qui sommes-nous ?</h1>
      </header>

      <section className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>SAFARINE AU CŒUR DE LA THAÏLANDE DEPUIS 30 ANS!</h2>
        <p>
          Company story and mission coming soon. We craft sustainable, personalized experiences that respect local communities and nature.
        </p>
        <h3>ÉCO RESPONSABILITÉ</h3>
        <p>Our environmental commitments ensure low-impact, authentic travel.</p>
        <h3>ASSURANCE</h3>
        <p>We prioritize safety with comprehensive coverage and experienced guides.</p>
        <h3>CONDITIONS DE VENTE & POLITIQUE DE CONFIDENTIALITÉ</h3>
        <p>Legal information will be published here.</p>
      </section>
    </div>
  );
};

export default About;

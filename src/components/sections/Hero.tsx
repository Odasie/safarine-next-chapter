import SearchBar from "@/components/search/SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <img
        src="/placeholder.svg"
        alt="Vue aérienne de la rivière Kwai en Thaïlande"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        aria-hidden
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-foreground/60" aria-hidden />

      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-5xl font-bold">
          VIVEZ L'AVENTURE THAÏLANDAISE DEPUIS 30 ANS
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl">
          Trek, culture et immersion loin du tourisme de masse.
        </p>
        <div className="w-full max-w-3xl rounded-full border border-primary-foreground/20 bg-card/80 backdrop-blur p-4 shadow-sm">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;

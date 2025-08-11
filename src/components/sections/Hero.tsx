import SearchBar from "@/components/search/SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,theme(colors.primary.DEFAULT)/20%,transparent_60%)]" aria-hidden />
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          VIVEZ L'AVENTURE THAÏLANDAISE DEPUIS 30 ANS
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          EXPERIENCE THAI ADVENTURE FOR 30 YEARS
        </p>
        <div className="w-full max-w-3xl rounded-lg border bg-card p-4 shadow-sm">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;

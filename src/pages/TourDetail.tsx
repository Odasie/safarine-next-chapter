import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/contexts/LocaleContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import SearchBar from '@/components/search/SearchBar';
import EnhancedSearchSection from '@/components/search/EnhancedSearchSection';
import TourSuggestionsSection from '@/components/tours/TourSuggestionsSection';
import EnhancedBookingSection from '@/components/tours/EnhancedBookingSection';
import TourCard from '@/components/tours/TourCard';
import { ImageGallery } from '@/components/tours/ImageGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  X, 
  Users, 
  Globe, 
  TrendingUp, 
  Star, 
  Calendar, 
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';
import { tours } from '@/data/tours';
import { useMemo } from 'react';

const TourDetail = () => {
  const { slug } = useParams();
  const { locale, t } = useLocale();
  const { currency, formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  // Get comprehensive tour data with ALL fields
  const { data: tourData, isLoading, error } = useQuery({
    queryKey: ['tour', slug, locale],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      // Strategy 1: Try to find by slug in the current locale
      const slugField = locale === 'fr' ? 'slug_fr' : 'slug_en';
      let { data: tourBySlug, error: slugError } = await supabase
        .from('tours')
        .select(`
          *,
          description_en,
          description_fr,
          highlights,
          itinerary,
          included_items,
          excluded_items,
          group_size_min,
          group_size_max,
          difficulty_level,
          languages,
          booking_method,
          is_private,
          price,
          child_price,
          b2b_price,
          currency,
          duration_days,
          duration_nights
        `)
        .eq(slugField, slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (tourBySlug) return tourBySlug;
      
      // Strategy 2: Try to find by the other locale's slug
      const otherSlugField = locale === 'fr' ? 'slug_en' : 'slug_fr';
      let { data: tourByOtherSlug, error: otherSlugError } = await supabase
        .from('tours')
        .select(`
          *,
          description_en,
          description_fr,
          highlights,
          itinerary,
          included_items,
          excluded_items,
          group_size_min,
          group_size_max,
          difficulty_level,
          languages,
          booking_method,
          is_private,
          price,
          child_price,
          b2b_price,
          currency,
          duration_days,
          duration_nights
        `)
        .eq(otherSlugField, slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (tourByOtherSlug) return tourByOtherSlug;
      
      // Strategy 3: Try to find by title (partial match)
      const titleField = locale === 'fr' ? 'title_fr' : 'title_en';
      let { data: tourByTitle, error: titleError } = await supabase
        .from('tours')
        .select(`
          *,
          description_en,
          description_fr,
          highlights,
          itinerary,
          included_items,
          excluded_items,
          group_size_min,
          group_size_max,
          difficulty_level,
          languages,
          booking_method,
          is_private,
          price,
          child_price,
          b2b_price,
          currency,
          duration_days,
          duration_nights
        `)
        .ilike(titleField, `%${slug.replace('-', ' ')}%`)
        .eq('status', 'published')
        .limit(1)
        .maybeSingle();
      
      if (tourByTitle) return tourByTitle;
      
      // If all strategies fail, throw an error
      throw new Error('Tour not found');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process comprehensive tour data
  const displayTitle = useMemo(() => {
    if (tourData) {
      return locale === 'fr' ? tourData.title_fr || tourData.title_en : tourData.title_en || tourData.title_fr;
    }
    return "Tour Not Found";
  }, [tourData, locale]);

  const description = useMemo(() => {
    if (tourData) {
      return locale === 'fr' ? tourData.description_fr || tourData.description_en : tourData.description_en || tourData.description_fr;
    }
    return null;
  }, [tourData, locale]);

  const metaDescription = useMemo(() => {
    if (description) {
      return description.substring(0, 160) + '...';
    }
    
    if (tourData) {
      const title = displayTitle;
      const destination = tourData.destination || 'Thailand';
      const duration = tourData.duration_days ? `${tourData.duration_days} days` : '';
      return `${title} in ${destination}. ${duration} adventure tour.`;
    }
    
    return "Discover amazing tours in Thailand with Safarine";
  }, [tourData, description, displayTitle]);

  const duration = useMemo(() => {
    if (tourData) {
      return {
        days: tourData.duration_days || 1,
        nights: tourData.duration_nights || 0
      };
    }
    return { days: 1, nights: 0 };
  }, [tourData]);

  const pricing = useMemo(() => {
    if (tourData) {
      return {
        adult: tourData.price,
        child: tourData.child_price,
        // NEVER include B2B pricing on public pages
        currency: tourData.currency || 'THB'
      };
    }
    return { adult: null, child: null, currency: 'THB' };
  }, [tourData]);

  const difficultyConfig = useMemo(() => {
    const level = tourData?.difficulty_level || 'moderate';
    const configs = {
      easy: { color: 'bg-green-100 text-green-800', label: t('Easy') || 'Easy' },
      moderate: { color: 'bg-yellow-100 text-yellow-800', label: t('Moderate') || 'Moderate' },
      challenging: { color: 'bg-red-100 text-red-800', label: t('Challenging') || 'Challenging' }
    };
    return configs[level as keyof typeof configs] || configs.moderate;
  }, [tourData?.difficulty_level, t]);

  const groupSize = useMemo(() => {
    if (tourData) {
      const min = tourData.group_size_min || 2;
      const max = tourData.group_size_max || 8;
      return `${min}-${max}`;
    }
    return '2-8';
  }, [tourData]);

  const languages = useMemo(() => {
    if (tourData?.languages && Array.isArray(tourData.languages)) {
      return tourData.languages.map(lang => {
        if (lang === 'en') return 'English';
        if (lang === 'fr') return 'Français';
        return lang;
      }).join(', ');
    }
    return 'English, Français';
  }, [tourData?.languages]);

  // Image records for the gallery
  const imageRecords = useMemo(() => {
    if (tourData && tourData.hero_image_url) {
      const records = [];
      
      // Add hero image
      if (tourData.hero_image_url) {
        records.push({
          id: `hero-${tourData.id}`,
          url: tourData.hero_image_url,
          alt: displayTitle,
          title: displayTitle,
          type: 'hero'
        });
      }
      
      // Add gallery images if available
      if (tourData.gallery_images_urls && Array.isArray(tourData.gallery_images_urls)) {
        tourData.gallery_images_urls.forEach((url: string, index: number) => {
          records.push({
            id: `gallery-${tourData.id}-${index}`,
            url: url,
            alt: `${displayTitle} - Image ${index + 1}`,
            title: displayTitle,
            type: 'gallery'
          });
        });
      }
      
      return records;
    }
    
    return [];
  }, [tourData, displayTitle]);

  // Tour highlights and inclusions
  const highlights = useMemo(() => {
    if (tourData?.highlights && Array.isArray(tourData.highlights)) {
      return tourData.highlights as string[];
    }
    return [];
  }, [tourData?.highlights]);

  const includedItems = useMemo(() => {
    const items = tourData?.included_items;
    return Array.isArray(items) ? items as string[] : [];
  }, [tourData?.included_items]);

  const excludedItems = useMemo(() => {
    const items = tourData?.excluded_items;
    return Array.isArray(items) ? items as string[] : [];
  }, [tourData?.excluded_items]);

  const itinerary = useMemo(() => {
    const itin = tourData?.itinerary;
    if (Array.isArray(itin)) {
      return itin as string[];
    }
    if (typeof itin === 'string') {
      return itin;
    }
    return null;
  }, [tourData?.itinerary]);

  const nothingFound = !isLoading && !tourData;

  // Loading state with enhanced skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SearchBar />
        <div className="space-y-0">
          {/* Hero skeleton */}
          <div className="relative h-96 bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 space-y-4">
              <Skeleton className="h-8 w-64 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-white/20" />
                <Skeleton className="h-6 w-20 bg-white/20" />
              </div>
            </div>
          </div>
          {/* Quick info skeleton */}
          <div className="bg-card border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
          {/* Content skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (nothingFound) {
    return (
      <div className="min-h-screen bg-background">
        <SearchBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => navigate(`/${locale}/tours`)}
            variant="default"
          >
            Browse All Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{displayTitle} - Safarine</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${displayTitle} - Safarine`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={imageRecords[0]?.url || '/placeholder.svg'} />
      </Helmet>

      <SearchBar />

      <div className="space-y-0">
        {/* Hero Section with Background Image */}
        <div className="relative h-96 overflow-hidden">
          {imageRecords[0]?.url && (
            <img 
              src={imageRecords[0].url}
              alt={imageRecords[0].alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-3xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {displayTitle}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{tourData?.destination || 'Thailand'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">
                      {duration.days} {duration.days === 1 ? 'day' : 'days'}
                      {duration.nights > 0 && `, ${duration.nights} ${duration.nights === 1 ? 'night' : 'nights'}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className={difficultyConfig.color}>
                    {difficultyConfig.label}
                  </Badge>
                  {tourData?.is_private && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Private Tour
                    </Badge>
                  )}
                  {tourData?.languages && tourData.languages.map((lang: string) => (
                    <Badge key={lang} variant="outline" className="border-white/30 text-white">
                      {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{duration.days} days, {duration.nights} nights</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{groupSize} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{languages}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{difficultyConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {description && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">About This Tour</h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {description}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Tour Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Itinerary */}
              {itinerary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.isArray(itinerary) ? itinerary.map((day, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold text-foreground">Day {index + 1}</h4>
                          <p className="text-muted-foreground">{String(day)}</p>
                        </div>
                      )) : typeof itinerary === 'string' ? (
                        <p className="text-muted-foreground">{itinerary}</p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Gallery - Always show if tour exists */}
              {tourData?.id && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">Gallery</h2>
                  <ImageGallery tourId={tourData.id} />
                </div>
              )}
            </div>

            {/* Right Column - Booking & Pricing */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pricing.adult && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Adult</span>
                        <span className="text-2xl font-bold text-primary">
                          {pricing.currency} {Number(pricing.adult).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Per person</p>
                    </div>
                  )}
                  
                  {pricing.child && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Child (under 12)</span>
                        <span className="text-xl font-semibold text-foreground">
                          {pricing.currency} {Number(pricing.child).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Per child</p>
                    </div>
                  )}
                   
                   {/* Group Rate Message - NEVER show B2B pricing */}
                   <div className="bg-muted rounded-lg p-3">
                     <p className="text-sm text-muted-foreground text-center">
                       🎉 Contact us for group rates and special discounts
                     </p>
                   </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              {includedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {includedItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{String(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* What's Not Included */}
              {excludedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-600" />
                      What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {excludedItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{String(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Booking Section */}
              <EnhancedBookingSection
                tourTitle={displayTitle}
                tourPrice={pricing.adult || undefined}
                childPrice={pricing.child || undefined}
                currency={pricing.currency}
                bookingMethod={tourData?.booking_method}
                destination={tourData?.destination}
                duration={duration}
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced Search Section */}
        <div className="container mx-auto px-4">
          <EnhancedSearchSection />
        </div>
        
        {/* Tour Suggestions Section */}
        <div className="container mx-auto px-4">
          <TourSuggestionsSection 
            currentTourId={tourData?.id}
            currentDestination={tourData?.destination}
          />
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
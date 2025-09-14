import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";

interface Translation {
  key_name: string;
  value: string;
  locale: string;
  category: string;
}

export const useTranslations = (category?: string) => {
  const { locale } = useLocale();

  const { data: translations = [], isLoading } = useQuery({
    queryKey: ['translations', locale, category],
    queryFn: async () => {
      let query = supabase
        .from('translations')
        .select('key_name, value, locale, category')
        .eq('locale', locale)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Translation[];
    },
  });

  // Create a lookup object for faster access
  const translationMap = translations.reduce((acc, translation) => {
    acc[translation.key_name] = translation.value;
    return acc;
  }, {} as Record<string, string>);

  const t = (key: string, fallback?: string, params?: Record<string, string | number>) => {
    let value = translationMap[key] || fallback || key;
    
    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }
    
    return value;
  };

  return {
    t,
    isLoading,
    locale
  };
};

// Hook specifically for admin translations
export const useAdminTranslations = () => {
  return useTranslations('admin');
};

// Hook specifically for validation translations  
export const useValidationTranslations = () => {
  return useTranslations('validation');
};
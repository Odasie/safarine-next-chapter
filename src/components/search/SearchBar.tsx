import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";

const SearchBar = () => {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${locale}/tours`);
  };
  
  return (
    <div className="w-full max-w-md">
      <form onSubmit={onSubmit}>
        <Button type="submit" className="w-full">
          {t('search.explore_tours', 'Explore Tours')}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";

const SearchBar = () => {
  const navigate = useNavigate();
  const { locale, t } = useLocale();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${locale}/tours`);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Select>
        <SelectTrigger className="bg-background text-foreground placeholder:text-muted-foreground">
          <SelectValue placeholder={t('search.destination')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kanchanaburi">{t('search.destinations.kanchanaburi')}</SelectItem>
          <SelectItem value="chiangmai">{t('search.destinations.chiangmai')}</SelectItem>
          <SelectItem value="isaan">{t('search.destinations.isaan')}</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background text-foreground placeholder:text-muted-foreground">
          <SelectValue placeholder={t('search.activity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="escooter">{t('search.activities.escooter')}</SelectItem>
          <SelectItem value="river">{t('search.activities.river')}</SelectItem>
          <SelectItem value="kayak">{t('search.activities.kayak')}</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background text-foreground placeholder:text-muted-foreground">
          <SelectValue placeholder={t('search.duration')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="halfday">{t('search.durations.halfday')} {t('labels.days')}</SelectItem>
          <SelectItem value="1d">{t('search.durations.oneday')} {t('labels.days')}</SelectItem>
          <SelectItem value="2d">{t('search.durations.multiday')} {t('labels.days')}</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full" variant="accent">{t('search.cta')}</Button>
    </form>
  );
};

export default SearchBar;

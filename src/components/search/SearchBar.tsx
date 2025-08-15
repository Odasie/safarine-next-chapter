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
          <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
          <SelectItem value="chiangmai">Chiang Mai</SelectItem>
          <SelectItem value="isaan">Northeast Thailand</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background text-foreground placeholder:text-muted-foreground">
          <SelectValue placeholder={t('search.activity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="escooter">E-scooter</SelectItem>
          <SelectItem value="river">River</SelectItem>
          <SelectItem value="kayak">Kayak</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background text-foreground placeholder:text-muted-foreground">
          <SelectValue placeholder={t('search.duration')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="halfday">1/2 {t('labels.days')}</SelectItem>
          <SelectItem value="1d">1 {t('labels.days')}</SelectItem>
          <SelectItem value="2d">2+ {t('labels.days')}</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full" variant="accent">{t('search.cta')}</Button>
    </form>
  );
};

export default SearchBar;

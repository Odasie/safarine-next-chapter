import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";
const SearchBar = () => {
  const navigate = useNavigate();
  const {
    locale,
    t
  } = useLocale();
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${locale}/tours`);
  };
  return;
};
export default SearchBar;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchBar = () => {
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/tours");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Select>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
          <SelectItem value="chiangmai">Chiang Mai</SelectItem>
          <SelectItem value="isaan">Northeast Thailand</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Activités" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="escooter">E-scooter</SelectItem>
          <SelectItem value="river">River</SelectItem>
          <SelectItem value="kayak">Kayak</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Durée" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="halfday">1/2 journée</SelectItem>
          <SelectItem value="1d">1 jour</SelectItem>
          <SelectItem value="2d">2+ jours</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full">Recherche</Button>
    </form>
  );
};

export default SearchBar;

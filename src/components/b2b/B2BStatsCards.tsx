import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Calendar, Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface B2BStatsCardsProps {
  totalTours: number;
  newThisMonth: number;
  averageDuration: string;
  commissionRate: number;
  isLoading?: boolean;
}

export const B2BStatsCards: React.FC<B2BStatsCardsProps> = ({
  totalTours,
  newThisMonth,
  averageDuration,
  commissionRate,
  isLoading = false
}) => {
  const { t } = useLocale();

  const stats = [
    {
      title: t('b2b.dashboard.stats.totalTours'),
      value: isLoading ? "..." : totalTours.toString(),
      icon: MapPin,
      description: t('b2b.dashboard.stats.toursDescription'),
      color: "text-primary"
    },
    {
      title: t('b2b.dashboard.stats.newThisMonth'),
      value: isLoading ? "..." : newThisMonth.toString(),
      icon: TrendingUp,
      description: t('b2b.dashboard.stats.newDescription'),
      color: "text-accent"
    },
    {
      title: t('b2b.dashboard.stats.averageDuration'),
      value: isLoading ? "..." : `${averageDuration}`,
      icon: Calendar,
      description: t('b2b.dashboard.stats.durationDescription'),
      color: "text-secondary"
    },
    {
      title: t('b2b.dashboard.stats.commission'),
      value: isLoading ? "..." : `${commissionRate}%`,
      icon: Users,
      description: t('b2b.dashboard.stats.commissionDescription'),
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
            <CardTitle className="text-xs font-medium truncate">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-3 w-3 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-lg md:text-xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground hidden md:block truncate">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
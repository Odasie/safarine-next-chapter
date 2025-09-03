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
  const { t, loading: translationsLoading } = useLocale();

  // Show loading if either data is loading or translations are loading
  const shouldShowLoading = isLoading || translationsLoading;

  const stats = [
    {
      title: t('b2b.dashboard.stats.totalTours'),
      value: shouldShowLoading ? "..." : totalTours.toString(),
      icon: MapPin,
      description: t('b2b.dashboard.stats.toursDescription'),
      color: "text-primary"
    },
    {
      title: t('b2b.dashboard.stats.newThisMonth'),
      value: shouldShowLoading ? "..." : newThisMonth.toString(),
      icon: TrendingUp,
      description: t('b2b.dashboard.stats.newDescription'),
      color: "text-accent"
    },
    {
      title: t('b2b.dashboard.stats.averageDuration'),
      value: shouldShowLoading ? "..." : `${averageDuration}`,
      icon: Calendar,
      description: t('b2b.dashboard.stats.durationDescription'),
      color: "text-secondary"
    },
    {
      title: t('b2b.dashboard.stats.commission'),
      value: shouldShowLoading ? "..." : `${commissionRate}%`,
      icon: Users,
      description: t('b2b.dashboard.stats.commissionDescription'),
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground hidden md:block">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
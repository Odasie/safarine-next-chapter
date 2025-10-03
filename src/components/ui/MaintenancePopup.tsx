import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ResponsiveLogo } from '@/components/ui/ResponsiveLogo';
import { Mail } from 'lucide-react';

export const MaintenancePopup = () => {
  const { config, isLoading } = useMaintenanceMode();
  const { locale } = useLocale();

  // Don't render anything while loading
  if (isLoading) return null;

  // Select message based on current locale
  const message = locale === 'fr' ? config.message_fr : config.message_en;

  return (
    <Dialog open={config.enabled}>
      <DialogContent 
        className="max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          {config.show_logo && (
            <div className="flex justify-center mb-2">
              <ResponsiveLogo theme="dark" className="w-32" />
            </div>
          )}
          <DialogTitle className="text-center text-2xl">
            Website Under Maintenance
          </DialogTitle>
          <DialogDescription className="text-center text-base" aria-describedby="maintenance-message">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        {config.contact_email && (
          <div className="mt-6">
            <a
              href={`mailto:${config.contact_email}`}
              className="flex items-center justify-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
              aria-label={`Contact us at ${config.contact_email}`}
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">{config.contact_email}</span>
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

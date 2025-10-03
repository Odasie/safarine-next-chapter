import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'safarine_maintenance_dismissed';

export const MaintenancePopup = () => {
  const { config, isLoading } = useMaintenanceMode();
  const { locale } = useLocale();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      try {
        const data = JSON.parse(dismissed);
        setIsDismissed(data.dismissed === true);
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Clear dismissal when maintenance disabled
  useEffect(() => {
    if (!config.enabled) {
      localStorage.removeItem(STORAGE_KEY);
      setIsDismissed(false);
    }
  }, [config.enabled]);

  // Handle user dismissal
  const handleDismiss = (open: boolean) => {
    if (!open) {
      setIsDismissed(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        dismissed: true,
        timestamp: Date.now()
      }));
    }
  };

  // Don't render anything while loading
  if (isLoading) return null;

  // Select message based on current locale
  const message = locale === 'fr' ? config.message_fr : config.message_en;

  return (
    <Dialog open={config.enabled && !isDismissed} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-md">
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

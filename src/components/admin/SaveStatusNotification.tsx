import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, WifiOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatusState } from '@/hooks/useSaveStatus';

interface SaveStatusNotificationProps extends SaveStatusState {
  onDismiss?: () => void;
}

export function SaveStatusNotification({
  status,
  message,
  error,
  retryCallback,
  onDismiss,
}: SaveStatusNotificationProps) {
  // Auto-dismiss on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onDismiss) {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onDismiss]);

  // Don't render anything in idle state
  if (status === 'idle') {
    return null;
  }

  // Status-specific configurations
  const statusConfig = {
    saving: {
      icon: Loader2,
      iconClassName: 'text-primary animate-spin',
      variant: 'default' as const,
      title: 'Saving',
      description: message || 'Saving changes...',
    },
    success: {
      icon: CheckCircle,
      iconClassName: 'text-green-600',
      variant: 'default' as const,
      title: 'Success',
      description: message || 'Changes saved successfully',
    },
    error: {
      icon: XCircle,
      iconClassName: 'text-destructive',
      variant: 'destructive' as const,
      title: 'Error',
      description: error || 'Failed to save changes',
    },
    offline: {
      icon: WifiOff,
      iconClassName: 'text-orange-600',
      variant: 'default' as const,
      title: 'Offline',
      description: message || 'No internet connection',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in-0 duration-300"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <Alert
        variant={config.variant}
        className={cn(
          'w-96 shadow-lg border-2',
          status === 'success' && 'border-green-600 bg-green-50',
          status === 'offline' && 'border-orange-600 bg-orange-50'
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 mt-0.5', config.iconClassName)} />
          
          <div className="flex-1">
            <AlertTitle className="font-semibold mb-1">
              {config.title}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {config.description}
            </AlertDescription>

            {/* Retry button for error state */}
            {status === 'error' && retryCallback && (
              <Button
                variant="outline"
                size="sm"
                onClick={retryCallback}
                className="mt-3"
              >
                Retry
              </Button>
            )}
          </div>

          {/* Dismiss button */}
          {onDismiss && status !== 'saving' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={onDismiss}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}

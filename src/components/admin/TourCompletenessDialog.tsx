import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourPublish } from '@/hooks/use-tour-publish';
import { toast } from 'sonner';

interface TourCompletenessDialogProps {
  tourId: string;
  tourTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: () => void;
}

interface ValidationCheck {
  validation_check: string;
  status: string;
  message: string;
}

export const TourCompletenessDialog = ({
  tourId,
  tourTitle,
  isOpen,
  onClose,
  onPublishSuccess,
}: TourCompletenessDialogProps) => {
  const [validations, setValidations] = useState<ValidationCheck[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { checkCompleteness, publishWithValidation, publishWithOverride, isPublishing } = useTourPublish();

  useEffect(() => {
    if (isOpen && tourId) {
      loadValidations();
    }
  }, [isOpen, tourId]);

  const loadValidations = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const results = await checkCompleteness(tourId);
      setValidations(results);
    } catch (err) {
      setError('Failed to check tour completeness');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status.includes('❌')) return <AlertCircle className="h-5 w-5 text-destructive" />;
    if (status.includes('⚠️')) return <Clock className="h-5 w-5 text-yellow-600" />;
    return null;
  };

  const getStatusBadge = (status: string) => {
    if (status.includes('✅')) return <Badge variant="default" className="bg-green-600">PASS</Badge>;
    if (status.includes('❌')) return <Badge variant="destructive">FAIL</Badge>;
    if (status.includes('⚠️')) return <Badge variant="secondary" className="bg-yellow-600 text-white">PARTIAL</Badge>;
    return null;
  };

  const allChecksPassed = validations.every(v => v.status.includes('✅'));

  const handlePublish = async () => {
    try {
      await publishWithValidation(tourId);
      toast.success('Tour published successfully!');
      onPublishSuccess();
      onClose();
    } catch (err) {
      // Error handling done in the hook
    }
  };

  const handlePublishWithOverride = async () => {
    setShowOverrideConfirm(false);
    try {
      await publishWithOverride(tourId);
      toast.success('Tour published (validation bypassed)');
      onPublishSuccess();
      onClose();
    } catch (err) {
      // Error handling done in the hook
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tour Completeness Check</DialogTitle>
            <DialogDescription>
              Reviewing tour: <span className="font-semibold">{tourTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isChecking ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </>
            ) : error ? (
              // Error state
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-destructive">{error}</p>
                <Button onClick={loadValidations} variant="outline">
                  Retry
                </Button>
              </div>
            ) : (
              // Validation results
              <>
                {validations.map((validation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="mt-0.5">
                      {getStatusIcon(validation.status)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{validation.validation_check}</span>
                        {getStatusBadge(validation.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{validation.message}</p>
                    </div>
                  </div>
                ))}

                {/* Summary */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                  {allChecksPassed ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">All checks passed! Tour is ready to publish.</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-yellow-700">
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Some checks failed</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can still publish, but incomplete tours may not display properly.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isPublishing}>
              Cancel
            </Button>
            {!isChecking && !error && (
              allChecksPassed ? (
                <Button onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publish Tour
                </Button>
              ) : (
                <Button
                  onClick={() => setShowOverrideConfirm(true)}
                  disabled={isPublishing}
                  variant="destructive"
                >
                  {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publish Anyway (Override)
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Override Confirmation Dialog */}
      <AlertDialog open={showOverrideConfirm} onOpenChange={setShowOverrideConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Incomplete Tour?</AlertDialogTitle>
            <AlertDialogDescription>
              This tour has failed some completeness checks. Publishing an incomplete tour may result in:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Missing images or broken layouts</li>
                <li>Incomplete information for customers</li>
                <li>Poor user experience</li>
              </ul>
              Are you sure you want to publish anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishWithOverride} className="bg-destructive hover:bg-destructive/90">
              Publish Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

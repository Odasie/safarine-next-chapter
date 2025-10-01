import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'offline';

export interface SaveStatusState {
  status: SaveStatus;
  message?: string;
  error?: string;
  retryCallback?: () => void;
  isOnline: boolean;
}

export interface SaveStatusActions {
  setSaving: (message?: string) => void;
  setSuccess: (message?: string) => void;
  setError: (error: string, retryCallback?: () => void) => void;
  setOffline: () => void;
  reset: () => void;
}

export type UseSaveStatusReturn = SaveStatusState & SaveStatusActions;

export function useSaveStatus(): UseSaveStatusReturn {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [error, setErrorMessage] = useState<string | undefined>();
  const [retryCallback, setRetryCallback] = useState<(() => void) | undefined>();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (status === 'offline') {
        setStatus('idle');
        toast.success('Connection restored');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
      toast.warning('Connection lost. Changes will be saved when online.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [status]);

  const setSaving = useCallback((msg?: string) => {
    setStatus('saving');
    setMessage(msg || 'Saving...');
    setErrorMessage(undefined);
    setRetryCallback(undefined);
  }, []);

  const setSuccess = useCallback((msg?: string) => {
    const successMessage = msg || 'Saved successfully';
    setStatus('success');
    setMessage(successMessage);
    setErrorMessage(undefined);
    setRetryCallback(undefined);
    
    toast.success(successMessage);

    // Auto-hide success notification after 3 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage(undefined);
    }, 3000);
  }, []);

  const setError = useCallback((err: string, callback?: () => void) => {
    setStatus('error');
    setMessage(undefined);
    setErrorMessage(err);
    setRetryCallback(() => callback);
    
    toast.error(err);
  }, []);

  const setOffline = useCallback(() => {
    setStatus('offline');
    setMessage('You are offline');
    setErrorMessage(undefined);
    setRetryCallback(undefined);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage(undefined);
    setErrorMessage(undefined);
    setRetryCallback(undefined);
  }, []);

  return {
    status,
    message,
    error,
    retryCallback,
    isOnline,
    setSaving,
    setSuccess,
    setError,
    setOffline,
    reset,
  };
}

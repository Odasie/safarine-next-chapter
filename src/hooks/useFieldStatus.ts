import { useState, useCallback, useRef, useEffect } from 'react';

export type FieldStatus = 'idle' | 'saving' | 'saved' | 'error' | 'required';

export interface FieldStatusState {
  fieldName: string;
  status: FieldStatus;
  message?: string;
  error?: string;
  lastSaved?: Date;
}

export interface UseFieldStatusReturn {
  getFieldStatus: (fieldName: string) => FieldStatusState;
  setFieldSaving: (fieldName: string, message?: string) => void;
  setFieldSaved: (fieldName: string, message?: string) => void;
  setFieldError: (fieldName: string, error: string) => void;
  setFieldRequired: (fieldName: string) => void;
  resetField: (fieldName: string) => void;
  resetAllFields: () => void;
  hasErrors: boolean;
  savingFields: string[];
}

interface InternalFieldStatus {
  status: FieldStatus;
  message?: string;
  error?: string;
  lastSaved?: Date;
  autoHideTimer?: NodeJS.Timeout;
}

export function useFieldStatus(): UseFieldStatusReturn {
  const [fieldStatuses, setFieldStatuses] = useState<Map<string, InternalFieldStatus>>(
    new Map()
  );
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const clearTimer = useCallback((fieldName: string) => {
    const existingTimer = timersRef.current.get(fieldName);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(fieldName);
    }
  }, []);

  const getFieldStatus = useCallback(
    (fieldName: string): FieldStatusState => {
      const status = fieldStatuses.get(fieldName);
      return {
        fieldName,
        status: status?.status || 'idle',
        message: status?.message,
        error: status?.error,
        lastSaved: status?.lastSaved,
      };
    },
    [fieldStatuses]
  );

  const setFieldSaving = useCallback((fieldName: string, message?: string) => {
    clearTimer(fieldName);
    setFieldStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(fieldName, {
        status: 'saving',
        message: message || 'Saving...',
      });
      return newMap;
    });
  }, [clearTimer]);

  const setFieldSaved = useCallback(
    (fieldName: string, message?: string) => {
      clearTimer(fieldName);
      
      setFieldStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(fieldName, {
          status: 'saved',
          message: message || 'Saved',
          lastSaved: new Date(),
        });
        return newMap;
      });

      // Auto-clear saved status after 2 seconds
      const timer = setTimeout(() => {
        setFieldStatuses(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(fieldName);
          if (current?.status === 'saved') {
            newMap.set(fieldName, {
              ...current,
              status: 'idle',
              message: undefined,
            });
          }
          return newMap;
        });
        timersRef.current.delete(fieldName);
      }, 2000);

      timersRef.current.set(fieldName, timer);
    },
    [clearTimer]
  );

  const setFieldError = useCallback((fieldName: string, error: string) => {
    clearTimer(fieldName);
    setFieldStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(fieldName, {
        status: 'error',
        error,
      });
      return newMap;
    });
  }, [clearTimer]);

  const setFieldRequired = useCallback((fieldName: string) => {
    clearTimer(fieldName);
    setFieldStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(fieldName, {
        status: 'required',
        message: 'This field is required',
      });
      return newMap;
    });
  }, [clearTimer]);

  const resetField = useCallback(
    (fieldName: string) => {
      clearTimer(fieldName);
      setFieldStatuses(prev => {
        const newMap = new Map(prev);
        newMap.delete(fieldName);
        return newMap;
      });
    },
    [clearTimer]
  );

  const resetAllFields = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    setFieldStatuses(new Map());
  }, []);

  // Computed values
  const hasErrors = Array.from(fieldStatuses.values()).some(
    status => status.status === 'error'
  );

  const savingFields = Array.from(fieldStatuses.entries())
    .filter(([_, status]) => status.status === 'saving')
    .map(([fieldName]) => fieldName);

  return {
    getFieldStatus,
    setFieldSaving,
    setFieldSaved,
    setFieldError,
    setFieldRequired,
    resetField,
    resetAllFields,
    hasErrors,
    savingFields,
  };
}

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldStatus } from '@/hooks/useFieldStatus';

interface FormFieldWithStatusProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  status?: FieldStatus;
  className?: string;
  
  // Textarea specific
  rows?: number;
  
  // Number specific
  min?: number;
  max?: number;
  step?: number;
  
  // Status configuration
  showStatusIcon?: boolean;
  statusMessage?: string;
  onStatusChange?: (status: FieldStatus) => void;
}

const StatusIcon: React.FC<{ status: FieldStatus; className?: string }> = ({ 
  status, 
  className 
}) => {
  const baseClasses = "h-4 w-4 transition-all duration-300";
  
  switch (status) {
    case 'saving':
      return <Loader2 className={cn(baseClasses, "animate-spin text-primary", className)} />;
    case 'saved':
      return <CheckCircle className={cn(baseClasses, "text-green-600", className)} />;
    case 'error':
      return <XCircle className={cn(baseClasses, "text-destructive", className)} />;
    case 'required':
      return <AlertTriangle className={cn(baseClasses, "text-orange-500", className)} />;
    default:
      return null;
  }
};

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <AlertCircle className={cn("h-4 w-4 text-destructive", className)} />
);

export const FormFieldWithStatus: React.FC<FormFieldWithStatusProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  status = 'idle',
  className,
  rows = 4,
  min,
  max,
  step,
  showStatusIcon = true,
  statusMessage,
  onStatusChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
    onStatusChange?.(status);
  };

  const getInputBorderColor = () => {
    if (error || status === 'error') return 'border-destructive focus-visible:ring-destructive';
    if (status === 'saving') return 'border-primary focus-visible:ring-primary';
    if (status === 'saved') return 'border-green-600 focus-visible:ring-green-600';
    if (status === 'required') return 'border-orange-500 focus-visible:ring-orange-500';
    return '';
  };

  const currentStatusMessage = error || statusMessage;
  const displayStatus = error ? 'error' : status;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label with status icon */}
      <div className="flex items-center justify-between">
        <Label 
          htmlFor={name}
          className="flex items-center gap-2"
        >
          {label}
          {required && (
            <span className="text-destructive text-sm" aria-label="required">
              *
            </span>
          )}
        </Label>
        
        {showStatusIcon && displayStatus !== 'idle' && (
          <div className="flex items-center gap-1.5 transition-all duration-300">
            <StatusIcon status={displayStatus} />
            {status === 'saving' && (
              <span className="text-xs text-muted-foreground">
                {statusMessage || 'Saving...'}
              </span>
            )}
            {status === 'saved' && (
              <span className="text-xs text-green-600">
                {statusMessage || 'Saved'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Input field */}
      {type === 'textarea' ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={cn(
            "transition-all duration-300",
            getInputBorderColor()
          )}
          aria-invalid={!!(error || status === 'error')}
          aria-describedby={currentStatusMessage ? `${name}-status` : undefined}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
          step={type === 'number' ? step : undefined}
          className={cn(
            "transition-all duration-300",
            getInputBorderColor()
          )}
          aria-invalid={!!(error || status === 'error')}
          aria-describedby={currentStatusMessage ? `${name}-status` : undefined}
        />
      )}

      {/* Status message */}
      {currentStatusMessage && (
        <div
          id={`${name}-status`}
          className={cn(
            "flex items-start gap-2 text-sm transition-all duration-300 animate-in slide-in-from-top-1",
            error || status === 'error' ? "text-destructive" : "text-muted-foreground"
          )}
          role="alert"
          aria-live="polite"
        >
          {(error || status === 'error') && <ErrorIcon className="mt-0.5 flex-shrink-0" />}
          <span>{currentStatusMessage}</span>
        </div>
      )}
    </div>
  );
};

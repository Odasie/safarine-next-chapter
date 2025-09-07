import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  onSecureChange?: (value: string, isValid: boolean) => void;
  validator?: (value: string) => { isValid: boolean; error?: string; sanitizedValue?: string };
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  error,
  helperText,
  onSecureChange,
  validator,
  className,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (validator && onSecureChange) {
      const result = validator(value);
      onSecureChange(result.sanitizedValue || value, result.isValid);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium">
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Input
        {...props}
        onChange={handleChange}
        className={cn(
          className,
          error && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
      />
      
      {error && (
        <div 
          id={`${props.id}-error`}
          className="flex items-center gap-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <p id={`${props.id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};
import React from 'react';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const resetError = () => this.setState({ hasError: false, error: undefined });
      
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold text-destructive mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={resetError}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center">
    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
    <h2 className="text-xl font-bold text-destructive mb-4">Dashboard Error</h2>
    <p className="text-muted-foreground mb-4 max-w-md">
      {error.message}
    </p>
    <Button onClick={resetError}>
      Reload Dashboard
    </Button>
  </div>
);
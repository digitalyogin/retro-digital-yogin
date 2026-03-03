import React from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-lg text-center space-y-3 border border-border bg-card p-6">
            <h1 className="text-xl font-terminal text-primary">PREVIEW ERROR</h1>
            <p className="text-sm text-muted-foreground">
              Si e verificato un errore di rendering. Ricarica la preview oppure
              controlla la console per il dettaglio tecnico.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component } from "react"
import type { ReactNode, ErrorInfo } from "react"
import { t } from "../../lib/i18n"

interface ErrorBoundaryProps {
  locale?: string
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onRetry?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const locale = this.props.locale || "en"

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 bg-ds-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-ds-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-ds-text mb-1">
            {t(locale, "ui.error_title")}
          </h3>
          <p className="text-sm text-ds-muted max-w-sm mb-4">
            {t(locale, "ui.error_description")}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {t(locale, "ui.retry")}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

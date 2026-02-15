import React from 'react'

interface WizardStep {
  id: string
  title: string
  description?: string
  component: React.ReactNode
  validate?: () => boolean
}

interface FormWizardProps {
  steps: WizardStep[]
  onComplete?: () => void
  onStepChange?: (stepIndex: number) => void
  initialStep?: number
}

export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const step = steps[currentStep]
  const progressPercent = ((currentStep + 1) / steps.length) * 100

  const goTo = (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index)
      setValidationError(null)
      onStepChange?.(index)
    }
  }

  const goNext = () => {
    if (step?.validate) {
      const isValid = step.validate()
      if (!isValid) {
        setValidationError('Please complete all required fields before proceeding.')
        return
      }
    }
    setValidationError(null)
    if (isLast) {
      onComplete?.()
    } else {
      const next = currentStep + 1
      setCurrentStep(next)
      onStepChange?.(next)
    }
  }

  const goPrev = () => {
    if (!isFirst) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      setValidationError(null)
      onStepChange?.(prev)
    }
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => {
            const isActive = i === currentStep
            const isCompleted = i < currentStep
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2 cursor-pointer" role="button" tabIndex={0} onClick={() => goTo(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(i) } }}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-ds-primary text-ds-primary-foreground'
                        : isCompleted
                        ? 'bg-ds-primary/20 text-ds-primary'
                        : 'bg-ds-muted text-ds-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-ds-foreground' : 'text-ds-muted-foreground'}`}>
                      {s.title}
                    </p>
                    {s.description && (
                      <p className="text-xs text-ds-muted-foreground">{s.description}</p>
                    )}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < currentStep ? 'bg-ds-primary' : 'bg-ds-border'}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="w-full h-1 bg-ds-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-ds-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        <div className="sm:hidden mb-4">
          <p className="text-sm font-medium text-ds-foreground">{step?.title}</p>
          {step?.description && (
            <p className="text-xs text-ds-muted-foreground mt-0.5">{step.description}</p>
          )}
        </div>

        {validationError && (
          <div className="mb-4 flex items-center gap-2 text-sm text-ds-destructive bg-ds-destructive/10 px-3 py-2 rounded-md">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {validationError}
          </div>
        )}

        <div>{step?.component}</div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-ds-border bg-ds-muted/30">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="px-4 py-2 text-sm font-medium rounded-md border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-xs text-ds-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={goNext}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isLast
              ? 'bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90'
              : 'bg-ds-primary text-ds-primary-foreground hover:bg-ds-primary/90'
          }`}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}

import React from 'react'
import { t } from '@/lib/i18n'

interface TimelineStep {
  title: string
  description?: string
  icon?: string
  date?: string
  status?: 'completed' | 'active' | 'upcoming'
}

interface TimelineBlockProps {
  heading?: string
  steps: TimelineStep[]
  variant?: 'vertical' | 'horizontal' | 'alternating'
  numbered?: boolean
  locale?: string
}

const statusColors: Record<string, { dot: string; line: string; text: string }> = {
  completed: {
    dot: 'bg-ds-success border-ds-success',
    line: 'bg-ds-success',
    text: 'text-ds-success',
  },
  active: {
    dot: 'bg-ds-primary border-ds-primary',
    line: 'bg-ds-primary',
    text: 'text-ds-primary',
  },
  upcoming: {
    dot: 'bg-ds-muted border-ds-border',
    line: 'bg-ds-muted',
    text: 'text-ds-muted-foreground',
  },
}

export const TimelineBlock: React.FC<TimelineBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  steps,
  variant = 'vertical',
  numbered = false,
  locale = 'en',
}) => {
  const getStatus = (step: TimelineStep) => step.status || 'upcoming'

  const renderVertical = () => (
    <div className="relative">
      {steps.map((step, index) => {
        const status = getStatus(step)
        const colors = statusColors[status]
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colors.dot}`}
              >
                {step.icon ? (
                  <span className="text-xs text-ds-background">{step.icon}</span>
                ) : numbered ? (
                  <span className="text-xs font-bold text-ds-background">{index + 1}</span>
                ) : status === 'completed' ? (
                  <svg className="w-4 h-4 text-ds-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-2 ${colors.line}`} />
              )}
            </div>

            <div className="flex-1 pt-1">
              <h3 className={`font-semibold ${colors.text}`}>{step.title}</h3>
              {step.date && (
                <span className="text-xs text-ds-muted-foreground">{step.date}</span>
              )}
              {step.description && (
                <p className="text-sm text-ds-muted-foreground mt-1">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderHorizontal = () => (
    <div className="flex overflow-x-auto pb-4 gap-0">
      {steps.map((step, index) => {
        const status = getStatus(step)
        const colors = statusColors[status]
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex items-start min-w-[160px] flex-shrink-0">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="flex items-center w-full mb-3">
                <div className={`flex-1 h-0.5 ${index === 0 ? 'bg-transparent' : colors.line}`} />
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colors.dot}`}
                >
                  {step.icon ? (
                    <span className="text-xs text-ds-background">{step.icon}</span>
                  ) : numbered ? (
                    <span className="text-xs font-bold text-ds-background">{index + 1}</span>
                  ) : status === 'completed' ? (
                    <svg className="w-4 h-4 text-ds-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </div>
                <div className={`flex-1 h-0.5 ${isLast ? 'bg-transparent' : colors.line}`} />
              </div>

              <h3 className={`font-semibold text-sm px-2 ${colors.text}`}>{step.title}</h3>
              {step.date && (
                <span className="text-xs text-ds-muted-foreground mt-0.5">{step.date}</span>
              )}
              {step.description && (
                <p className="text-xs text-ds-muted-foreground mt-1 px-2">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderAlternating = () => (
    <div className="relative">
      <div className="absolute start-1/2 top-0 bottom-0 w-0.5 bg-ds-border -translate-x-1/2 hidden md:block" />
      {steps.map((step, index) => {
        const status = getStatus(step)
        const colors = statusColors[status]
        const isEven = index % 2 === 0

        return (
          <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0 md:gap-0">
            <div className={`hidden md:flex md:w-1/2 ${isEven ? 'justify-end pe-8' : 'order-2 ps-8'}`}>
              <div className={`max-w-xs ${isEven ? 'text-end' : 'text-start'}`}>
                <h3 className={`font-semibold ${colors.text}`}>{step.title}</h3>
                {step.date && (
                  <span className="text-xs text-ds-muted-foreground">{step.date}</span>
                )}
                {step.description && (
                  <p className="text-sm text-ds-muted-foreground mt-1">{step.description}</p>
                )}
              </div>
            </div>

            <div className="md:absolute md:start-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${colors.dot}`}
              >
                {step.icon ? (
                  <span className="text-xs text-ds-background">{step.icon}</span>
                ) : numbered ? (
                  <span className="text-xs font-bold text-ds-background">{index + 1}</span>
                ) : null}
              </div>
            </div>

            <div className="flex-1 md:hidden pt-1">
              <h3 className={`font-semibold ${colors.text}`}>{step.title}</h3>
              {step.date && (
                <span className="text-xs text-ds-muted-foreground">{step.date}</span>
              )}
              {step.description && (
                <p className="text-sm text-ds-muted-foreground mt-1">{step.description}</p>
              )}
            </div>

            <div className={`hidden md:flex md:w-1/2 ${isEven ? 'order-2' : ''}`} />
          </div>
        )
      })}
    </div>
  )

  return (
    <section className="w-full py-12 px-4">
      <div className="container mx-auto">
        {heading && (
          <h2 className="text-3xl font-bold text-ds-foreground mb-8 text-center">{heading}</h2>
        )}

        {variant === 'horizontal' ? renderHorizontal() : variant === 'alternating' ? renderAlternating() : renderVertical()}
      </div>
    </section>
  )
}

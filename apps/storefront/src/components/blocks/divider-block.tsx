import React from 'react'

interface DividerBlockProps {
  style?: 'line' | 'dashed' | 'dotted' | 'gradient' | 'space'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

const spacingMap = {
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
}

export const DividerBlock: React.FC<DividerBlockProps> = ({
  style = 'line',
  spacing = 'md',
}) => {
  if (style === 'space') {
    return <div className={spacingMap[spacing]} />
  }

  const borderStyles: Record<string, string> = {
    line: 'border-t border-ds-border',
    dashed: 'border-t border-dashed border-ds-border',
    dotted: 'border-t border-dotted border-ds-border',
  }

  if (style === 'gradient') {
    return (
      <div className={spacingMap[spacing]}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-ds-border to-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className={spacingMap[spacing]}>
      <div className="container mx-auto px-4 md:px-6">
        <hr className={borderStyles[style]} />
      </div>
    </div>
  )
}

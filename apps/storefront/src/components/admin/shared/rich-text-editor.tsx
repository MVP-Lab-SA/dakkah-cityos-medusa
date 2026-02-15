import React from 'react'
import DOMPurify from 'dompurify'

type ToolName = 'bold' | 'italic' | 'underline' | 'h1' | 'h2' | 'h3' | 'link' | 'ordered-list' | 'unordered-list' | 'quote' | 'code' | 'image'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: number
  toolbar?: ToolName[]
}

const DEFAULT_TOOLBAR: ToolName[] = ['bold', 'italic', 'underline', 'h1', 'h2', 'h3', 'link', 'ordered-list', 'unordered-list', 'quote', 'code', 'image']

interface ToolConfig {
  name: ToolName
  icon: React.ReactNode
  action: () => void
  label: string
  group?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 200,
  toolbar = DEFAULT_TOOLBAR,
}) => {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = React.useState(!value)

  React.useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = DOMPurify.sanitize(value)
      setIsEmpty(false)
    }
  }, [])

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      setIsEmpty(!html || html === '<br>' || html === '<div><br></div>')
      onChange?.(html)
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) exec('insertImage', url)
  }

  const tools: ToolConfig[] = [
    {
      name: 'bold', label: 'Bold', group: 'format',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>,
      action: () => exec('bold'),
    },
    {
      name: 'italic', label: 'Italic', group: 'format',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>,
      action: () => exec('italic'),
    },
    {
      name: 'underline', label: 'Underline', group: 'format',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>,
      action: () => exec('underline'),
    },
    {
      name: 'h1', label: 'Heading 1', group: 'heading',
      icon: <span className="text-xs font-bold">H1</span>,
      action: () => exec('formatBlock', 'h1'),
    },
    {
      name: 'h2', label: 'Heading 2', group: 'heading',
      icon: <span className="text-xs font-bold">H2</span>,
      action: () => exec('formatBlock', 'h2'),
    },
    {
      name: 'h3', label: 'Heading 3', group: 'heading',
      icon: <span className="text-xs font-bold">H3</span>,
      action: () => exec('formatBlock', 'h3'),
    },
    {
      name: 'link', label: 'Link', group: 'insert',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
      action: insertLink,
    },
    {
      name: 'ordered-list', label: 'Ordered List', group: 'list',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><text x="4" y="7" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="4" y="13" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="4" y="19" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">3</text></svg>,
      action: () => exec('insertOrderedList'),
    },
    {
      name: 'unordered-list', label: 'Unordered List', group: 'list',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="5" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" /></svg>,
      action: () => exec('insertUnorderedList'),
    },
    {
      name: 'quote', label: 'Blockquote', group: 'block',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>,
      action: () => exec('formatBlock', 'blockquote'),
    },
    {
      name: 'code', label: 'Code', group: 'block',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
      action: () => exec('formatBlock', 'pre'),
    },
    {
      name: 'image', label: 'Image', group: 'insert',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
      action: insertImage,
    },
  ]

  const activeTools = tools.filter((t) => toolbar.includes(t.name))

  let lastGroup = ''

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-ds-border bg-ds-muted/30">
        {activeTools.map((tool) => {
          const showSep = tool.group !== lastGroup && lastGroup !== ''
          lastGroup = tool.group || ''
          return (
            <React.Fragment key={tool.name}>
              {showSep && <div className="w-px h-5 bg-ds-border mx-1" />}
              <button
                type="button"
                onClick={tool.action}
                title={tool.label}
                className="w-8 h-8 flex items-center justify-center rounded text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
              >
                {tool.icon}
              </button>
            </React.Fragment>
          )
        })}
      </div>
      <div className="relative">
        {isEmpty && (
          <div className="absolute top-3 start-4 text-sm text-ds-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 text-sm text-ds-foreground focus:outline-none prose prose-sm max-w-none"
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}

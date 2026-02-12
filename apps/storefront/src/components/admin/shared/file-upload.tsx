import React from 'react'

interface FilePreview {
  id: string
  url: string
  name: string
  size: number
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onUpload?: (files: File[]) => void
  onRemove?: (id: string) => void
  previews?: FilePreview[]
  variant?: 'dropzone' | 'button'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10,
  onUpload,
  onRemove,
  previews = [],
  variant = 'dropzone',
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})

  const validateFiles = (files: File[]): File[] => {
    setError(null)
    const maxBytes = maxSize * 1024 * 1024
    const valid: File[] = []
    for (const file of files) {
      if (file.size > maxBytes) {
        setError(`"${file.name}" exceeds maximum size of ${maxSize}MB`)
        continue
      }
      valid.push(file)
    }
    return valid
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList)
    const valid = validateFiles(files)
    if (valid.length > 0) {
      valid.forEach((f) => {
        setUploadProgress((prev) => ({ ...prev, [f.name]: 0 }))
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30 + 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
          }
          setUploadProgress((prev) => ({ ...prev, [f.name]: Math.min(progress, 100) }))
        }, 200)
      })
      onUpload?.(valid)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {variant === 'dropzone' ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-ds-primary bg-ds-primary/5'
              : 'border-ds-border hover:border-ds-primary/50 hover:bg-ds-muted/30'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-ds-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-ds-foreground">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-ds-muted-foreground mt-1">
                {accept ? `Accepted: ${accept}` : 'Any file type'} · Max {maxSize}MB
                {multiple ? '' : ' · Single file'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:bg-ds-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Upload {multiple ? 'Files' : 'File'}
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-ds-destructive bg-ds-destructive/10 px-3 py-2 rounded-md">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {error}
        </div>
      )}

      {Object.entries(uploadProgress).map(([name, progress]) => {
        if (progress >= 100) return null
        return (
          <div key={name} className="bg-ds-muted/30 rounded-md px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-ds-foreground truncate">{name}</span>
              <span className="text-xs text-ds-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-ds-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-ds-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )
      })}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((file) => (
            <div key={file.id} className="group relative bg-ds-card border border-ds-border rounded-lg overflow-hidden">
              {isImage(file.name) ? (
                <div className="aspect-square">
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-ds-muted/30">
                  <svg className="w-10 h-10 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="px-2 py-1.5 border-t border-ds-border">
                <p className="text-xs text-ds-foreground truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-ds-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ds-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

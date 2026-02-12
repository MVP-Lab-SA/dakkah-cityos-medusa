// @ts-nocheck
import { useState, useRef, useCallback } from "react"
import { t } from "../../lib/i18n"

interface EvidenceUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  locale: string
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function EvidenceUploader({
  onFilesSelected,
  maxFiles = 5,
  locale,
}: EvidenceUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const validFiles = Array.from(newFiles).filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) return false
        if (file.size > MAX_FILE_SIZE) return false
        return true
      })

      setFiles((prev) => {
        const combined = [...prev, ...validFiles].slice(0, maxFiles)
        onFilesSelected(combined)
        return combined
      })
    },
    [maxFiles, onFilesSelected]
  )

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const updated = prev.filter((_, i) => i !== index)
        onFilesSelected(updated)
        return updated
      })
    },
    [onFilesSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      if (e.dataTransfer.files) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-ds-primary bg-ds-primary/5"
            : "border-ds-border bg-ds-surface hover:border-ds-primary/50"
        }`}
      >
        <div className="text-3xl mb-2">📁</div>
        <p className="text-sm font-medium text-ds-foreground">
          {t(locale, "disputes.drop_files")}
        </p>
        <p className="text-xs text-ds-muted-foreground mt-1">
          {t(locale, "disputes.accepted_formats")}
        </p>
        <p className="text-xs text-ds-muted-foreground">
          {t(locale, "disputes.max_files")}: {maxFiles}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const preview = getFilePreview(file)
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 bg-ds-muted rounded-lg px-3 py-2"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={file.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-ds-surface flex items-center justify-center text-xs text-ds-muted-foreground flex-shrink-0">
                    PDF
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ds-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-ds-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="text-ds-muted-foreground hover:text-ds-destructive transition-colors text-lg flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useRef } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface EvidenceUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string
  locale?: string
}

export function EvidenceUploader({
  files,
  onFilesChange,
  maxFiles = 10,
  acceptedTypes = "image/*,.pdf,.doc,.docx",
  locale: localeProp,
}: EvidenceUploaderProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = [...files, ...Array.from(e.target.files)].slice(0, maxFiles)
      onFilesChange(newFiles)
    }
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const newFiles = [...files, ...Array.from(e.dataTransfer.files)].slice(0, maxFiles)
      onFilesChange(newFiles)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ds-foreground">
        {t(locale, "disputes.evidence")}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center cursor-pointer hover:border-ds-primary/50 hover:bg-ds-muted/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-ds-muted flex items-center justify-center mx-auto mb-3">
          <span className="text-lg text-ds-muted-foreground">📎</span>
        </div>
        <p className="text-sm text-ds-muted-foreground">{t(locale, "disputes.drag_drop")}</p>
        <p className="text-xs text-ds-muted-foreground mt-1">
          {t(locale, "disputes.max_files")}: {maxFiles}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedTypes}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2 bg-ds-muted rounded-lg">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm flex-shrink-0">📄</span>
                <div className="min-w-0">
                  <p className="text-sm text-ds-foreground truncate">{file.name}</p>
                  <p className="text-xs text-ds-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-ds-destructive text-sm font-medium ms-2 flex-shrink-0 hover:underline"
              >
                {t(locale, "disputes.remove")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

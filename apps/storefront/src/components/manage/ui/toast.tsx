import { useState, useCallback, createContext, useContext, type ReactNode } from "react"
import { clsx } from "clsx"
import { XMark, CheckCircleSolid, ExclamationCircleSolid, InformationCircleSolid } from "@medusajs/icons"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      addToast: (_type: ToastType, _message: string) => {
        console.warn("useToast must be used within ToastProvider")
      },
    }
  }
  return ctx
}

const iconMap: Record<ToastType, typeof CheckCircleSolid> = {
  success: CheckCircleSolid,
  error: ExclamationCircleSolid,
  info: InformationCircleSolid,
}

const colorMap: Record<ToastType, string> = {
  success: "text-emerald-600",
  error: "text-red-600",
  info: "text-blue-600",
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = iconMap[toast.type]

  return (
    <div
      className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 min-w-[300px] max-w-md animate-[slideIn_0.2s_ease-out]"
    >
      <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", colorMap[toast.type])} />
      <p className="flex-1 text-sm text-gray-900">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMark className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 end-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

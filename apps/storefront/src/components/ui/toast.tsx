import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckCircleSolid, XCircleSolid, ExclamationCircleSolid, XMark } from "@medusajs/icons"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const defaultToastValue: ToastContextType = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
}

export function ToastProvider({ children }: { children: ReactNode }) {
  if (typeof window === "undefined") {
    return (
      <ToastContext.Provider value={defaultToastValue}>
        {children}
      </ToastContext.Provider>
    )
  }

  return <ClientToastProvider>{children}</ClientToastProvider>
}

function ClientToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message, duration }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  
  const success = useCallback((message: string, duration?: number) => addToast("success", message, duration), [addToast])
  const error = useCallback((message: string, duration?: number) => addToast("error", message, duration), [addToast])
  const warning = useCallback((message: string, duration?: number) => addToast("warning", message, duration), [addToast])
  const info = useCallback((message: string, duration?: number) => addToast("info", message, duration), [addToast])
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircleSolid className="w-5 h-5 text-green-500" />,
    error: <XCircleSolid className="w-5 h-5 text-ds-destructive" />,
    warning: <ExclamationCircleSolid className="w-5 h-5 text-yellow-500" />,
    info: <ExclamationCircleSolid className="w-5 h-5 text-blue-500" />
  }
  
  const backgrounds = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-ds-destructive/20",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200"
  }
  
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-right ${backgrounds[toast.type]}`}
      role="alert"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-ds-foreground">{toast.message}</p>
      <button 
        onClick={onClose} 
        className="text-ds-muted-foreground hover:text-ds-foreground transition-colors"
        aria-label="Close notification"
      >
        <XMark className="w-4 h-4" />
      </button>
    </div>
  )
}

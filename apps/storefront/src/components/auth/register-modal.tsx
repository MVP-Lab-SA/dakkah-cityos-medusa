import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RegisterForm } from "./register-form"

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onLogin?: () => void
}

export function RegisterModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  onLogin 
}: RegisterModalProps) {
  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="bg-zinc-50 px-6 py-5 border-b border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create an account</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <RegisterForm onSuccess={handleSuccess} onLogin={onLogin} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

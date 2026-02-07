import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ForgotPasswordForm } from "./forgot-password-form"

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack?: () => void
}

export function ForgotPasswordModal({ 
  open, 
  onOpenChange, 
  onBack 
}: ForgotPasswordModalProps) {
  const handleBack = () => {
    onBack?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="bg-zinc-50 px-6 py-5 border-b border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Reset password</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <ForgotPasswordForm onBack={handleBack} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

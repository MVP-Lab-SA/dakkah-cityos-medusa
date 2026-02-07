import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./login-form"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  onForgotPassword?: () => void
  onRegister?: () => void
}

export function LoginModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  onForgotPassword,
  onRegister 
}: LoginModalProps) {
  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="bg-zinc-50 px-6 py-5 border-b border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Welcome back</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <LoginForm
            onSuccess={handleSuccess}
            onForgotPassword={onForgotPassword}
            onRegister={onRegister}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

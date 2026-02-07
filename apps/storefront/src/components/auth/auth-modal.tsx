import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { ForgotPasswordForm } from "./forgot-password-form"

type AuthView = "login" | "register" | "forgot-password"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: AuthView
}

export function AuthModal({ open, onOpenChange, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView)

  const handleSuccess = () => {
    onOpenChange(false)
    setView("login")
  }

  const getTitle = () => {
    switch (view) {
      case "login":
        return "Welcome back"
      case "register":
        return "Create an account"
      case "forgot-password":
        return "Reset password"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="bg-zinc-50 px-6 py-5 border-b border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{getTitle()}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          {view === "login" && (
            <LoginForm
              onSuccess={handleSuccess}
              onForgotPassword={() => setView("forgot-password")}
              onRegister={() => setView("register")}
            />
          )}
          {view === "register" && (
            <RegisterForm onSuccess={handleSuccess} onLogin={() => setView("login")} />
          )}
          {view === "forgot-password" && (
            <ForgotPasswordForm onBack={() => setView("login")} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

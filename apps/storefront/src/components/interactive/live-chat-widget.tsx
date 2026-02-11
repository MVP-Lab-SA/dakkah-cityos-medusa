import { useState, useRef, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: string
}

interface LiveChatWidgetProps {
  locale?: string
  className?: string
  unreadCount?: number
  agentName?: string
  agentAvatar?: string
  isOnline?: boolean
  messages?: ChatMessage[]
  onSendMessage?: (text: string) => void
  onOpen?: () => void
  onClose?: () => void
}

export function LiveChatWidget({
  locale: localeProp,
  className = "",
  unreadCount = 0,
  agentName,
  agentAvatar,
  isOnline = true,
  messages = [],
  onSendMessage,
  onOpen,
  onClose,
}: LiveChatWidgetProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggle = () => {
    const next = !isExpanded
    setIsExpanded(next)
    if (next) onOpen?.()
    else onClose?.()
  }

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onSendMessage?.(trimmed)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`fixed bottom-4 end-4 z-50 ${className}`}>
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 bg-ds-card border border-ds-border rounded-xl shadow-xl flex flex-col overflow-hidden" style={{ maxHeight: "28rem" }}>
          <div className="bg-ds-primary text-ds-primary-foreground px-4 py-3 flex items-center gap-3">
            {agentAvatar ? (
              <img src={agentAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {agentName || t(locale, "interactive.chat_support")}
              </p>
              <p className="text-xs opacity-80">
                {isOnline ? t(locale, "interactive.online") : t(locale, "interactive.offline")}
              </p>
            </div>
            <button onClick={toggle} className="p-1 hover:bg-white/10 rounded" aria-label={t(locale, "common.close")}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ds-background" style={{ minHeight: "12rem" }}>
            {messages.length === 0 && (
              <p className="text-sm text-ds-muted text-center py-6">
                {t(locale, "interactive.chat_welcome")}
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-ds-primary text-ds-primary-foreground rounded-ee-none"
                    : "bg-ds-accent text-ds-text rounded-es-none"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.sender === "user" ? "opacity-70" : "text-ds-muted"
                  }`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-ds-border p-3 bg-ds-card">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(locale, "interactive.type_message")}
                className="flex-1 bg-ds-background border border-ds-border rounded-md px-3 py-2 text-sm text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2 bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                aria-label={t(locale, "interactive.send")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        className="ms-auto flex items-center justify-center w-14 h-14 rounded-full bg-ds-primary text-ds-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        aria-label={t(locale, "interactive.chat_support")}
      >
        {isExpanded ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!isExpanded && unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-bold bg-ds-destructive text-white rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}

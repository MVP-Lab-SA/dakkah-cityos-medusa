import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown } from "@medusajs/icons"

interface AddToCalendarProps {
  title: string
  description?: string
  location?: string
  startDate: string
  duration: number // in minutes
}

export function AddToCalendar({ 
  title, 
  description, 
  location, 
  startDate, 
  duration 
}: AddToCalendarProps) {
  const [showOptions, setShowOptions] = useState(false)

  const start = new Date(startDate)
  const end = new Date(start.getTime() + duration * 60000)

  const formatForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "")
  }

  const formatForICS = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, -1) + "Z"
  }

  const generateGoogleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formatForGoogle(start)}/${formatForGoogle(end)}`,
      details: description || "",
      location: location || "",
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const generateOutlookUrl = () => {
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: title,
      startdt: start.toISOString(),
      enddt: end.toISOString(),
      body: description || "",
      location: location || "",
    })
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  const generateICSFile = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Booking//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatForICS(start)}`,
      `DTEND:${formatForICS(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description || ""}`,
      `LOCATION:${location || ""}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n")

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.replace(/\s+/g, "-")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const calendarOptions = [
    {
      name: "Google Calendar",
      action: () => window.open(generateGoogleCalendarUrl(), "_blank"),
    },
    {
      name: "Outlook",
      action: () => window.open(generateOutlookUrl(), "_blank"),
    },
    {
      name: "Apple Calendar",
      action: generateICSFile,
    },
    {
      name: "Download .ics",
      action: generateICSFile,
    },
  ]

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
      </Button>

      {showOptions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ds-background rounded-lg border border-ds-border shadow-lg z-10 overflow-hidden">
          {calendarOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                option.action()
                setShowOptions(false)
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-ds-muted transition-colors"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import React from 'react'

interface BookingConfirmationBlockProps {
  showCalendarAdd?: boolean
  showCancellationPolicy?: boolean
  confirmationMessage?: string
}

export const BookingConfirmationBlock: React.FC<BookingConfirmationBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  showCalendarAdd = true,
  showCancellationPolicy = true,
  confirmationMessage = 'Your booking has been confirmed!',
}) => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-ds-card border border-ds-border rounded-xl p-8 md:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ds-success/15 flex items-center justify-center">
              <svg className="w-8 h-8 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-2">
              Booking Confirmed
            </h2>
            <p className="text-ds-muted-foreground mb-6">{confirmationMessage}</p>

            <div className="bg-ds-muted rounded-lg p-4 mb-6 text-left">
              <div className="text-xs text-ds-muted-foreground mb-1">Reference Number</div>
              <div className="text-lg font-mono font-bold text-ds-foreground">BK-2026-00482</div>
            </div>

            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-ds-border">
                <svg className="w-5 h-5 text-ds-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-ds-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-ds-foreground">Thursday, March 15, 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-ds-border">
                <svg className="w-5 h-5 text-ds-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-ds-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-ds-foreground">10:00 AM - 11:00 AM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-ds-border">
                <svg className="w-5 h-5 text-ds-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-ds-muted-foreground">Service</p>
                  <p className="text-sm font-medium text-ds-foreground">Deep Tissue Massage</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-ds-border">
                <svg className="w-5 h-5 text-ds-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-xs text-ds-muted-foreground">Provider</p>
                  <p className="text-sm font-medium text-ds-foreground">Dr. Sarah Johnson</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {showCalendarAdd && (
                <button className="w-full py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add to Calendar
                </button>
              )}

              <button className="w-full py-3 border border-ds-border text-ds-foreground rounded-lg font-semibold hover:bg-ds-muted transition-colors">
                View My Bookings
              </button>
            </div>

            {showCancellationPolicy && (
              <div className="mt-6 pt-6 border-t border-ds-border">
                <p className="text-xs text-ds-muted-foreground">
                  Free cancellation up to 24 hours before the appointment.
                  Late cancellations may incur a fee of up to 50% of the service price.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

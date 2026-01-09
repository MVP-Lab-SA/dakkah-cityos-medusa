import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Dakkah CityOS Orchestrator',
  description: 'Multi-tenant orchestration platform for Dakkah CityOS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

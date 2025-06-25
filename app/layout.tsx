import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Live Trade Feed',
  description: 'Real-time trading data dashboard with WebSocket integration',
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
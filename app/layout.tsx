import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Security Vulnerabilities Demo',
  description: 'Educational demonstration of XSS and Sensitive Data Exposure vulnerabilities',
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

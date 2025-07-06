import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Nexuz',
  description: 'A cosmic interface connecting different worlds',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

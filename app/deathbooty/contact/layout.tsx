import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Death Booty Contact - Get in Touch',
  description: 'Contact the Death Booty crew',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
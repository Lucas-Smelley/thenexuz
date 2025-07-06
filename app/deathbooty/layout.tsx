import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Death Booty - Hardcore Skating',
  description: 'Hardcore skateboarding where its ride or die',
}

export default function DeathBootyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
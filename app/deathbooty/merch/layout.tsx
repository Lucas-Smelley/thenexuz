import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Death Booty Merch - Hardcore Gear',
  description: 'Official Death Booty merchandise and gear',
}

export default function MerchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
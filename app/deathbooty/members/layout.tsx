import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Death Booty Members - Most Wanted',
  description: 'Meet the hardcore skating crew members',
}

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
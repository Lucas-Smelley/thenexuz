import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Death Booty Media - Hardcore Content',
  description: 'Videos, photos, and media from the Death Booty crew',
}

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
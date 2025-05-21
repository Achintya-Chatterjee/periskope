import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Periskope App',
  description: 'Made with :heart: by Achintya',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import PwaInstallPrompt from '@/components/pwa-install-prompt';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FASTO: AI Powerhouse',
  description: 'FASTO: Your modern AI-powered assistant for content creation and more.',
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#4681A4',
          colorText: 'hsl(var(--foreground))',
          colorBackground: 'hsl(var(--background))',
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased font-body`}>
          {children}
          <Toaster />
          <PwaInstallPrompt />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}

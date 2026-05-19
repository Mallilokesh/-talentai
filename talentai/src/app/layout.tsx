import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TalentAI — AI-Powered Job Portal',
  description: 'Find your perfect career match with AI-powered recommendations. Built for both job seekers and employers.',
  keywords: 'jobs, AI recruitment, job portal, hiring, career, India',
  openGraph: {
    title: 'TalentAI — AI-Powered Job Portal',
    description: 'AI-powered job matching for job seekers and employers',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

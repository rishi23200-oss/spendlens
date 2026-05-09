import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SpendLens — Free AI Spend Audit for Startups",
  description: "Find out exactly where your team is overpaying for AI tools.",
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
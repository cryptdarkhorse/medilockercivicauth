import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { CivicAuthProvider } from "./providers/civic-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Medilocker - Secure Medical Records",
  description: "Empowering patients with full ownership of their health records",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CivicAuthProvider>{children}</CivicAuthProvider>
      </body>
    </html>
  )
}

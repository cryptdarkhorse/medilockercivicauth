import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientProviders from "./ClientProviders"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Medilocker - Secure Medical Records",
  description: "Empowering patients with full ownership of their health records",
  generator: "Naman Jain",
  icons:{
    icon:"./medilocker.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
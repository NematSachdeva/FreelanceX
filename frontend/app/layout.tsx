import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import ToastProvider from "@/components/ToastProvider"

export const metadata: Metadata = {
  title: "FreelanceX - Find Top Freelancers",
  description: "Connect with talented freelancers for your next project. Browse services, hire experts, and get work done.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
            <ToastProvider />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}

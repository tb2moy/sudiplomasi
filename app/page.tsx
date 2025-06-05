"use client"

import { CountrySelection } from "@/components/country-selection"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const handleCountrySelect = (country: any) => {
    console.log("Selected country:", country)
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="flex min-h-screen flex-col items-center justify-between">
        <CountrySelection onCountrySelect={handleCountrySelect} />
      </main>
    </ThemeProvider>
  )
}
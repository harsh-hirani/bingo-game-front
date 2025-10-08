'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  // Wraps your app with next-themes provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

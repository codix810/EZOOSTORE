'use client';

import { ThemeProvider } from 'next-themes';

export default function ThemeProviderClient({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}

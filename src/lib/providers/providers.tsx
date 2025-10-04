'use client';

import type React from 'react';

import { AuthProvider } from '@/lib/contexts/auth-context';
import { ThemeProvider } from '@/lib/contexts/theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

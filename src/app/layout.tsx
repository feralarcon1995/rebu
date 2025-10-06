//SERVER COMPONENT - Maneja la estructura global de la aplicación
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/lib/providers/providers';
import type { Metadata } from 'next';
import type React from 'react';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rebu - Administrador de Empleados',
  description:
    'Administra y organiza la información de tus empleados de manera eficiente con Rebu.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Suspense
            fallback={
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900" />
            }
          >
            {children}
          </Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

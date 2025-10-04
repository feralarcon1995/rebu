import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/lib/providers/providers';
import type { Metadata } from 'next';
import type React from 'react';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rebu - Administrador de Empleados - Dashboard',
  description: 'Administra y organiza la información de tus empleados de manera eficiente con Rebu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

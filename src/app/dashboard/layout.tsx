// Server Component - Se ejecuta en el servidor para mejor SEO y performance inicial
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rebu - Dashboard',
  description: 'Panel de administración para la gestión de empleados',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function DashboardServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { EmployeeSkeleton } from '@/components/employees/employee-skeleton';
import { EmployeeTable } from '@/components/employees/employee-table';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/lib/hooks/use-employees';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { employees, stats, isLoading, error } = useEmployees({
    autoLoad: true,
  });

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar estadísticas de empleados');
    }
  }, [error]);

  const recentEmployees = employees.slice(0, 5);

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 text-center"
        >
          <h1 className="text-text-primary text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary">
            Resumen general de empleados y estadísticas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsCards
            totalEmployees={stats.total}
            activeEmployees={stats.active}
            onLeaveEmployees={stats.onLeave}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          aria-labelledby="recent-employees-title"
        >
          <Card className="bg-background/80 border-surface-secondary shadow-lg backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle
                  id="recent-employees-title"
                  className="flex items-center gap-3 text-xl sm:text-2xl"
                >
                  <div className="from-primary to-primary-dark flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                    <Users className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                  Empleados Recientes
                </CardTitle>
                <p className="text-text-secondary mt-1 text-sm sm:text-base">
                  {recentEmployees.length > 0
                    ? `Mostrando ${recentEmployees.length} de ${stats.total} empleados`
                    : 'No hay empleados registrados'}
                </p>
              </div>
              <Link href="/employees">
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  Ver Todos los Empleados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <EmployeeSkeleton />
              ) : recentEmployees.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="bg-surface/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Users className="text-text-secondary h-8 w-8" />
                  </div>
                  <p className="text-text-secondary mb-4">
                    No hay empleados registrados
                  </p>
                  <Link href="/employees">
                    <Button>
                      Agregar Primer Empleado
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <EmployeeTable
                  employees={recentEmployees}
                  showActions={false}
                />
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </DashboardLayout>
  );
}

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Briefcase, Clock, UserCheck, Users } from 'lucide-react';

interface StatsCardsProps {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  isLoading?: boolean;
}

export function StatsCards({
  totalEmployees,
  activeEmployees,
  onLeaveEmployees,
  isLoading = false,
}: StatsCardsProps) {
  return (
    <motion.div
      className="flex w-full justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="from-background via-surface to-surface-secondary border-surface-secondary relative w-full overflow-hidden bg-gradient-to-br shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="from-primary/10 to-primary-dark/5 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br"></div>
        <div className="from-primary-dark/10 to-primary/5 absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-tr"></div>
        <div className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full bg-gradient-to-br from-green-500/5 to-green-600/5"></div>

        <CardContent className="relative z-0 p-4 sm:p-6">
          <div className="block lg:hidden">
            <div className="mb-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className="from-primary to-primary-dark flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br">
                  <Briefcase className="h-3 w-3 text-white" />
                </div>
                <h1 className="text-text-primary text-base font-bold">
                  Gestión de Empleados
                </h1>
              </div>
              <p className="text-text-secondary text-xs">
                Panel completo de RRHH
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="from-primary to-primary-dark mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <p className="text-text-secondary mb-1 text-xs font-medium">
                  Total
                </p>
                {isLoading ? (
                  <Skeleton className="mx-auto h-4 w-8" />
                ) : (
                  <p className="text-text-primary text-base font-bold">
                    {totalEmployees}
                  </p>
                )}
              </div>

              <div className="text-center">
                <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-600">
                  <UserCheck className="h-4 w-4 text-white" />
                </div>
                <p className="text-text-secondary mb-1 text-xs font-medium">
                  Activos
                </p>
                {isLoading ? (
                  <Skeleton className="mx-auto h-4 w-8" />
                ) : (
                  <p className="text-text-primary text-base font-bold">
                    {activeEmployees}
                  </p>
                )}
              </div>

              <div className="text-center">
                <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-yellow-500 to-yellow-600">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <p className="text-text-secondary mb-1 text-xs font-medium">
                  Licencia
                </p>
                {isLoading ? (
                  <Skeleton className="mx-auto h-4 w-8" />
                ) : (
                  <p className="text-text-primary text-base font-bold">
                    {onLeaveEmployees}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <div className="from-primary to-primary-dark flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-text-primary text-2xl font-bold">
                      Gestión de Empleados
                    </h1>
                    <p className="text-text-secondary text-sm">
                      Panel completo de RRHH
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <div className="from-primary to-primary-dark mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-text-secondary text-xs font-medium">
                    Total
                  </p>
                  {isLoading ? (
                    <Skeleton className="mx-auto h-6 w-12" />
                  ) : (
                    <p className="text-text-primary text-xl font-bold">
                      {totalEmployees}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-text-secondary text-xs font-medium">
                    Activos
                  </p>
                  {isLoading ? (
                    <Skeleton className="mx-auto h-6 w-12" />
                  ) : (
                    <p className="text-text-primary text-xl font-bold">
                      {activeEmployees}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-text-secondary text-xs font-medium">
                    En Licencia
                  </p>
                  {isLoading ? (
                    <Skeleton className="mx-auto h-6 w-12" />
                  ) : (
                    <p className="text-text-primary text-xl font-bold">
                      {onLeaveEmployees}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

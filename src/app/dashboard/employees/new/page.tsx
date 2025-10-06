'use client';

import { EmployeeForm } from '@/components/employees/employee-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/lib/hooks/use-employees';
import type { EmployeeFormSchema } from '@/lib/validations/employee';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function NewEmployeePage() {
  const router = useRouter();
  const { createEmployee, isLoading } = useEmployees({ autoLoad: false });

  const handleSubmit = async (data: EmployeeFormSchema) => {
    try {
      const employeeData = {
        ...data,
        phone: data.phone || '',
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: data.emergencyPhone || '',
        notes: data.notes || '',
      };

      await createEmployee(employeeData);
      toast.success('Empleado creado exitosamente');
      router.push('/dashboard/employees');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear empleado';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/employees');
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="bg-primary/5 dark:bg-primary/10 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%)' }}
        />
        <div
          className="bg-primary/5 dark:bg-primary/10 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            clipPath: 'polygon(50% 20%, 100% 0, 100% 100%, 0 100%, 0 0)',
          }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        <motion.header variants={cardVariants}>
          <Card className="border-border relative overflow-hidden shadow-sm">
            <div
              className="from-primary/10 via-primary/5 absolute top-0 right-0 h-full w-64 bg-gradient-to-l to-transparent"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 40% 100%)' }}
            />

            <CardContent className="relative p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/dashboard/employees" className="sm:order-first">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Volver a lista</span>
                    </Button>
                  </Link>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <UserPlus className="text-primary h-6 w-6" />
                    </div>

                    <div>
                      <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                        Nuevo Empleado
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        Agrega un nuevo empleado al sistema
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.header>

        <motion.section variants={cardVariants}>
          <Card className="border-border relative overflow-hidden">
            <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
            <CardHeader>
              <CardTitle className="text-foreground">
                Información del Empleado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                mode="create"
              />
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </main>
  );
}

'use client';

import { EmployeeForm } from '@/components/employees/employee-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/lib/hooks/use-employees';
import type { Employee } from '@/lib/types/employee';
import type {
  Country,
  Department,
  EmployeeFormSchema,
} from '@/lib/validations/employee';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, UserCog } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EmployeeFormSkeleton from '../../../../../components/employees/employee-form-skeleton';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const { getEmployeeById, updateEmployee, isLoading } = useEmployees({
    autoLoad: false,
  });

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employeeData = await getEmployeeById(employeeId);
        if (employeeData) {
          setEmployee(employeeData);
        } else {
          toast.error('Empleado no encontrado');
          router.push('/dashboard/employees');
        }
      } catch {
        toast.error('Error al cargar empleado');
        router.push('/dashboard/employees');
      }
    };

    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId, getEmployeeById, router]);

  const handleSubmit = async (data: EmployeeFormSchema) => {
    try {
      await updateEmployee(employeeId, data);
      toast.success('Empleado actualizado exitosamente');
      router.push(`/dashboard/employees/${employeeId}`);
    } catch {
      toast.error('Error al actualizar empleado');
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/employees/${employeeId}`);
  };

  const getInitialData = (employee: Employee): Partial<EmployeeFormSchema> => {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.address,
      city: employee.city,
      country: employee.country as Country,
      department: employee.department as Department,
      position: employee.position,
      salary: employee.salary,
      startDate: employee.startDate,
      status: employee.status,
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      notes: employee.notes || '',
    };
  };

  if (isLoading) {
    return <EmployeeFormSkeleton />;
  }

  if (!employee) return null;

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
                  <Link
                    href={`/dashboard/employees/${employeeId}`}
                    className="sm:order-first"
                  >
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        Volver al detalle
                      </span>
                    </Button>
                  </Link>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <UserCog className="text-primary h-6 w-6" />
                    </div>

                    <div>
                      <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                        Editar Empleado
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        {employee.firstName} {employee.lastName}
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
                initialData={getInitialData(employee)}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                mode="edit"
                employeeId={employeeId}
              />
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </main>
  );
}

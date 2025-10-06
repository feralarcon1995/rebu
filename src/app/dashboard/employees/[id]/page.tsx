'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/lib/hooks/use-employees';
import type { Employee } from '@/lib/types/employee';
import {
  formatDate,
  formatSalary,
  getCountryName,
  getStatusColor,
  getStatusText,
} from '@/lib/utils/employee-utils';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

interface InfoItemProps {
  label: string;
  value: string;
  subvalue?: string;
}

const InfoItem = ({ label, value, subvalue }: InfoItemProps) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    {subvalue && (
      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
        {subvalue}
      </p>
    )}
  </div>
);

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const { getEmployeeById, isLoading } = useEmployees({ autoLoad: false });

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

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
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
                    <div className="from-primary to-primary/70 relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
                      <div
                        className="absolute inset-0 bg-white/10"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 70%)',
                        }}
                      />
                      <span className="relative z-10">
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </span>
                    </div>

                    <div>
                      <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                        {employee.firstName} {employee.lastName}
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        {employee.position}
                      </p>
                      <Badge
                        className={`${getStatusColor(employee.status)} mt-2`}
                      >
                        {getStatusText(employee.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    router.push(`/dashboard/employees/${employee.id}/edit`)
                  }
                  className="w-full gap-2 sm:w-auto"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.header>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.section variants={cardVariants}>
            <Card className="border-border relative h-full overflow-hidden">
              <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <User className="text-primary h-5 w-5" />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
                  <InfoItem label="Email" value={employee.email} />
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
                  <InfoItem label="Teléfono" value={employee.phone} />
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
                  <InfoItem
                    label="Ubicación"
                    value={`${employee.city}, ${getCountryName(employee.country)}`}
                    subvalue={employee.address}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={cardVariants}>
            <Card className="border-border relative h-full overflow-hidden">
              <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Building className="text-primary h-5 w-5" />
                  </div>
                  Información Laboral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Departamento" value={employee.department} />
                  <InfoItem label="Cargo" value={employee.position} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Fecha de Ingreso"
                    value={formatDate(employee.startDate)}
                  />
                  <InfoItem
                    label="Salario"
                    value={formatSalary(employee.salary)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={cardVariants}>
            <Card className="border-border relative h-full overflow-hidden">
              <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Shield className="text-primary h-5 w-5" />
                  </div>
                  Contacto de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem label="Nombre" value={employee.emergencyContact} />
                <InfoItem label="Teléfono" value={employee.emergencyPhone} />
              </CardContent>
            </Card>
          </motion.section>

          <motion.section variants={cardVariants}>
            <Card className="border-border relative h-full overflow-hidden">
              <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  Notas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employee.notes ? (
                  <p className="text-foreground leading-relaxed">
                    {employee.notes}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No hay notas adicionales
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.section>
        </div>

        <motion.footer variants={cardVariants}>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="font-medium">Creado:</span>{' '}
                  {formatDate(employee.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Actualizado:</span>{' '}
                  {formatDate(employee.updatedAt)}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {employee.id}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.footer>
      </motion.div>
    </main>
  );
}

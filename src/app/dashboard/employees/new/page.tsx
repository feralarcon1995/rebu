'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCalendar } from '@/components/ui/CustomCalendar';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAsyncEmailValidation } from '@/lib/hooks/use-async-email-validation';
import { useEmployees } from '@/lib/hooks/use-employees';
import { useFormDraft } from '@/lib/hooks/use-form-draft';

import { TypedSelect } from '@/components/ui/TypedSelect';
import { countryOptions, departmentOptions } from '@/lib/utils/employee-utils';
import {
  employeeSchema,
  type Country,
  type Department,
  type EmployeeFormSchema,
} from '@/lib/validations/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NewEmployeePage() {
  const router = useRouter();
  const { createEmployee, isLoading } = useEmployees({ autoLoad: false });
  const { validateEmailAsync, isValidating } = useAsyncEmailValidation();
  const { loadDraft, clearDraft, startAutoSave, stopAutoSave } =
    useFormDraft<EmployeeFormSchema>({
      key: 'new_employee',
    });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [emailAsyncError, setEmailAsyncError] = useState<string | undefined>();

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const previousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: undefined,
      startDate: '',
      salary: 800,
      country: undefined,
      city: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
      status: 'active',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    control,
  } = form;

  const watchedEmail = watch('email');
  const watchedStartDate = watch('startDate');

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setValue('startDate', format(date, 'yyyy-MM-dd'));
    },
    [setValue]
  );

  useEffect(() => {
    if (watchedStartDate && watchedStartDate !== '') {
      const date = new Date(watchedStartDate + 'T00:00:00');
      setSelectedDate(date);
    }
  }, [watchedStartDate]);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        setValue(key as keyof EmployeeFormSchema, value);
      });
      toast.info('Se ha recuperado un borrador guardado');
    }
  }, [loadDraft, setValue]);

  useEffect(() => {
    if (isDirty) {
      startAutoSave(() => watch());
    } else {
      stopAutoSave();
    }

    return () => stopAutoSave();
  }, [isDirty, startAutoSave, stopAutoSave, watch]);

  useEffect(() => {
    if (watchedEmail && watchedEmail.endsWith('@empresa.com')) {
      const timeoutId = setTimeout(async () => {
        const error = await validateEmailAsync(watchedEmail);
        setEmailAsyncError(error);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setEmailAsyncError(undefined);
    }
  }, [watchedEmail, validateEmailAsync]);

  const onSubmit = useCallback(
    async (data: EmployeeFormSchema) => {
      try {
        const emailError = await validateEmailAsync(data.email);
        if (emailError) {
          setEmailAsyncError(emailError);
          toast.error(emailError);
          return;
        }

        const employeeData = {
          ...data,
          phone: data.phone || '',
          emergencyContact: data.emergencyContact || '',
          emergencyPhone: data.emergencyPhone || '',
          notes: data.notes || '',
        };

        await createEmployee(employeeData);
        clearDraft();
        reset();
        toast.success('Empleado creado exitosamente');
        router.push('/dashboard/employees');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al crear empleado';
        toast.error(errorMessage);
      }
    },
    [validateEmailAsync, createEmployee, clearDraft, reset, router]
  );

  const isSubmitDisabled =
    !isValid || !!emailAsyncError || isValidating || isLoading;

  return (
    <DashboardLayout>
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard/employees">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a lista
              </Button>
            </Link>
            <div>
              <h1 className="text-text-primary text-3xl font-bold">
                Nuevo Empleado
              </h1>
              <p className="text-text-secondary">
                Agrega un nuevo empleado al sistema
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="bg-background/80 border-surface-secondary shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="text-primary h-5 w-5" />
                    Información del Empleado
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        {...form.register('firstName')}
                        placeholder="Ingrese el nombre"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        {...form.register('lastName')}
                        placeholder="Ingrese el apellido"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="nombre@empresa.com"
                      className={
                        errors.email || emailAsyncError ? 'border-red-500' : ''
                      }
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                    {emailAsyncError && (
                      <p className="text-sm text-red-500">{emailAsyncError}</p>
                    )}
                    {isValidating && (
                      <p className="text-sm text-blue-500">
                        Validando email...
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2 space-y-2">
                      <Label htmlFor="department">Departamento *</Label>
                      <TypedSelect<Department>
                        value={watch('department')}
                        onValueChange={(value: Department) =>
                          setValue('department', value)
                        }
                        options={departmentOptions}
                        placeholder="Seleccione departamento"
                        error={!!errors.department}
                      />
                      {errors.department && (
                        <p className="text-sm text-red-500">
                          {errors.department.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 space-y-2">
                      <Label htmlFor="position">Cargo *</Label>
                      <Input
                        id="position"
                        {...form.register('position')}
                        placeholder="Ingrese el cargo"
                        className={
                          errors.position ? 'h-full border-red-500' : 'h-full'
                        }
                      />
                      {errors.position && (
                        <p className="text-sm text-red-500">
                          {errors.position.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <CustomCalendar
                        control={control}
                        name="startDate"
                        label="Fecha de Ingreso"
                        placeholder="Seleccionar fecha de ingreso"
                        days={days}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        currentMonth={currentMonth}
                        nextMonth={nextMonth}
                        previousMonth={previousMonth}
                      />
                    </div>

                    <div className="flex flex-col gap-2 space-y-2">
                      <Label htmlFor="salary">Salario Mensual (USD) *</Label>
                      <Input
                        id="salary"
                        type="number"
                        min={800}
                        max={10000}
                        {...form.register('salary', { valueAsNumber: true })}
                        placeholder="800"
                        className="[&::-moz-appearance:textfield] h-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      {errors.salary && (
                        <p className="text-sm text-red-500">
                          {errors.salary.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2 space-y-2">
                      <Label htmlFor="country">País *</Label>
                      <TypedSelect<Country>
                        value={watch('country')}
                        onValueChange={(value: Country) =>
                          setValue('country', value)
                        }
                        options={countryOptions}
                        placeholder="Seleccione país"
                        error={!!errors.country}
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        {...form.register('city')}
                        placeholder="Ingrese la ciudad"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono (Opcional)</Label>
                      <Input
                        id="phone"
                        {...form.register('phone')}
                        placeholder="+503 1234-5678"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        {...form.register('address')}
                        placeholder="Ingrese la dirección"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Contacto de Emergencia (Opcional)
                      </Label>
                      <Input
                        id="emergencyContact"
                        {...form.register('emergencyContact')}
                        placeholder="Nombre del contacto"
                        className={
                          errors.emergencyContact ? 'border-red-500' : ''
                        }
                      />
                      {errors.emergencyContact && (
                        <p className="text-sm text-red-500">
                          {errors.emergencyContact.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">
                        Teléfono de Emergencia (Opcional)
                      </Label>
                      <Input
                        id="emergencyPhone"
                        {...form.register('emergencyPhone')}
                        placeholder="+503 1234-5678"
                        className={
                          errors.emergencyPhone ? 'border-red-500' : ''
                        }
                      />
                      {errors.emergencyPhone && (
                        <p className="text-sm text-red-500">
                          {errors.emergencyPhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Textarea
                      id="notes"
                      {...form.register('notes')}
                      placeholder="Notas adicionales..."
                      className={errors.notes ? 'border-red-500' : ''}
                      rows={3}
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-500">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Link href="/dashboard/employees">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Guardando...' : 'Crear Empleado'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </motion.div>
      </main>
    </DashboardLayout>
  );
}

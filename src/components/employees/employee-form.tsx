'use client';

import { Button } from '@/components/ui/button';
import { CustomCalendar } from '@/components/ui/CustomCalendar';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TypedSelect } from '@/components/ui/TypedSelect';
import { useAsyncEmailValidation } from '@/lib/hooks/use-async-email-validation';
import { useFormDraft } from '@/lib/hooks/use-form-draft';
import {
  countryOptions,
  departmentOptions,
  statusOptions,
} from '@/lib/utils/employee-utils';
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
import { Save } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormSchema>;
  onSubmit: (data: EmployeeFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  employeeId?: string;
}

export function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
  employeeId,
}: EmployeeFormProps) {
  const { validateEmailAsync, isValidating } = useAsyncEmailValidation();
  const { loadDraft, clearDraft, startAutoSave, stopAutoSave } =
    useFormDraft<EmployeeFormSchema>({
      key: mode === 'edit' ? `edit_employee_${employeeId}` : 'new_employee',
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
      ...initialData,
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
    if (mode === 'create') {
      const draft = loadDraft();
      if (draft) {
        Object.entries(draft).forEach(([key, value]) => {
          setValue(key as keyof EmployeeFormSchema, value);
        });
        toast.info('Se ha recuperado un borrador guardado');
      }
    }
  }, [loadDraft, setValue, mode]);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof EmployeeFormSchema, value);
        }
      });
    }
  }, [initialData, setValue, mode]);

  useEffect(() => {
    if (mode === 'create' && isDirty) {
      startAutoSave(() => watch());
    } else {
      stopAutoSave();
    }

    return () => stopAutoSave();
  }, [isDirty, startAutoSave, stopAutoSave, watch, mode]);

  useEffect(() => {
    if (watchedEmail && watchedEmail.endsWith('@empresa.com')) {
      const timeoutId = setTimeout(async () => {
        const error = await validateEmailAsync(
          watchedEmail,
          mode === 'edit' ? employeeId : undefined
        );
        setEmailAsyncError(error);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setEmailAsyncError(undefined);
    }
  }, [watchedEmail, validateEmailAsync, mode, employeeId]);

  const handleFormSubmit = useCallback(
    async (data: EmployeeFormSchema) => {
      try {
        const emailError = await validateEmailAsync(
          data.email,
          mode === 'edit' ? employeeId : undefined
        );
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

        await onSubmit(employeeData);

        if (mode === 'create') {
          clearDraft();
          reset();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} empleado`;
        toast.error(errorMessage);
      }
    },
    [validateEmailAsync, onSubmit, clearDraft, reset, mode, employeeId]
  );

  const isSubmitDisabled =
    (mode === 'create' && !isValid) ||
    !!emailAsyncError ||
    isValidating ||
    isLoading;

  const inputClasses =
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100';
  const inputErrorClasses =
    'bg-white dark:bg-gray-800 border-red-500 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100';

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre *
            </Label>
            <Input
              id="firstName"
              {...form.register('firstName')}
              placeholder="Ingrese el nombre"
              className={errors.firstName ? inputErrorClasses : inputClasses}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Apellido *
            </Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              placeholder="Ingrese el apellido"
              className={errors.lastName ? inputErrorClasses : inputClasses}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Email Corporativo *
          </Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="nombre@empresa.com"
            className={
              errors.email || emailAsyncError ? inputErrorClasses : inputClasses
            }
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          {emailAsyncError && (
            <p className="text-sm text-red-500">{emailAsyncError}</p>
          )}
          {isValidating && (
            <p className="text-sm text-blue-500">Validando email...</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="department"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Departamento *
            </Label>
            <div className="rounded-md border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
              <TypedSelect<Department>
                value={watch('department')}
                onValueChange={(value: Department) =>
                  setValue('department', value)
                }
                options={departmentOptions}
                placeholder="Seleccione departamento"
                error={!!errors.department}
                disabled={isLoading}
              />
            </div>
            {errors.department && (
              <p className="text-sm text-red-500">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="position"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Cargo *
            </Label>
            <Input
              id="position"
              {...form.register('position')}
              placeholder="Ingrese el cargo"
              className={
                errors.position
                  ? `${inputErrorClasses} h-full`
                  : `${inputClasses} h-full`
              }
              disabled={isLoading}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
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
            <Label
              htmlFor="salary"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Salario Mensual (USD) *
            </Label>
            <Input
              id="salary"
              type="number"
              min={800}
              max={10000}
              {...form.register('salary', { valueAsNumber: true })}
              placeholder="800"
              className={`${
                inputClasses
              } [&::-moz-appearance:textfield] h-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              disabled={isLoading}
            />
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="country"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              País *
            </Label>
            <div className="rounded-md border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
              <TypedSelect<Country>
                value={watch('country')}
                onValueChange={(value: Country) => setValue('country', value)}
                options={countryOptions}
                placeholder="Seleccione país"
                error={!!errors.country}
                disabled={isLoading}
              />
            </div>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="city"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Ciudad *
            </Label>
            <Input
              id="city"
              {...form.register('city')}
              placeholder="Ingrese la ciudad"
              className={errors.city ? inputErrorClasses : inputClasses}
              disabled={isLoading}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="phone"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Teléfono (Opcional)
            </Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="+503 1234-5678"
              className={errors.phone ? inputErrorClasses : inputClasses}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="address"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Dirección *
            </Label>
            <Input
              id="address"
              {...form.register('address')}
              placeholder="Ingrese la dirección"
              className={errors.address ? inputErrorClasses : inputClasses}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="emergencyContact"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Contacto de Emergencia (Opcional)
            </Label>
            <Input
              id="emergencyContact"
              {...form.register('emergencyContact')}
              placeholder="Nombre del contacto"
              className={
                errors.emergencyContact ? inputErrorClasses : inputClasses
              }
              disabled={isLoading}
            />
            {errors.emergencyContact && (
              <p className="text-sm text-red-500">
                {errors.emergencyContact.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 space-y-2">
            <Label
              htmlFor="emergencyPhone"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Teléfono de Emergencia (Opcional)
            </Label>
            <Input
              id="emergencyPhone"
              {...form.register('emergencyPhone')}
              placeholder="+503 1234-5678"
              className={
                errors.emergencyPhone ? inputErrorClasses : inputClasses
              }
              disabled={isLoading}
            />
            {errors.emergencyPhone && (
              <p className="text-sm text-red-500">
                {errors.emergencyPhone.message}
              </p>
            )}
          </div>
        </div>

        {mode === 'edit' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2 space-y-2">
              <Label
                htmlFor="status"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Estado *
              </Label>
              <div className="rounded-md border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
                <TypedSelect<'active' | 'inactive' | 'on-leave'>
                  value={watch('status')}
                  onValueChange={(value: 'active' | 'inactive' | 'on-leave') =>
                    setValue('status', value)
                  }
                  options={statusOptions}
                  placeholder="Seleccione estado"
                  error={!!errors.status}
                  disabled={isLoading}
                />
              </div>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 space-y-2">
          <Label
            htmlFor="notes"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            Notas (Opcional)
          </Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            placeholder="Notas adicionales..."
            className={
              errors.notes ? inputErrorClasses : `${inputClasses} resize-none`
            }
            rows={3}
            disabled={isLoading}
          />
          {errors.notes && (
            <p className="text-sm text-red-500">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-600">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? mode === 'edit'
                ? 'Actualizando...'
                : 'Guardando...'
              : mode === 'edit'
                ? 'Actualizar Empleado'
                : 'Crear Empleado'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

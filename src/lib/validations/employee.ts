import { z } from 'zod';

export const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
  'Design',
] as const;

export const countries = [
  'AR',
  'US',
  'MX',
  'BR',
  'ES',
  'CO',
  'CL',
  'PE',
  'UY',
  'SV',
  'EC',
  'SA',
] as const;

export type Department = (typeof departments)[number];
export type Country = (typeof countries)[number];

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  lastName: z
    .string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(50, 'El apellido no puede superar los 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),

  email: z
    .string()
    .email('Correo electrónico inválido')
    .refine(
      email => email.endsWith('@empresa.com'),
      'El correo debe terminar en @empresa.com'
    )
    .toLowerCase(),

  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]+$/, 'Formato de teléfono inválido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),

  position: z
    .string()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(100, 'El cargo no puede superar los 100 caracteres'),

  department: z.enum(departments, {
    message: 'Seleccione un departamento válido',
  }),

  startDate: z.string().refine(date => {
    const d = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(d.getTime()) && d >= today;
  }, 'La fecha de ingreso no puede ser anterior a hoy'),

  salary: z
    .number()
    .min(800, 'El salario debe ser al menos $800')
    .max(10000, 'El salario no puede superar $10,000'),

  country: z.enum(countries, {
    message: 'Seleccione un país válido',
  }),

  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede superar los 100 caracteres'),

  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede superar los 200 caracteres'),

  emergencyContact: z
    .string()
    .min(2, 'El contacto de emergencia debe tener al menos 2 caracteres')
    .max(100, 'El contacto de emergencia no puede superar los 100 caracteres')
    .optional()
    .or(z.literal('')),

  emergencyPhone: z
    .string()
    .regex(/^\+?[0-9\s\-()]+$/, 'Formato de teléfono de emergencia inválido')
    .min(10, 'El teléfono de emergencia debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),

  notes: z
    .string()
    .max(500, 'Las notas no pueden superar los 500 caracteres')
    .optional()
    .or(z.literal('')),

  status: z.enum(['active', 'inactive', 'on-leave'], {
    message: 'Seleccione un estado válido',
  }),
});

export type EmployeeFormSchema = z.infer<typeof employeeSchema>;

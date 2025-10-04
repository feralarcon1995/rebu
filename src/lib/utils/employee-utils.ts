import type { Employee } from '@/lib/types/employee';

export const getStatusColor = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-500/40 dark:from-green-700/30 dark:to-green-600/30 dark:text-green-300 dark:border-green-500/50';
    case 'inactive':
      return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-500/40 dark:from-red-700/30 dark:to-red-600/30 dark:text-red-300 dark:border-red-500/50';
    case 'on-leave':
      return 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 text-yellow-700 border-yellow-400/40 dark:from-yellow-600/30 dark:to-yellow-500/30 dark:text-yellow-300 dark:border-yellow-500/50';
    default:
      return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border-gray-300 dark:from-gray-700/30 dark:to-gray-600/30 dark:text-gray-300 dark:border-gray-500/50';
  }
};

export const getStatusText = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'inactive':
      return 'Inactivo';
    case 'on-leave':
      return 'En Licencia';
    default:
      return status;
  }
};

export const formatSalary = (salary: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(salary);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const countriesList = [
  { code: 'AR', name: 'Argentina' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'MX', name: 'México' },
  { code: 'BR', name: 'Brasil' },
  { code: 'ES', name: 'España' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'SA', name: 'Arabia Saudita' },
];

import type { Employee } from '@/lib/types/employee';

export const getStatusColor = (status: Employee['status']) => {
  switch (status) {
    case 'active':
      return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-500/40';
    case 'inactive':
      return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-500/40';
    case 'on-leave':
      return 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 text-yellow-700 border-yellow-400/40';
    default:
      return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border-gray-300';
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

'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Employee } from '@/lib/types/employee';
import {
  formatDate,
  formatSalary,
  getStatusColor,
  getStatusText,
} from '@/lib/utils/employee-utils';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function EmployeeTable({
  employees,
  onDelete,
  showActions = true,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <motion.div
        className="border-surface-secondary bg-background/50 rounded-xl border py-12 text-center backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-text-secondary">No se encontraron empleados</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="border-surface-secondary bg-background/80 overflow-hidden border shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table className="overflow-hidden">
        <TableHeader>
          <TableRow className="from-surface to-surface-secondary bg-gradient-to-r">
            <TableHead className="text-text-primary font-semibold">
              Nombre
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Email
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Posición
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Departamento
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Fecha de Inicio
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Salario
            </TableHead>
            <TableHead className="text-text-primary font-semibold">
              Estado
            </TableHead>
            {showActions && (
              <TableHead className="text-text-primary text-right font-semibold">
                Acciones
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <motion.tr
              key={employee.id}
              className="hover:bg-surface-secondary/50 cursor-pointer transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TableCell className="text-text-primary font-semibold">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell className="text-text-secondary">
                {employee.email}
              </TableCell>
              <TableCell className="text-text-primary">
                {employee.position}
              </TableCell>
              <TableCell className="text-text-primary">
                {employee.department}
              </TableCell>
              <TableCell className="text-text-primary">
                {formatDate(employee.startDate)}
              </TableCell>
              <TableCell className="text-text-primary font-medium">
                {formatSalary(employee.salary)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(employee.status)} font-medium`}
                >
                  {getStatusText(employee.status)}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary h-8 w-8 cursor-pointer p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary-dark/10 hover:text-primary-dark h-8 w-8 cursor-pointer p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </motion.div>
                    {onDelete && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 cursor-pointer p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => onDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </TableCell>
              )}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}

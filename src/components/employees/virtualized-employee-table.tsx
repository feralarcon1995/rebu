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
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface VirtualizedEmployeeTableProps {
  employees: Employee[];
  onDelete?: (id: string) => void;
  showActions?: boolean;
  height?: number;
}

const HEADER_HEIGHT = 56;
const ROW_HEIGHT = 57;

export function VirtualizedEmployeeTable({
  employees,
  onDelete,
  showActions = true,
  height = 600,
}: VirtualizedEmployeeTableProps) {
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const handleViewEmployee = (id: string) => {
    router.push(`/dashboard/employees/${id}`);
  };

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
      <div className="overflow-x-auto">
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
                Departamento
              </TableHead>
              <TableHead className="text-text-primary font-semibold">
                Fecha Ingreso
              </TableHead>
              <TableHead className="text-text-primary font-semibold">
                País
              </TableHead>
              <TableHead className="text-text-primary font-semibold">
                Estado
              </TableHead>
              <TableHead className="text-text-primary font-semibold">
                Salario
              </TableHead>
              {showActions && (
                <TableHead className="text-text-primary text-right font-semibold">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
        </Table>

        <div
          ref={parentRef}
          style={{
            height: `${height - HEADER_HEIGHT}px`,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <Table className="overflow-hidden">
              <TableBody>
                {virtualizer.getVirtualItems().map(virtualItem => {
                  const employee = employees[virtualItem.index];

                  return (
                    <motion.tr
                      key={virtualItem.key}
                      className="hover:bg-surface-secondary/50 cursor-pointer transition-all duration-200"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: virtualItem.index * 0.05,
                      }}
                      onClick={() => handleViewEmployee(employee.id)}
                    >
                      <TableCell className="text-text-primary font-semibold">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {employee.email}
                      </TableCell>
                      <TableCell className="text-text-primary">
                        {employee.department}
                      </TableCell>
                      <TableCell className="text-text-primary">
                        {formatDate(employee.startDate)}
                      </TableCell>
                      <TableCell className="text-text-primary">
                        {employee.country || 'No especificado'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(employee.status)} border font-medium`}
                        >
                          {getStatusText(employee.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-primary font-medium">
                        {formatSalary(employee.salary)}
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
                                onClick={e => {
                                  e.stopPropagation();
                                  handleViewEmployee(employee.id);
                                }}
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
                                onClick={e => {
                                  e.stopPropagation();
                                  router.push(
                                    `/dashboard/employees/${employee.id}/edit`
                                  );
                                }}
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
                                  onClick={e => {
                                    e.stopPropagation();
                                    onDelete(employee.id);
                                  }}
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

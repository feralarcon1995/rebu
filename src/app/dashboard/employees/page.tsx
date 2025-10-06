'use client';

import { DeleteEmployeeDialog } from '@/components/employees/delete-employee-dialog';
import { EmployeeFiltersComponent } from '@/components/employees/employee-filters';
import { EmployeeSkeleton } from '@/components/employees/employee-skeleton';
import { EmployeeTable } from '@/components/employees/employee-table';
import { Pagination } from '@/components/employees/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useEmployees } from '@/lib/hooks/use-employees';
import { usePagination } from '@/lib/hooks/use-pagination';
import { useVirtualization } from '@/lib/hooks/use-virtualization';
import type { Employee, EmployeeFilters } from '@/lib/types/employee';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    department: 'all',
    countries: [],
    status: 'all',
    sortBy: 'firstName',
    sortOrder: 'asc',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(filters.search, 400);

  const { employees, isLoading, error, filterEmployees, deleteEmployee } =
    useEmployees({ autoLoad: false });

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(employees, 10);

  const { shouldVirtualize } = useVirtualization(pageSize, {
    threshold: 50,
  });

  const displayedEmployees = shouldVirtualize ? employees : paginatedItems;

  useEffect(() => {
    const filtersWithDebouncedSearch = {
      ...filters,
      search: debouncedSearch,
    };

    filterEmployees(filtersWithDebouncedSearch)
      .then(filteredEmployees => {
        if (filteredEmployees.length > 0) {
          toast.success(
            `${filteredEmployees.length} empleados cargados exitosamente`
          );
        }
      })
      .catch(() => {
        toast.error('Error al cargar empleados');
      });
  }, [filters, debouncedSearch, filterEmployees]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDeleteClick = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setEmployeeToDelete(employee);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    const employeeId = employeeToDelete.id;
    const employeeName = `${employeeToDelete.firstName} ${employeeToDelete.lastName}`;

    setDeleteDialogOpen(false);

    startTransition(async () => {
      try {
        await deleteEmployee(employeeId);
        toast.success(`Empleado ${employeeName} eliminado exitosamente`);
      } catch {
        toast.error(`Error al eliminar empleado ${employeeName}`);
      }
    });

    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-500 text-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:border-green-300 dark:bg-green-100/10 dark:text-green-200 dark:hover:bg-green-200/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-text-primary text-3xl font-bold">
                Lista de Empleados
              </h1>
              <p className="text-text-secondary">
                Administra y organiza la información de tus empleados
              </p>
            </div>
          </div>
          <Link href="/dashboard/employees/new">
            <Button className="bg-primary hover:bg-primary-dark flex items-center gap-2 text-white">
              <Plus className="h-4 w-4" />
              Nuevo Empleado
            </Button>
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-labelledby="employees-title"
        >
          <Card className="bg-background/80 border-surface-secondary shadow-lg backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle
                id="employees-title"
                className="flex items-center gap-3 text-xl sm:text-2xl"
              >
                <div className="from-primary to-primary-dark flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                  <Users className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                Directorio de Empleados
              </CardTitle>
              <p className="text-text-secondary text-sm sm:text-base">
                {employees.length}{' '}
                {employees.length === 1
                  ? 'empleado encontrado'
                  : 'empleados encontrados'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <EmployeeFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
              />

              {isLoading && employees.length === 0 ? (
                <EmployeeSkeleton />
              ) : employees.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="bg-surface/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Users className="text-text-secondary h-8 w-8" />
                  </div>
                  <p className="text-text-secondary mb-4">
                    No se encontraron empleados
                  </p>
                  <Link href="/dashboard/employees/new">
                    <Button>
                      Crear Primer Empleado
                      <Plus className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <EmployeeTable
                    employees={displayedEmployees}
                    onDelete={handleDeleteClick}
                    height={shouldVirtualize ? 600 : undefined}
                  />
                  {!shouldVirtualize && totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={employees.length}
                      onPageChange={goToPage}
                      onPageSizeChange={changePageSize}
                      hasNextPage={hasNextPage}
                      hasPreviousPage={hasPreviousPage}
                    />
                  )}
                  {shouldVirtualize && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-text-secondary text-sm">
                          Mostrando todos los {employees.length} empleados
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePageSize(10)}
                        >
                          Volver a Paginación Normal
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employee={employeeToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isPending={isPending}
      />
    </>
  );
}

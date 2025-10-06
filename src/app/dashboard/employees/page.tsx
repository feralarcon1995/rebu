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
    <div className="min-h-screen w-full overflow-x-hidden">
      <main className="container mx-auto min-h-screen w-full space-y-4 p-4 sm:space-y-6 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-4 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center">
            <Link href="/dashboard" className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-500 text-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:border-green-300 dark:bg-green-100/10 dark:text-green-200 dark:hover:bg-green-200/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver al Dashboard</span>
                <span className="sm:hidden">Volver</span>
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-text-primary truncate text-xl font-bold sm:text-2xl lg:text-3xl">
                Lista de Empleados
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Administra y organiza la información de tus empleados
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Link href="/dashboard/employees/new">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary-dark flex w-full items-center gap-2 text-white sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Empleado</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-labelledby="employees-title"
          className="w-full"
        >
          <Card className="border-surface-secondary bg-background/80 w-full shadow-lg backdrop-blur-sm">
            <CardHeader className="space-y-2 p-4 sm:p-6">
              <CardTitle
                id="employees-title"
                className="flex items-center gap-3 text-base sm:text-lg lg:text-xl"
              >
                <div className="from-primary to-primary-dark flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br sm:h-8 sm:w-8">
                  <Users
                    className="h-3 w-3 text-white sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                </div>
                <span className="truncate">Directorio de Empleados</span>
              </CardTitle>
              <p className="text-text-secondary text-xs sm:text-sm">
                {employees.length}{' '}
                {employees.length === 1
                  ? 'empleado encontrado'
                  : 'empleados encontrados'}
              </p>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
              <div className="w-full">
                <EmployeeFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>

              {isLoading && employees.length === 0 ? (
                <EmployeeSkeleton />
              ) : employees.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="bg-surface/50 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16">
                    <Users className="text-text-secondary h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <p className="text-text-secondary mb-4 text-sm sm:text-base">
                    No se encontraron empleados
                  </p>
                  <Link href="/dashboard/employees/new">
                    <Button className="w-full sm:w-auto" size="sm">
                      Crear Primer Empleado
                      <Plus className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="w-full overflow-x-auto rounded-lg border">
                    <div className="min-w-full">
                      <EmployeeTable
                        employees={displayedEmployees}
                        onDelete={handleDeleteClick}
                        height={shouldVirtualize ? 600 : undefined}
                      />
                    </div>
                  </div>
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
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-text-secondary text-xs sm:text-sm">
                          Mostrando todos los {employees.length} empleados
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePageSize(10)}
                          className="w-full sm:w-auto"
                        >
                          <span className="hidden sm:inline">
                            Volver a Paginación Normal
                          </span>
                          <span className="sm:hidden">Paginación Normal</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
    </div>
  );
}

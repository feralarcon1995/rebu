'use client';

import { employeeService } from '@/lib/services/employee-service';
import type {
  Employee,
  EmployeeFilters,
  EmployeeFormData,
} from '@/lib/types/employee';
import { useCallback, useEffect, useState } from 'react';

interface UseEmployeesOptions {
  autoLoad?: boolean;
  filters?: EmployeeFilters;
}

export function useEmployees(options: UseEmployeesOptions = {}) {
  const { autoLoad = true, filters } = options;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize service
  useEffect(() => {
    employeeService.initialize();
  }, []);

  // Load all employees
  const loadAllEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener empleados';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter employees
  const filterEmployees = useCallback(
    async (searchFilters: EmployeeFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await employeeService.filterEmployees(searchFilters);
        setEmployees(data);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al filtrar empleados';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get employee by ID
  const getEmployeeById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const employee = await employeeService.getEmployeeById(id);
      return employee;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener empleado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create employee
  const createEmployee = useCallback(async (data: EmployeeFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newEmployee = await employeeService.createEmployee(data);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear empleado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update employee
  const updateEmployee = useCallback(
    async (id: string, data: Partial<EmployeeFormData>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedEmployee = await employeeService.updateEmployee(id, data);
        setEmployees(prev =>
          prev.map(emp => (emp.id === id ? updatedEmployee : emp))
        );
        return updatedEmployee;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al actualizar empleado';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete employee
  const deleteEmployee = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar empleado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if email exists
  const checkEmailExists = useCallback(
    async (email: string, excludeId?: string) => {
      try {
        return await employeeService.checkEmailExists(email, excludeId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al verificar email';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      if (filters) {
        filterEmployees(filters);
      } else {
        loadAllEmployees();
      }
    }
  }, [autoLoad, filters, filterEmployees, loadAllEmployees]);

  // Calculate stats
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    onLeave: employees.filter(emp => emp.status === 'on-leave').length,
  };

  return {
    // Data
    employees,
    stats,
    isLoading,
    error,

    // Actions
    loadAllEmployees,
    filterEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    checkEmailExists,

    // Utilities
    refetch: loadAllEmployees,
    clearError: () => setError(null),
  };
}

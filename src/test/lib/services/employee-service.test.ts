import { employeeService } from '@/lib/services/employee-service';
import type { EmployeeFilters, EmployeeFormData } from '@/lib/types/employee';
import { beforeEach, describe, expect, it } from 'vitest';

describe('employeeService', () => {
  beforeEach(async () => {
    const existing = await employeeService.getAllEmployees();
    for (const e of existing) {
      await employeeService.deleteEmployee(e.id);
    }
  });

  it('getAllEmployees devuelve lista inicial', async () => {
    // Semilla: crear un empleado válido
    const seed: EmployeeFormData = {
      firstName: 'Seed',
      lastName: 'User',
      email: 'seed.user@empresa.com',
      phone: '',
      position: 'QA',
      department: 'Engineering',
      startDate: '2025-12-01',
      salary: 900,
      status: 'active',
      address: 'Calle 0',
      city: 'Madrid',
      country: 'ES',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
    };
    await employeeService.createEmployee(seed);

    const all = await employeeService.getAllEmployees();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('create/update/delete y checkEmailExists funcionan', async () => {
    const payload: EmployeeFormData = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada.lovelace@empresa.com',
      phone: '',
      position: 'Engineer',
      department: 'Engineering',
      startDate: '2025-12-01',
      salary: 1000,
      status: 'active',
      address: 'Calle falsa 123',
      city: 'Buenos Aires',
      country: 'AR',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
    };
    const newEmp = await employeeService.createEmployee(payload);

    expect(newEmp.id).toBeTruthy();

    expect(await employeeService.checkEmailExists('ada.lovelace@empresa.com')).toBe(true);
    expect(await employeeService.checkEmailExists('nope@empresa.com')).toBe(false);

    const updated = await employeeService.updateEmployee(newEmp.id, {
      salary: 2000,
      status: 'on-leave',
    });
    expect(updated.salary).toBe(2000);
    expect(updated.status).toBe('on-leave');

    await employeeService.deleteEmployee(newEmp.id);
    const afterDelete = await employeeService.getEmployeeById(newEmp.id);
    expect(afterDelete).toBeNull();
  });

  it('filterEmployees filtra por search, department, countries y sort', async () => {
    // Crear datos de prueba controlados
    const a: EmployeeFormData = {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@empresa.com',
      phone: '',
      position: 'Engineer',
      department: 'Engineering',
      startDate: '2025-12-01',
      salary: 1500,
      status: 'active',
      address: 'Calle 1',
      city: 'Madrid',
      country: 'ES',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
    };
    const b: EmployeeFormData = {
      firstName: 'Bruno',
      lastName: 'Pérez',
      email: 'bruno.perez@empresa.com',
      phone: '',
      position: 'Designer',
      department: 'Design',
      startDate: '2025-12-01',
      salary: 1200,
      status: 'active',
      address: 'Calle 2',
      city: 'Barcelona',
      country: 'AR',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
    };
    await employeeService.createEmployee(a);
    await employeeService.createEmployee(b);

    const bySearch = await employeeService.filterEmployees({ search: 'Ana' } as EmployeeFilters);
    expect(bySearch.every(e => e.firstName.includes('Ana'))).toBe(true);

    const byDept = await employeeService.filterEmployees({ department: 'Design' } as EmployeeFilters);
    expect(byDept.every(e => e.department === 'Design')).toBe(true);

    const byCountry = await employeeService.filterEmployees({ countries: ['ES'] } as EmployeeFilters);
    expect(byCountry.every(e => e.country === 'ES')).toBe(true);

    const sortedAsc = await employeeService.filterEmployees({ sortBy: 'firstName', sortOrder: 'asc' } as EmployeeFilters);
    const sortedDesc = await employeeService.filterEmployees({ sortBy: 'firstName', sortOrder: 'desc' } as EmployeeFilters);
    expect(sortedAsc.length).toBeGreaterThan(0);
    expect(sortedDesc.length).toBe(sortedAsc.length);
  });
});



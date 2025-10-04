import { mockEmployees } from '@/lib/data/mock-employees';
import type {
  Employee,
  EmployeeFilters,
  EmployeeFormData,
} from '@/lib/types/employee';

class EmployeeService {
  private employees: Employee[] = [];
  private initialized = false;
  private static instance: EmployeeService = new EmployeeService();

  public static getInstance(): EmployeeService {
    return EmployeeService.instance;
  }

  public initialize(): void {
    if (!this.initialized) {
      this.employees = [...mockEmployees];
      this.initialized = true;
    }
  }

  public async getAllEmployees(): Promise<Employee[]> {
    await this.delay(300);
    return [...this.employees];
  }

  public async getEmployeeById(id: string): Promise<Employee | null> {
    await this.delay(200);
    return this.employees.find(emp => emp.id === id) || null;
  }

  public async createEmployee(data: EmployeeFormData): Promise<Employee> {
    await this.delay(500);

    const newEmployee: Employee = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.employees.push(newEmployee);
    return newEmployee;
  }

  public async updateEmployee(
    id: string,
    data: Partial<EmployeeFormData>
  ): Promise<Employee> {
    await this.delay(500);

    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Empleado no encontrado');
    }

    this.employees[index] = {
      ...this.employees[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.employees[index];
  }

  public async deleteEmployee(id: string): Promise<void> {
    await this.delay(300);

    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Empleado no encontrado');
    }

    this.employees.splice(index, 1);
  }

  public async checkEmailExists(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    await this.delay(400);

    return this.employees.some(
      emp =>
        emp.email.toLowerCase() === email.toLowerCase() && emp.id !== excludeId
    );
  }

  public async filterEmployees(filters: EmployeeFilters): Promise<Employee[]> {
    await this.delay(300);

    let filtered = [...this.employees];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        emp =>
          emp.firstName.toLowerCase().includes(searchLower) ||
          emp.lastName.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.department.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    if (filters.countries && filters.countries.length > 0) {
      filtered = filtered.filter(
        emp => emp.country && filters.countries!.includes(emp.country)
      );
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }

  private generateId(): string {
    return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const employeeService = EmployeeService.getInstance();

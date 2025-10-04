export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export type Department =
  | 'Engineering'
  | 'Marketing'
  | 'Sales'
  | 'Human Resources'
  | 'Finance'
  | 'Operations'
  | 'Customer Support'
  | 'Product'
  | 'Design';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: Department;
  startDate: string;
  salary: number;
  status: EmployeeStatus;
  address: string;
  city: string;
  country: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;

export interface EmployeeFilters {
  search?: string;
  department?: Department | 'all';
  countries?: string[];
  status?: EmployeeStatus | 'all';
  sortBy?: 'firstName' | 'lastName' | 'startDate' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

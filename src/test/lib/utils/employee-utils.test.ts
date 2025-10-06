import type { Department } from '@/lib/types/employee';
import {
  formatDate,
  formatSalary,
  getCountryLabel,
  getCountryName,
  getDepartmentLabel
} from '@/lib/utils/employee-utils';
import type { Country } from '@/lib/validations/employee';
import { describe, expect, it } from 'vitest';

describe('employee-utils', () => {
  it('formatSalary da formato USD sin decimales', () => {
    expect(formatSalary(1234)).toBe('$1,234');
  });

  it('formatDate convierte ISO a dd/mm/yyyy', () => {
    expect(formatDate('2024-05-09T12:00:00')).toBe('09/05/2024');
  });

  it('getCountryName usa lista conocida', () => {
    expect(getCountryName('AR')).toBe('Argentina');
    expect(getCountryName('ZZ')).toBe('ZZ');
  });

  it('getCountryLabel y getDepartmentLabel devuelven etiquetas', () => {
    const c: Country = 'AR';
    const d: Department = 'Engineering';
    expect(getCountryLabel(c)).toBe('Argentina');
    expect(getDepartmentLabel(d)).toBe('Ingeniería');
  });
});



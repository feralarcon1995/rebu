'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EmployeeFilters } from '@/lib/types/employee';
import { countriesList } from '@/lib/utils/employee-utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  onFiltersChange: (filters: EmployeeFilters) => void;
}

function CountryMultiSelect({
  selectedCountries = [],
  onCountriesChange,
}: {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleCountryToggle = (countryName: string) => {
    const isSelected = selectedCountries.includes(countryName);
    if (isSelected) {
      onCountriesChange(selectedCountries.filter(c => c !== countryName));
    } else {
      onCountriesChange([...selectedCountries, countryName]);
    }
  };

  const clearAllCountries = () => {
    onCountriesChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCountries.length === 0
            ? 'Seleccionar países...'
            : selectedCountries.length === 1
              ? selectedCountries[0]
              : `${selectedCountries.length} países seleccionados`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Países</span>
            {selectedCountries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllCountries}
                className="h-6 text-xs"
              >
                Limpiar
              </Button>
            )}
          </div>
          <div className="max-h-[200px] space-y-1 overflow-y-auto">
            {countriesList.map(country => (
              <div
                key={country.code}
                className="hover:bg-accent flex cursor-pointer items-center space-x-2 rounded-sm p-1"
                onClick={() => handleCountryToggle(country.name)}
              >
                <Checkbox
                  checked={selectedCountries.includes(country.name)}
                  onChange={() => handleCountryToggle(country.name)}
                />
                <span className="text-sm">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DesktopFilters({ filters, onFiltersChange }: EmployeeFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    (filters.department && filters.department !== 'all') ||
    (filters.countries && filters.countries.length > 0) ||
    (filters.status && filters.status !== 'all') ||
    filters.sortBy !== 'firstName' ||
    filters.sortOrder !== 'asc';

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      department: 'all',
      countries: [],
      status: 'all',
      sortBy: 'firstName',
      sortOrder: 'asc',
    });
  };

  const clearFilter = (filterKey: keyof EmployeeFilters) => {
    const defaultValues: Partial<EmployeeFilters> = {
      search: '',
      department: 'all',
      countries: [],
      status: 'all',
      sortBy: 'firstName',
      sortOrder: 'asc',
    };
    onFiltersChange({ ...filters, [filterKey]: defaultValues[filterKey] });
  };

  return (
    <section className="hidden md:block" aria-label="Filtros de empleados">
      <div
        className="flex items-center gap-3"
        role="group"
        aria-label="Opciones de filtrado"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por nombre, email o departamento..."
            value={filters.search || ''}
            onChange={e =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
            aria-label="Buscar empleados"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => clearFilter('search')}
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Select
            value={filters.department || 'all'}
            onValueChange={value =>
              onFiltersChange({
                ...filters,
                department: value as EmployeeFilters['department'],
              })
            }
          >
            <SelectTrigger
              aria-label="Filtrar por departamento"
              className="w-[160px]"
            >
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Departamentos</SelectItem>
              <SelectItem value="Engineering">Ingeniería</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Ventas</SelectItem>
              <SelectItem value="Human Resources">Recursos Humanos</SelectItem>
              <SelectItem value="Finance">Finanzas</SelectItem>
              <SelectItem value="Operations">Operaciones</SelectItem>
              <SelectItem value="Customer Support">
                Atención al Cliente
              </SelectItem>
              <SelectItem value="Product">Producto</SelectItem>
              <SelectItem value="Design">Diseño</SelectItem>
            </SelectContent>
          </Select>
          {filters.department && filters.department !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => clearFilter('department')}
              aria-label="Limpiar departamento"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <CountryMultiSelect
            selectedCountries={filters.countries || []}
            onCountriesChange={countries =>
              onFiltersChange({ ...filters, countries })
            }
          />
          {filters.countries && filters.countries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => clearFilter('countries')}
              aria-label="Limpiar países"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Select
            value={filters.status || 'all'}
            onValueChange={value =>
              onFiltersChange({
                ...filters,
                status: value as EmployeeFilters['status'],
              })
            }
          >
            <SelectTrigger
              aria-label="Filtrar por estado"
              className="w-[120px]"
            >
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
              <SelectItem value="on-leave">En Licencia</SelectItem>
            </SelectContent>
          </Select>
          {filters.status && filters.status !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => clearFilter('status')}
              aria-label="Limpiar estado"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={filters.sortBy || 'firstName'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              sortBy: value as EmployeeFilters['sortBy'],
            })
          }
        >
          <SelectTrigger aria-label="Ordenar por" className="w-[120px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firstName">Nombre</SelectItem>
            <SelectItem value="lastName">Apellido</SelectItem>
            <SelectItem value="startDate">Fecha de Inicio</SelectItem>
            <SelectItem value="salary">Salario</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder || 'asc'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              sortOrder: value as EmployeeFilters['sortOrder'],
            })
          }
        >
          <SelectTrigger
            aria-label="Orden de clasificación"
            className="w-[120px]"
          >
            <SelectValue placeholder="Orden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascendente</SelectItem>
            <SelectItem value="desc">Descendente</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2"
            onClick={clearAllFilters}
            aria-label="Limpiar todos los filtros"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Selected Countries Display */}
      {filters.countries && filters.countries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {filters.countries.map(country => (
            <Badge key={country} variant="secondary" className="gap-1 text-xs">
              {country}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    countries:
                      filters.countries?.filter(c => c !== country) || [],
                  })
                }
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

function MobileFilters({ filters, onFiltersChange }: EmployeeFiltersProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasActiveFilters =
    filters.search ||
    (filters.department && filters.department !== 'all') ||
    (filters.countries && filters.countries.length > 0) ||
    (filters.status && filters.status !== 'all') ||
    filters.sortBy !== 'firstName' ||
    filters.sortOrder !== 'asc';

  const activeFiltersCount = [
    filters.search,
    filters.department && filters.department !== 'all',
    filters.countries && filters.countries.length > 0,
    filters.status && filters.status !== 'all',
    filters.sortBy !== 'firstName',
    filters.sortOrder !== 'asc',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      department: 'all',
      countries: [],
      status: 'all',
      sortBy: 'firstName',
      sortOrder: 'asc',
    });
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] bg-black/50"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.3,
            }}
            className="bg-background fixed right-0 bottom-0 left-0 z-[99999] rounded-t-xl border-t shadow-lg"
          >
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-muted-foreground h-8 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Limpiar todo
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Departamento</label>
                  <Select
                    value={filters.department || 'all'}
                    onValueChange={value =>
                      onFiltersChange({
                        ...filters,
                        department: value as EmployeeFilters['department'],
                      })
                    }
                  >
                    <SelectTrigger aria-label="Filtrar por departamento">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todos los Departamentos
                      </SelectItem>
                      <SelectItem value="Engineering">Ingeniería</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Ventas</SelectItem>
                      <SelectItem value="Human Resources">
                        Recursos Humanos
                      </SelectItem>
                      <SelectItem value="Finance">Finanzas</SelectItem>
                      <SelectItem value="Operations">Operaciones</SelectItem>
                      <SelectItem value="Customer Support">
                        Atención al Cliente
                      </SelectItem>
                      <SelectItem value="Product">Producto</SelectItem>
                      <SelectItem value="Design">Diseño</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Países</label>
                  <CountryMultiSelect
                    selectedCountries={filters.countries || []}
                    onCountriesChange={countries =>
                      onFiltersChange({ ...filters, countries })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={value =>
                      onFiltersChange({
                        ...filters,
                        status: value as EmployeeFilters['status'],
                      })
                    }
                  >
                    <SelectTrigger aria-label="Filtrar por estado">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los Estados</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="on-leave">En Licencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <Select
                    value={filters.sortBy || 'firstName'}
                    onValueChange={value =>
                      onFiltersChange({
                        ...filters,
                        sortBy: value as EmployeeFilters['sortBy'],
                      })
                    }
                  >
                    <SelectTrigger aria-label="Ordenar por">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firstName">Nombre</SelectItem>
                      <SelectItem value="lastName">Apellido</SelectItem>
                      <SelectItem value="startDate">Fecha de Inicio</SelectItem>
                      <SelectItem value="salary">Salario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Orden</label>
                  <Select
                    value={filters.sortOrder || 'asc'}
                    onValueChange={value =>
                      onFiltersChange({
                        ...filters,
                        sortOrder: value as EmployeeFilters['sortOrder'],
                      })
                    }
                  >
                    <SelectTrigger aria-label="Orden de clasificación">
                      <SelectValue placeholder="Orden" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascendente</SelectItem>
                      <SelectItem value="desc">Descendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <section className="space-y-4 md:hidden" aria-label="Filtros de empleados">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por nombre, email o departamento..."
            value={filters.search || ''}
            onChange={e =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
            aria-label="Buscar empleados"
          />
        </div>

        <Button
          variant="outline"
          className="relative gap-2"
          aria-label="Abrir filtros"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {mounted &&
        typeof window !== 'undefined' &&
        createPortal(modalContent, document.body)}
    </section>
  );
}

export function EmployeeFiltersComponent({
  filters,
  onFiltersChange,
}: EmployeeFiltersProps) {
  return (
    <>
      <DesktopFilters filters={filters} onFiltersChange={onFiltersChange} />
      <MobileFilters filters={filters} onFiltersChange={onFiltersChange} />
    </>
  );
}

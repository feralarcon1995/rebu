'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useTheme } from '@/lib/contexts/theme-context';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="from-background via-surface to-surface-secondary flex min-h-screen bg-gradient-to-br">
        <div className="flex max-h-full min-h-screen w-full flex-col">
          <header className="border-surface-secondary sticky top-0 z-1 w-full border-b shadow-lg backdrop-blur-md">
            <nav className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
              <div className="hidden lg:block" />
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="hidden max-w-[150px] text-right sm:block lg:max-w-none">
                  <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-surface to-surface-secondary flex min-h-screen bg-gradient-to-br">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex max-h-full min-h-screen w-full flex-col md:flex-1">
        <header className="border-surface-secondary sticky top-0 z-1 w-full border-b shadow-lg backdrop-blur-md">
          <nav className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="bg-surface/80 border-surface-secondary hover:bg-surface/90 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl sm:h-10 sm:w-10 sm:rounded-xl lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="text-text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="hidden max-w-[150px] text-right sm:block lg:max-w-none">
                <p className="text-text-primary truncate text-sm font-semibold">
                  {user?.name}
                </p>
                <p className="text-text-secondary truncate text-xs">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="bg-surface/80 border-surface-secondary hover:bg-surface/90 dark:hover:bg-surface/30 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl sm:h-10 sm:w-10 sm:rounded-xl"
                aria-label={
                  theme === 'dark'
                    ? 'Cambiar a tema claro'
                    : 'Cambiar a tema oscuro'
                }
              >
                {theme === 'dark' ? (
                  <Sun className="text-text-primary h-4 w-4" />
                ) : (
                  <Moon className="text-text-primary h-4 w-4" />
                )}
              </button>

              <button
                onClick={logout}
                className="bg-surface/80 border-surface-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl sm:h-10 sm:w-10 sm:rounded-xl"
                aria-label="Cerrar sesión"
              >
                <LogOut className="text-text-primary h-4 w-4" />
              </button>
            </div>
          </nav>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

'use client';

import Rebusm from '@/components/icons/rebusm';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Empleados', href: '/dashboard/employees', icon: Users },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-2 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`from-primary-darker to-primary-dark fixed top-0 left-0 z-2 h-full w-64 bg-gradient-to-b sm:w-72 lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:translate-x-0 xl:w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex max-h-full min-h-screen flex-col transition-transform duration-300 ease-in-out`}
        aria-label="Navegación principal"
      >
        <header className="border-primary/20 flex shrink-0 items-center justify-between border-b p-3.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-3"
            onClick={handleLinkClick}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm sm:h-10 sm:w-10 sm:rounded-xl"
              aria-hidden="true"
            >
              <Rebusm color="white" className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-lg font-bold text-white sm:text-xl">Rebu</h1>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 text-white hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </header>

        <nav
          className="flex-1 space-y-1 overflow-y-auto p-3 sm:space-y-2 sm:p-4"
          aria-label="Navegación del panel"
        >
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href} onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className={`h-11 w-full justify-start gap-2 text-left text-sm sm:h-12 sm:gap-3 sm:text-base ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <footer className="border-primary/20 shrink-0 border-t p-3 sm:p-4">
          <div className="text-center text-xs text-white/60 sm:text-sm">
            <p className="font-medium">Rebu Dashboard</p>
            <p className="mt-0.5 text-[10px] sm:text-xs">v1.0.0</p>
          </div>
        </footer>
      </aside>
    </>
  );
}

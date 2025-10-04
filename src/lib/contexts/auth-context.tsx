'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    email: 'admin@rebuhr.com',
    password: 'password123',
    name: 'Usuario Admin',
    role: 'admin' as const,
  },
];

// Función para validar token
const validateAuthToken = (): boolean => {
  if (typeof document === 'undefined') return false;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie =>
    cookie.trim().startsWith('auth_token=')
  );

  return authCookie?.includes('authenticated') || false;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('auth_user');
      const hasValidToken = validateAuthToken();

      if (storedUser && hasValidToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error al parsear el usuario almacenado:', error);
          localStorage.removeItem('auth_user');
          document.cookie = 'auth_token=; path=/; max-age=0';
        }
      } else if (storedUser && !hasValidToken) {
        localStorage.removeItem('auth_user');
      } else if (!storedUser && hasValidToken) {
        document.cookie = 'auth_token=; path=/; max-age=0';
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Email o contraseña incorrectos');
      }

      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };

      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      const expirationTime = new Date();
      expirationTime.setTime(expirationTime.getTime() + 24 * 60 * 60 * 1000);
      document.cookie = `auth_token=authenticated; path=/; expires=${expirationTime.toUTCString()}; secure; samesite=strict`;

      router.push('/dashboard');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';

    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user && validateAuthToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

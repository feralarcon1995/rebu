'use client';

import Rebusm from '@/components/icons/rebusm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/contexts/auth-context';
import { useTheme } from '@/lib/contexts/theme-context';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="from-background via-surface to-surface-secondary flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={toggleTheme}
          className="bg-surface/80 border-surface-secondary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === 'dark' ? (
            <Sun className="text-text-primary h-5 w-5" />
          ) : (
            <Moon className="text-text-primary h-5 w-5" />
          )}
        </motion.button>
      </motion.div>

      <motion.div
        className="max-w-6xl2 relative mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-2">
          <motion.div
            className="relative hidden flex-col items-center justify-center space-y-8 lg:flex"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              <motion.div
                className="bg-primary/20 absolute -top-4 -right-4 h-24 w-24 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="bg-primary-dark/20 absolute -bottom-4 -left-4 h-32 w-32 rounded-full blur-xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <Image
              src="/rebulogo.png"
              alt="Logo de Rebuhr"
              width={250}
              height={100}
              className="logo-adaptive z-10"
              priority
            />
            <motion.div
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-text-primary text-3xl font-bold">
                Bienvenido a Rebu
              </h2>
              <p className="text-text-secondary max-w-md text-lg">
                Optimiza tus procesos de RRHH con nuestra plataforma integral de
                gestión de empleados
              </p>
            </motion.div>

            <motion.div
              className="bg-primary absolute top-20 left-20 h-4 w-4 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="bg-primary-dark absolute right-20 bottom-20 h-6 w-6 rounded-full"
              animate={{
                y: [0, 20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          <motion.div
            className="mx-auto w-full md:max-w-md lg:mx-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-background/80 border-surface-secondary shadow-lg backdrop-blur-sm">
              <CardHeader className="space-y-6 pb-8 text-center">
                <motion.div
                  className="mb-6 flex justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="from-primary to-primary-dark flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg">
                    <Rebusm color="white" className="h-8 w-8" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <CardTitle className="text-text-primary mb-2 text-3xl font-bold">
                    Iniciar Sesión
                  </CardTitle>
                  <CardDescription className="text-text-secondary text-base">
                    Accede a tu panel de RRHH
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Label
                      htmlFor="email"
                      className="text-text-primary font-medium"
                    >
                      Correo Electrónico
                    </Label>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@empresa.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-surface border-surface-secondary focus:border-primary focus:ring-primary/20 cursor-pointer transition-all duration-200"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Label
                      htmlFor="password"
                      className="text-text-primary font-medium"
                    >
                      Contraseña
                    </Label>
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-surface border-surface-secondary focus:border-primary focus:ring-primary/20 cursor-pointer pr-10 transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-muted hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert
                        variant="destructive"
                        className="border-red-200 bg-red-50"
                      >
                        <AlertDescription className="text-red-800">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker w-full cursor-pointer rounded-xl bg-gradient-to-r py-3 font-semibold text-white shadow-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            className="flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Iniciando sesión...
                          </motion.div>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>

                <motion.div
                  className="from-surface to-surface-secondary border-surface-secondary mt-8 rounded-xl border bg-gradient-to-r p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <p className="text-text-primary mb-3 text-sm font-semibold">
                    Credenciales de demo:
                  </p>
                  <div className="text-text-secondary space-y-2 text-xs">
                    <motion.div
                      className="bg-background/50 hover:bg-background/80 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="font-medium">Usuario: </span>
                      <span>admin@rebuhr.com</span>
                    </motion.div>
                    <motion.div
                      className="bg-background/50 hover:bg-background/80 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="font-medium">Contraseña: </span>
                      <span>password123</span>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

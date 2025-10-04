import { useEmployees } from '@/lib/hooks/use-employees';
import { useCallback, useState } from 'react';

export function useAsyncEmailValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const { checkEmailExists } = useEmployees({ autoLoad: false });

  const validateEmailAsync = useCallback(
    async (email: string, excludeId?: string): Promise<string | undefined> => {
      if (!email || !email.endsWith('@empresa.com')) {
        return undefined;
      }

      setIsValidating(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const exists = await checkEmailExists(email, excludeId);
        if (exists) {
          return 'Este email ya está registrado';
        }
        return undefined;
      } catch {
        return 'Error al validar email';
      } finally {
        setIsValidating(false);
      }
    },
    [checkEmailExists]
  );

  return {
    validateEmailAsync,
    isValidating,
  };
}

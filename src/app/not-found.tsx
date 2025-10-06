// Server Component - Página 404 renderizada en el servidor para mejor SEO

import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div
        className="bg-primary/10 dark:bg-primary/5 absolute top-0 left-0 h-96 w-96"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          transform: 'translate(-20%, -20%)',
        }}
      />

      <div
        className="bg-primary/10 dark:bg-primary/5 absolute right-0 bottom-0 h-[500px] w-[500px]"
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          transform: 'translate(20%, 20%)',
        }}
      />

      <div
        className="bg-primary/5 dark:bg-primary/3 absolute top-1/3 left-1/4 h-64 w-64 animate-[float_6s_ease-in-out_infinite]"
        style={{
          clipPath: 'circle(50% at 50% 50%)',
        }}
      />

      <div
        className="bg-primary/5 dark:bg-primary/3 absolute right-1/4 bottom-1/3 h-48 w-48 animate-[float_8s_ease-in-out_infinite_reverse]"
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />

      <div className="relative z-10 px-4 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/rebulogo.png"
            alt="Logo de Rebuhr"
            width={250}
            height={100}
            className="logo-adaptive"
            priority
          />
        </div>

        <div className="mb-6 inline-block animate-pulse">
          <h1 className="text-primary dark:text-primary text-9xl font-bold">
            404
          </h1>
        </div>

        <h2 className="mb-6 text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Página no encontrada
        </h2>

        <p className="mx-auto mb-10 max-w-md text-lg text-gray-600 dark:text-gray-400">
          La página que buscas no existe o ha sido movida.
        </p>

        <Link
          href="/"
          className="bg-primary hover:bg-primary/90 inline-block rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

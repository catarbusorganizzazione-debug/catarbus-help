"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // const userToken = sessionStorage.getItem('catarbus_token');
        const userStatus = sessionStorage.getItem('catarbus_user');
        
        if (userStatus) {
          // Verifica che il token non sia scaduto (opzionale)
          const user = JSON.parse(userStatus);
          if (user && user.name) {
            setIsAuthenticated(true);
          } else {
            // Token o user non validi, redirect al login
            sessionStorage.removeItem('catarbus_token');
            sessionStorage.removeItem('catarbus_user');
            router.push('/?login=required');
          }
        } else {
          // Nessun token, redirect al login
          router.push('/?login=required');
        }
      } catch (error) {
        // Errore nel parsing, redirect al login
        sessionStorage.removeItem('catarbus_token');
        sessionStorage.removeItem('catarbus_user');
        router.push('/?login=required');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Mostra loading mentre verifica l'autenticazione
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Se non autenticato, non mostra nulla (perché sta già reindirizzando)
  if (!isAuthenticated) {
    return null;
  }

  // Se autenticato, mostra il contenuto protetto
  return <>{children}</>;
}
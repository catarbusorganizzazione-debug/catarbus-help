"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AlertHandlerProps {
  onShowAlert: (message: string) => void;
}

export default function AlertHandler({ onShowAlert }: AlertHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === 'required') {
      onShowAlert('Devi effettuare il login per accedere a questa sezione.');
      // Rimuovi il parametro dall'URL dopo averlo mostrato
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.pathname);
    } else if (searchParams.get('access') === 'denied') {
      onShowAlert('Non hai i permessi necessari per accedere a questa sezione.');
      // Rimuovi il parametro dall'URL dopo averlo mostrato
      const url = new URL(window.location.href);
      url.searchParams.delete('access');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams, onShowAlert]);

  return null;
}
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Classifica from "./components/Classifica";
import LoginForm from "./components/LoginForm";

export default function Home() {
  const searchParams = useSearchParams();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === 'required') {
      setShowLoginAlert(true);
      // Rimuovi il parametro dall'URL dopo averlo mostrato
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.pathname);
    } else if (searchParams.get('access') === 'denied') {
      setShowLoginAlert(true);
      // Rimuovi il parametro dall'URL dopo averlo mostrato
      const url = new URL(window.location.href);
      url.searchParams.delete('access');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Alert per login richiesto */}
          {showLoginAlert && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Accesso richiesto:</strong> {searchParams.get('access') === 'denied' 
                      ? 'Non hai i permessi necessari per accedere a questa sezione.' 
                      : 'Devi effettuare il login per accedere a questa sezione.'}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                      onClick={() => setShowLoginAlert(false)}
                    >
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Benvenuto nel Portale CAT Arbus
            </h1>
            {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Segui in tempo reale i progressi delle squadre e monitora i checkpoint raggiunti 
              durante il gioco. Accedi all'area riservata per gestire l'evento.
            </p> */}
            <div className="mt-6 flex items-center justify-center gap-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Gioco in corso - Aggiornamenti live</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Classifica - 2 colonne */}
            <div className="lg:col-span-2">
              <Classifica />
            </div>
            
            {/* Login Form - 1 colonna */}
            <div>
              <LoginForm />
              
              {/* Info Box */}
              {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">ℹ️ Informazioni</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Aggiornamenti automatici ogni 30 secondi</li>
                  <li>• Classifiche basate sui checkpoint completati</li>
                  <li>• Area admin per gestione squadre</li>
                  <li>• Visualizzazione ottimizzata per mobile</li>
                </ul>
              </div> */}
            </div>
          </div>
          
          {/* Statistics Section */}
          {/* <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📊</span>
              Statistiche di Gioco
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Squadre Attive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600">Checkpoint Totali</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">60%</div>
                <div className="text-sm text-gray-600">Progresso Medio</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Live</div>
                <div className="text-sm text-gray-600">Stato Gioco</div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

import Header from "./components/Header";
import Footer from "./components/Footer";
import Classifica from "./components/Classifica";
import LoginForm from "./components/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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

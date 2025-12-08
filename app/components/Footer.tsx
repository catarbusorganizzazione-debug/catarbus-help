export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <span className="font-bold">CAT Arbus</span>
            </div>
            <p className="text-gray-400 text-sm">
              Portale per il monitoraggio in tempo reale del gioco CAT Arbus. 
              Segui i progressi delle squadre e i checkpoint raggiunti.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Informazioni</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Aggiornamenti in tempo reale</li>
              <li>• Classifiche live</li>
              <li>• Dashboard amministrativa</li>
              <li>• Supporto mobile</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contatti</h3>
            <div className="text-sm text-gray-400">
              <p>Per supporto tecnico o</p>
              <p>assistenza durante il gioco</p>
              <p className="mt-2 text-blue-400">admin@catarbus.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 CAT Arbus. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    
<footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Griglia principale */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonna 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">
                <img
                  src="/logo-CAT-tondo.png"
                  alt="Logo CAT Arbus"
                  className="w-8 h-8"
                />
              </span>
              <h3 className="font-bold">CAT Arbus. Sa Trattativa.</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Portale per il monitoraggio in tempo reale del gioco CAT Arbus.
              <br />
              Segui i progressi delle squadre e i checkpoint raggiunti.
              <br />
              Creato per soli fini ludici e di supporto all&apos;evento.
            </p>
          </div>

          {/* Colonna 2 */}
          <div>
            <h3 className="font-semibold mb-4">Supporto Tecnico</h3>
            <div className="text-sm text-gray-400">
              <p>Per supporto tecnico o assistenza durante il gioco</p>
              <p className="mt-2 text-blue-400">aa@asdhjagfjkhsgkjf.it</p>
            </div>
          </div>

          {/* Colonna 3 */}
          <div>
            <h3 className="font-semibold mb-4">Contatti di emergenza</h3>
            <div className="text-sm text-gray-400">
              <p>
                Per soli fini di emergenza durante il gioco, utilizzare il
                gruppo WhatsApp oppure contattare
              </p>
              <p className="mt-2 text-blue-400">3333333333</p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-white-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 CAT Arbus. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>

  );
}
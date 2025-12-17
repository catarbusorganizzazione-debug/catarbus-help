import Link from "next/link";

export default function Header() {
  return (
    <header className="shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 logoCAT">
            <span>
                <img src='/logo-CAT-tondo.png' alt='Logo CAT Arbus' className='w-8 h-8' />
            </span>
            <div className="title">
              <h1 className="">CAT Arbus</h1>
              <p className="text-sm text-gray-600"><em>Sa Trattativa</em></p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="#classifica" className="text-gray-700 hover:text-blue-600 transition-colors">
              Classifica
            </Link>
            <Link href="/checkpoint" className="text-gray-700 hover:text-blue-600 transition-colors">
              Registra checkpoint
            </Link>
            <Link href="/verify-location" className="text-gray-700 hover:text-blue-600 transition-colors">
              Verifica destinazione
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </nav>
          
          {/* <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div> */}
        </div>
      </div>
    </header>
  );
}
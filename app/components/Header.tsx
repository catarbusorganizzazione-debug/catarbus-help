
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Chiudi su Escape, blocca scroll del body quando open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      // Focus trap minimale quando aperto: limita Tab nel pannello
      if (open && e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement as HTMLElement | null;

          if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", onKey);

    // Blocca scroll del body quando menu aperto
    if (open) {
      document.body.classList.add("overflow-hidden");
      // Porta il focus al primo link del menu
      setTimeout(() => firstLinkRef.current?.focus(), 0);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Chiudi cliccando su overlay o su un link del menu
  const closeMenu = () => setOpen(false);

  return (
    <header className="shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + titolo */}
          <div className="flex items-center gap-3 logoCAT">
            <span>
              <img
                src="/logo-CAT-tondo.png"
                alt="Logo CAT Arbus"
                className="w-8 h-8"
              />
            </span>
            <div className="title">
              <h1 className="font-semibold text-gray-900">CAT Arbus</h1>
              <p className="text-sm text-gray-600">
                <em>Sa Trattativa</em>
              </p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/classifica"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Classifica
            </Link>
            <Link
              href="/checkpoint"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Registra checkpoint
            </Link>
            <Link
              href="/verify-location"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Verifica coordinata
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Icona Hamburger per Mobile */}
          <button
            type="button"
            className="md:hidden text-gray-700 inline-flex items-center justify-center p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen(true)}
            aria-label="Apri menu"
            aria-controls="mobile-menu"
            aria-expanded={open ? "true" : "false"}
          >
            {/* icona hamburger SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Off-canvas mobile */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[80vw] bg-white shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header del pannello */}
        <div className="px-4 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo-CAT-tondo.png"
              alt="Logo CAT Arbus"
              className="w-6 h-6"
            />
            <span className="font-semibold">CAT Arbus</span>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Chiudi menu"
            className="text-gray-700 inline-flex items-center justify-center p-2 rounded hover:bg-gray-100"
          >
            {/* icona close */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Link di navigazione */}
        <nav className="flex flex-col gap-2 px-4 py-3">
          <Link
            href="/"
            ref={firstLinkRef}
            onClick={closeMenu}
            className="px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/classifica"
            onClick={closeMenu}
            className="px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
          >
            Classifica
          </Link>
          <Link
            href="/checkpoint"
            onClick={closeMenu}
            className="px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
          >
            Registra checkpoint
          </Link>
          <Link
            href="/verify-location"
            onClick={closeMenu}
            className="px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
          >
            Verifica coordinata
          </Link>
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="px-3 py-2 rounded text-gray-800 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Overlay: clicca per chiudere */}
      {open && (
        <button
          type="button"
          aria-label="Chiudi menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}
    </header>
   );
  }

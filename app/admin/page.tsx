"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminPage() {
    const router = useRouter();
    const userLevel = localStorage.getItem('catarbus_user') ? JSON.parse(localStorage.getItem('catarbus_user') || '{}').role : null;

    useEffect(() => {
        if (userLevel !== 'admin') {
            // Reindirizza alla home dopo 2 secondi
            setTimeout(() => {
                router.push('/?access=denied');
            }, 2000);
        }
    }, [userLevel, router]);

    if (userLevel !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Accesso non autorizzato. Reindirizzamento...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />

                <main className="flex-1 container mx-auto px-4 py-8">
                    ADMIN
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}

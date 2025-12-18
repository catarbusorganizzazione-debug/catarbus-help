"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import "../components/components.scss";

export default function AdminPage() {
    const router = useRouter();
    const [userLevel, setUserLevel] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Accedi a localStorage solo dopo il mount del componente
        const userStatus = localStorage.getItem('catarbus_user');
        const role = userStatus ? JSON.parse(userStatus).role : null;
        setUserLevel(role);
        setIsLoading(false);

        if (role !== 'admin') {
            // Reindirizza alla home dopo 2 secondi
            setTimeout(() => {
                router.push('/?access=denied');
            }, 2000);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifica permessi...</p>
                </div>
            </div>
        );
    }

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

                <main className="flex-1 container">
                    ADMIN
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}

'use client';

import React, { useState } from 'react';
import { CheckpointRequest, CheckpointResponse, ApiError, LocationRequest } from '../models/Interfaces';
import ApiHelper from '../helpers/ApiHelper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import Classifica from '../components/Classifica';
import "../components/components.scss";

export default function CheckpointPage() {
    const [formData, setFormData] = useState<LocationRequest>({
        username: '',
        provaId: '',
        destination: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [verifiedDestinationCheck, setVerifiedDestinationCheck] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione
        if (!formData.username.trim() || !formData.provaId.trim() || !formData.destination.trim()) {
            setMessage('Tutti i campi sono obbligatori');
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await ApiHelper.verifyLocation(formData);

            if (result.success) {
                setVerifiedDestinationCheck(result.check);
                setMessage(result.message);
                setIsError(false);
                // Reset form dopo successo
                setFormData({
                    username: '',
                    provaId: '',
                    destination: ''
                });
            } else {
                setMessage(result.message);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Errore durante la verifica della location');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen classificaPage">
            <Header />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Classifica />
            </div>
            <Footer />
            </div>
            
        </ProtectedRoute>
    );
}

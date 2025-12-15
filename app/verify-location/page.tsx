'use client';

import React, { useState } from 'react';
import { CheckpointRequest, CheckpointResponse, ApiError } from '../models/Interfaces';
import ApiHelper from '../helpers/ApiHelper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CheckpointPage() {
    const [formData, setFormData] = useState<CheckpointRequest>({
        username: '',
        checkpointId: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState(false);

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
        if (!formData.username.trim() || !formData.checkpointId.trim()) {
            setMessage('Tutti i campi sono obbligatori');
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await ApiHelper.registerCheckpoint(formData);

            if (result.success) {
                setMessage(result.message);
                setIsError(false);
                // Reset form dopo successo
                setFormData({
                    username: '',
                    checkpointId: ''
                });
            } else {
                setMessage(result.message);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Errore durante la registrazione del checkpoint');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Header />
                <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Registra Checkpoint
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Inserisci i dati per registrare un checkpoint
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="username" className="sr-only">
                                    Nome utente
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Nome utente"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label htmlFor="checkpointId" className="sr-only">
                                    ID Checkpoint
                                </label>
                                <input
                                    id="checkpointId"
                                    name="checkpointId"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="ID del checkpoint"
                                    value={formData.checkpointId}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`rounded-md p-4 ${isError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium">
                                            {isError ? 'Errore' : 'Successo'}
                                        </h3>
                                        <div className="mt-2 text-sm">
                                            <p>{message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Registrazione in corso...' : 'Registra Checkpoint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </ProtectedRoute>
    );
}

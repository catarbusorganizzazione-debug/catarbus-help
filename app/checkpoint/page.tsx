'use client';

import React, { useState } from 'react';
import { CheckpointRequest, CheckpointResponse, ApiError } from '../models/Interfaces';
import ApiHelper from '../helpers/ApiHelper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CheckpointPage() {
    // Recupera username dell'utente loggato
    const loggedUsername = typeof window !== 'undefined' ?
        JSON.parse(localStorage.getItem('catarbus_user') || '{}') : {};

    const [formData, setFormData] = useState<CheckpointRequest>({
        username: '',
        checkpointId: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [checkpointContent, setCheckpointContent] = useState<any>(null);

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

                // Mostra popup se ci sono dati aggiuntivi per l'utente loggato
                if (result.data && loggedUsername && result.data) {
                    const userDataContent = result.data;

                    if (userDataContent) {
                        // Salva i dati per il rendering nel componente
                        setCheckpointContent(userDataContent);
                    }
                }

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

    const renderCheckpointContent = () => {
        if (!checkpointContent) return null;

        return (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Materiale Sbloccato</h3>

                {checkpointContent.data && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Contenuto Multimediale:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {checkpointContent.isMessageType && (
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                        <strong>{checkpointContent.message}</strong>
                                    </p>
                                </div>
                            )}
                            {(checkpointContent.isGenericUrl || checkpointContent.isGenericPhoto) && (
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                        <a href={checkpointContent.isGenericUrl ? checkpointContent.url : checkpointContent.photo} target="_blank">CLICCA QUI</a>
                                    </p>
                                </div>
                            )}
                            {(checkpointContent.isSpecificUrl || checkpointContent.isSpecificPhoto) && (
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                        <a href={checkpointContent.data[loggedUsername]} target="_blank">CLICCA QUI</a>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setCheckpointContent(null)}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Chiudi
                </button>
            </div>
        );
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

                    {renderCheckpointContent()}
                </div>
            </div>
            <Footer />
        </ProtectedRoute>
    );
}

'use client';

import React, { useState } from 'react';
import { CheckpointRequest, CheckpointResponse, ApiError, LocationRequest } from '../models/Interfaces';
import ApiHelper from '../helpers/ApiHelper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
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
    const [moreInfo, setMoreInfo] = useState("");

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
                setMoreInfo(result.info || "");
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
            <div className="min-h-screen">
            <Header />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full space-y-8 checkForm rounded-lg ">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Verifica destinazione
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Inserisci i dati per verificare una destinazione<br />
                            (valido solo per le mete oltre il confine del centro abitato, salvo eventuali comunicazioni)
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md -space-y-px">
                            <div className="inputField">
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
                            <div className="inputField">
                                <label htmlFor="provaId" className="sr-only">
                                    ID Prova (lo trovi nel faldone)
                                </label>
                                <input
                                    id="provaId"
                                    name="provaId"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="ID della prova"
                                    value={formData.provaId}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className="inputField">
                                <label htmlFor="destination" className="sr-only">
                                    Destinazione
                                </label>
                                <input
                                    id="destination"
                                    name="destination"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Destinazione"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`rounded-md p-4 ${(isError || !verifiedDestinationCheck) ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium">
                                            {(isError) ? 'Errore' : !verifiedDestinationCheck ? `ALT! Per questa prova non devi andare alla destinazione da te indicata` : `Destinazione confermata per questa prova`}
                                        </h3>
                                        <h5 className="text-sm font-medium">
                                            {(moreInfo) ? `Info aggiuntive: ${moreInfo}` : ``}
                                        </h5>
                                        {isError && <div className="mt-2 text-sm">
                                            <p>{message}</p>
                                        </div>}
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
            </div>
            
        </ProtectedRoute>
    );
}

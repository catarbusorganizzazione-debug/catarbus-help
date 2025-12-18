"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import ApiHelper from "../helpers/ApiHelper";
import { Constants } from "../helpers/Constants";
import { User } from "../models/Interfaces";
import 'bootstrap/dist/css/bootstrap.min.css';
import DateHelper from '../helpers/DateHelper';

export default function AdminPage() {
    const router = useRouter();
    const [userLevel, setUserLevel] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState<User[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);

    useEffect(() => {
        console.log('Admin useEffect triggered');
        
        // Verifica che siamo nel browser prima di accedere a sessionStorage
        if (typeof window === 'undefined') {
            console.log('Window not available, skipping');
            return;
        }

        console.log('Checking sessionStorage...');
        console.log('All sessionStorage keys:', Object.keys(sessionStorage));
        console.log('sessionStorage length:', sessionStorage.length);

        // Accedi a sessionStorage solo dopo il mount del componente
        const userStatus = sessionStorage.getItem('catarbus_user');
        console.log('Admin page - userStatus from sessionStorage:', userStatus);
        
        if (!userStatus) {
            console.log('No user status found, redirecting to login');
            setIsLoading(false);
            router.push('/?login=required');
            return;
        }

        let user;
        try {
            user = JSON.parse(userStatus);
            console.log('Parsed user object:', user);
        } catch (error) {
            console.log('Error parsing user status, redirecting to login');
            // sessionStorage.removeItem('catarbus_user');
            // sessionStorage.removeItem('catarbus_token');
            setIsLoading(false);
            router.push('/?login=required');
            return;
        }

        if (!user) {
            console.log('Invalid user data, redirecting to login');
            // sessionStorage.removeItem('catarbus_user');
            // sessionStorage.removeItem('catarbus_token');
            setIsLoading(false);
            router.push('/?login=required');
            return;
        }
        
        const role = user.role;
        console.log('Admin page - parsed role:', role);
        
        setUserLevel(role);
        setIsLoading(false);

        if (role !== 'admin') {
            console.log('Access denied - role is not admin:', role);
            // Reindirizza alla home dopo 2 secondi
            setTimeout(() => {
                router.push('/?access=denied');
            }, 2000);
        } else {
            console.log('Admin access granted - loading teams');
            // Se è admin, carica le squadre
            loadTeams();
        }
    }, []); // Rimuovo router dalle dependencies per evitare re-render infiniti

    const loadTeams = async () => {
        setLoadingTeams(true);
        try {
            const response = await ApiHelper.getAllUsers();
            if (response.success && response.users) {
                // Filtra solo i team (esclude gli admin)
                const teamUsers = response.users.filter(user => user.role === 'team');
                setTeams(teamUsers);
            } else {
                console.error('Errore nel caricamento delle squadre:', response.message);
            }
        } catch (error) {
            console.error('Errore nel caricamento delle squadre:', error);
        } finally {
            setLoadingTeams(false);
        }
    };

    const receiveTeam = async (username: string, teamName: string) => {
        try {
            console.log(`Ricevendo squadra: ${teamName} (${username})`);
            
            const timestamp = DateHelper.formatDate();
            
            const response = await fetch(`${Constants.API_BASE_URI}/users/editbyusername/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lastHelp: timestamp
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`Squadra ${teamName} ricevuta con successo`);
                // Ricarica i dati per aggiornare la tabella
                await loadTeams();
                alert(`Squadra "${teamName}" ricevuta con successo!`);
            } else {
                console.error('Errore nell\'aggiornamento:', data);
                alert(`Errore nel ricevere la squadra: ${data.message || 'Errore sconosciuto'}`);
            }
        } catch (error) {
            console.error('Errore nella richiesta:', error);
            alert('Errore di connessione. Riprova più tardi.');
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'Non disponibile';
        
        try {
            const date = new Date(dateString);
            // Forza l'interpretazione come ora locale
            const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
            const day = String(localDate.getDate()).padStart(2, '0');
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const year = localDate.getFullYear();
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year}, ${hours}:${minutes}`;
        } catch {
            return 'Non disponibile';
        }
    };

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
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mt-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Pannello Amministratore</h2>
                        <h4 className="mb-3">Gestione Squadre</h4>
                        
                        {loadingTeams ? (
                            <div className="text-center py-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Caricamento...</span>
                                </div>
                                <p className="mt-2">Caricamento squadre...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Nome Squadra</th>
                                            <th scope="col">Checkpoint</th>
                                            <th scope="col">Ultimo Aiuto</th>
                                            <th scope="col">Consegna Ultima Prova</th>
                                            <th scope="col">Checkpoint Intermedio</th>
                                            <th scope="col">Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-4">
                                                    Nessuna squadra trovata
                                                </td>
                                            </tr>
                                        ) : (
                                            teams.map((team) => (
                                                <tr key={team.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div 
                                                                className="rounded-circle me-2"
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    backgroundColor: team.colour || '#gray'
                                                                }}
                                                            ></div>
                                                            {/* <small className="text-muted">{team.colour || 'N/A'}</small> */}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong>{team.name}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {team.checkpointsCompleted || 0}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>{formatDateTime(team.lastHelp)}</small>
                                                    </td>
                                                    <td>
                                                        <small>{formatDateTime(team.lastCheckpoint)}</small>
                                                    </td>
                                                    <td>
                                                        <small>{formatDateTime(team.lastMinorCheckpoint)}</small>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={() => receiveTeam(team.username, team.name)}
                                                            disabled={loadingTeams}
                                                        >
                                                            Ricevi Squadra
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <div className="mt-3">
                            <button 
                                className="btn btn-primary"
                                onClick={loadTeams}
                                disabled={loadingTeams}
                            >
                                {loadingTeams ? 'Aggiornamento...' : 'Aggiorna Dati'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

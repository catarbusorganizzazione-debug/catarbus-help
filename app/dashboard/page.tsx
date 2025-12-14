"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { Nav, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginResponse } from "../models/Interfaces";
import ApiHelper from "../helpers/ApiHelper";

export default function Dashboard() {
    const [activeKey, setActiveKey] = React.useState('1');
    const [currentUserStatus, setCurrentUserStatus] = React.useState<any>(null);
    const [lastCheckpointString, setLastCheckpointString] = React.useState('Non disponibile');
    const [lastHelpString, setLastHelpString] = React.useState('Non disponibile');
    const [calendlyKey, setCalendlyKey] = React.useState(0);

    React.useEffect(() => {
        // Accedi a localStorage solo dopo il mount del componente
        const userStatus = JSON.parse(localStorage.getItem('catarbus_user') || 'null');
        setCurrentUserStatus(userStatus);
    }, []);

    // Effetto separato per la chiamata API quando userStatus è disponibile
    React.useEffect(() => {
        if (currentUserStatus && currentUserStatus.username) {
            ApiHelper.searchUser(currentUserStatus.username).then(result => {
                if (result.success) {
                    console.log('User found:', result.user);
                    setCurrentUserStatus((prev:any) => ({
                        ...prev,
                        checkpointsCompleted: result.user?.checkpointsCompleted,
                        lastMinorCheckpoint: result.user?.lastMinorCheckpoint,
                        lastCheckpoint: result.user?.lastCheckpoint
                    }));
                } else {
                    console.error('User search failed:', result.message);
                }
            });
        }
    }, [currentUserStatus?.username]);

    // Effetto separato per aggiornare le stringhe quando currentUserStatus cambia
    React.useEffect(() => {
        if (currentUserStatus) {
            const lastCheckpoint = currentUserStatus.lastCheckpoint ? (() => {
                // Tratta la stringa come già locale, senza conversioni di fuso orario
                const dateStr = currentUserStatus.lastCheckpoint;
                const date = new Date(dateStr + (dateStr.includes('Z') ? '' : dateStr.includes('+') || dateStr.includes('T') ? '' : 'T00:00:00'));
                // Forza l'interpretazione come ora locale
                const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
                const day = String(localDate.getDate()).padStart(2, '0');
                const month = String(localDate.getMonth() + 1).padStart(2, '0');
                const year = localDate.getFullYear();
                const hours = String(localDate.getHours()).padStart(2, '0');
                const minutes = String(localDate.getMinutes()).padStart(2, '0');
                return `${day}/${month}/${year}, ${hours}:${minutes}`;
            })() : 'Non disponibile';

            const lastHelp = currentUserStatus.lastHelp ? (() => {
                // Tratta la stringa come già locale, senza conversioni di fuso orario
                const dateStr = currentUserStatus.lastHelp;
                const date = new Date(dateStr + (dateStr.includes('Z') ? '' : dateStr.includes('+') || dateStr.includes('T') ? '' : 'T00:00:00'));
                // Forza l'interpretazione come ora locale
                const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
                const day = String(localDate.getDate()).padStart(2, '0');
                const month = String(localDate.getMonth() + 1).padStart(2, '0');
                const year = localDate.getFullYear();
                const hours = String(localDate.getHours()).padStart(2, '0');
                const minutes = String(localDate.getMinutes()).padStart(2, '0');
                return `${day}/${month}/${year}, ${hours}:${minutes}`;
            })() : 'Non disponibile';

            setLastCheckpointString(lastCheckpoint);
            setLastHelpString(lastHelp);
        }
    }, [currentUserStatus]);

    // Forza il re-render del widget Calendly quando si passa al tab 2
    React.useEffect(() => {
        if (activeKey === '2') {
            setCalendlyKey(prev => prev + 1);
        }
    }, [activeKey]);

    const handleSelect = (selectedKey: string | null) => {
        if (selectedKey) {
            setActiveKey(selectedKey);
        }
    };

    const renderTabs = () => {
        return (
            <Nav justify variant="tabs" activeKey={activeKey} onSelect={(handleSelect)}>
                <Nav.Item>
                    <Nav.Link eventKey="1">
                        Info generali
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="2" title="Item">
                        Prenota aiuto
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        )
    }

    const renderSection1 = () => {
        return (
            <div className="mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h5 className="mb-0">Informazioni Utente</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <strong>Nome utente:</strong>
                                    <div className="text-muted">{currentUserStatus?.name}</div>
                                </div>
                                <div className="mb-3">
                                    <strong>Checkpoint superati:</strong>
                                    <div className="text-success fs-4">{currentUserStatus?.checkpointsCompleted}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h5 className="mb-0">Attività Recenti</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <strong>Ultimo indizio ricevuto:</strong>
                                    <div className="text-muted">
                                        {lastHelpString}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Ultima prova ricevuta:</strong>
                                    <div className="text-muted">
                                        {lastCheckpointString}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSection2 = () => {
        const now = new Date();
        const lastHelpTime = currentUserStatus?.lastHelp ? new Date(currentUserStatus.lastHelp) : null;
        const lastCheckpointTime = currentUserStatus?.lastCheckpoint ? new Date(currentUserStatus.lastCheckpoint) : null;

        const lastHelpDiff = lastHelpTime ? (now.getTime() - lastHelpTime.getTime()) / (1000 * 60) : 999; // minuti
        const lastCheckpointDiff = lastCheckpointTime ? (now.getTime() - lastCheckpointTime.getTime()) / (1000 * 60) : 999; // minuti

        const canRequestHelp = lastHelpDiff > 30 && lastCheckpointDiff > 60;

        if (!canRequestHelp) {
            return (
                <div className="mt-4">
                    <div className="alert alert-warning">
                        <h5>Prenotazione aiuto non disponibile</h5>
                        <p>Puoi richiedere aiuto solo se sono passati almeno:</p>
                        <ul>
                            <li>30 minuti dall'ultimo indizio ricevuto {`(${lastHelpString})`}</li>
                            <li>60 minuti dall'ultima prova ricevuta {`(${lastCheckpointString})`}</li>
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div key={calendlyKey} className="mt-4">
                <iframe
                    src="https://calendly.com/catarbus-organizzazione/30min?hide_gdpr_banner=1"
                    width="100%"
                    height="700"
                    frameBorder="0"
                    title="Prenota Aiuto"
                    style={{ minWidth: '320px' }}
                ></iframe>
            </div>
        )
    }



    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />

                <main className="flex-1 container mx-auto px-4 py-8">
                    {renderTabs()}
                    {activeKey === '1' && renderSection1()}
                    {activeKey === '2' && renderSection2()}

                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}

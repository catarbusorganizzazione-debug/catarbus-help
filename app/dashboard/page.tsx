"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { Nav, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginResponse } from "../models/Interfaces";
import ApiHelper from "../helpers/ApiHelper";
import "../components/components.scss";

export default function Dashboard() {
    const [activeKey, setActiveKey] = React.useState('1');
    const [currentUserStatus, setCurrentUserStatus] = React.useState<any>(null);
    const [lastCheckpointString, setLastCheckpointString] = React.useState('Non disponibile');
    const [lastHelpString, setLastHelpString] = React.useState('Non disponibile');
    const [calendlyKey, setCalendlyKey] = React.useState(0);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        // Set client-side flag to prevent SSR issues
        setIsClient(true);
    }, []);

    React.useEffect(() => {
        // Accedi a localStorage solo dopo il mount del componente e quando è client-side
        if (isClient && typeof window !== 'undefined') {
            // const userStatus = JSON.parse(localStorage.getItem('catarbus_user') || 'null');
            // setCurrentUserStatus(userStatus);
            ApiHelper.searchUser(currentUserStatus.username).then(result => {
                if (result.success) {
                    console.log('User found:', result.user);
                    setCurrentUserStatus((prev: any) => ({
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
    }, [isClient]);

    // Effetto separato per la chiamata API quando userStatus è disponibile
    React.useEffect(() => {
        if (currentUserStatus && currentUserStatus.username) {
            ApiHelper.searchUser(currentUserStatus.username).then(result => {
                if (result.success) {
                    console.log('User found:', result.user);
                    setCurrentUserStatus((prev: any) => ({
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
            <div className="utenteInfo">
                <div className="card-header col-12">
                    <h5 className="mb-0">INFO SQUADRA</h5>
                </div>
                <div className="card-body">
                    <div className="item-info">
                        <div className="label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                            <span>Squadra:</span>
                        </div>
                        <div className="text-muted"><em>{currentUserStatus?.name}</em></div>
                    </div>
                    <div className="item-info">
                        <div className="label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            <span>Checkpoint:</span>
                        </div>
                        <div className="text-muted"><em>{currentUserStatus?.checkpointsCompleted}</em></div>
                    </div>

                    <div className="card-body">
                        <div className="item-info">
                            <div className="label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                </svg>
                                <span>Ultimo indizio ricevuto:</span>
                            </div>
                            <div className="text-muted">
                               <em>{lastHelpString}</em> 
                            </div>
                        </div>
                        <div className="item-info">
                            <div className="label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-paper-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M6.5 9.5 3 7.5v-6A1.5 1.5 0 0 1 4.5 0h7A1.5 1.5 0 0 1 13 1.5v6l-3.5 2L8 8.75zM1.059 3.635 2 3.133v3.753L0 5.713V5.4a2 2 0 0 1 1.059-1.765M16 5.713l-2 1.173V3.133l.941.502A2 2 0 0 1 16 5.4zm0 1.16-5.693 3.337L16 13.372v-6.5Zm-8 3.199 7.941 4.412A2 2 0 0 1 14 16H2a2 2 0 0 1-1.941-1.516zm-8 3.3 5.693-3.162L0 6.873v6.5Z" />
                                </svg>
                                <span>Ultima prova ricevuta:</span>
                            </div>
                            <div className="text-muted">
                                <em>{lastCheckpointString}</em>
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

        let height = "";

        if (typeof window !== 'undefined') {
            if(window.innerWidth > 520 && window.innerWidth < 1024){
                height = "900px";
                
            }else if(window.innerWidth > 520 ){
                height = "830px";

            }else{
                height = "540px";
            }
        } else {
            // Default height for SSR
            height = "830px";
        }

        return (
            <div key={calendlyKey} className="">
                <iframe
                    src="https://calendly.com/catarbus-organizzazione/30min?background_color=FFFFFF&primary_color=000000&hide_gdpr_banner=1"
                    width="100%"
                    height={height}
                    frameBorder="0"
                    title="Prenota Aiuto"

                    style={{ minWidth: '320px', background: 'transparent'}}
                ></iframe>
            </div>
        )
    }

    // Show loading state during SSR or while client-side data is loading
    if (!isClient || !currentUserStatus) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <Header />
                    <main className="flex-1 container flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
                        </div>
                    </main>
                    <Footer />
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />

                <main className="flex-1 container">
                    <div className="info">
                        {renderSection1()}
                    </div>
                    <div className="calendar">
                        {renderSection2()}
                    </div>
                    
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}

//     return (
//         <ProtectedRoute>
//             <div className="min-h-screen flex flex-col bg-gray-50">
//                 <Header />

//                 <main className="flex-1 container">
//                     {renderTabs()}
//                     {activeKey === '1' && renderSection1()}
//                     {activeKey === '2' && renderSection2()}

//                 </main>

//                 <Footer />
//             </div>
//         </ProtectedRoute>
//     );
// }

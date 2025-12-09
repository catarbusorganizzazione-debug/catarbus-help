"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Nav, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginResponse } from "../models/Interfaces";

export default function Dashboard() {
    const [activeKey, setActiveKey] = React.useState('1');
    const [currentUserStatus, setCurrentUserStatus] = React.useState<any>(null);
    const [lastCheckpointString, setLastCheckpointString] = React.useState('Non disponibile');
    const [lastHelpString, setLastHelpString] = React.useState('Non disponibile');

    React.useEffect(() => {
        // Accedi a localStorage solo dopo il mount del componente
        const userStatus = JSON.parse(localStorage.getItem('catarbus_user') || 'null');
        setCurrentUserStatus(userStatus);

        if (userStatus) {
            const lastCheckpoint = userStatus.lastCheckpoint ? new Date(userStatus.lastCheckpoint).toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Non disponibile';

            const lastHelp = userStatus.lastHelp ? new Date(userStatus.lastHelp).toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Non disponibile';

            setLastCheckpointString(lastCheckpoint);
            setLastHelpString(lastHelp);
        }
    }, []);

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
            <div>
                <div className="calendly-inline-widget" data-url="https://calendly.com/catarbus-organizzazione/30min?hide_gdpr_banner=1" style={{ minWidth: '320px', height: '700px' }}></div>
                <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
            </div>
        )
    }



    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <main className="flex-1 container mx-auto px-4 py-8">
                {renderTabs()}
                {activeKey === '1' && renderSection1()}
                {activeKey === '2' && renderSection2()}

            </main>

            <Footer />
        </div>
    );
}

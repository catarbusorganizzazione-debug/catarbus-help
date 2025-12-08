# API Documentation - CAT Arbus Portal

## 📋 Panoramica API

Il Portale CAT Arbus utilizza un'architettura REST per la comunicazione tra frontend e backend. Attualmente il sistema utilizza mock data per il testing, ma questa documentazione descrive la struttura API per l'implementazione in produzione.

**Base URL**: `https://api.catarbus.com/v1`  
**Versione**: v1.0  
**Formato**: JSON  
**Autenticazione**: Bearer Token  

## 🔐 Autenticazione

### POST /auth/login
Autentica un utente e restituisce un token di accesso.

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "catarbus2025"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "username": "admin",
      "role": "admin",
      "permissions": ["read:teams", "write:teams", "admin:dashboard"]
    },
    "expiresIn": 86400
  }
}
```

**Response (401 Unauthorized)**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Username o password non validi"
  }
}
```

### POST /auth/logout
Invalida il token corrente.

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Logout effettuato con successo"
}
```

### POST /auth/refresh
Rinnova il token di accesso.

```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

## 🏆 Teams API

### GET /teams
Restituisce la lista di tutte le squadre con il loro progresso.

```http
GET /teams
Authorization: Bearer <token>
```

**Query Parameters**
- `status` (optional): `active`, `completed`, `all` (default: `active`)
- `sort` (optional): `name`, `progress`, `lastUpdate` (default: `progress`)
- `order` (optional): `asc`, `desc` (default: `desc`)

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_001",
      "name": "Squadra Rossa",
      "color": "#ef4444",
      "currentCheckpoint": 3,
      "completedCheckpoints": [1, 2, 3],
      "totalCheckpoints": 6,
      "progressPercentage": 50,
      "lastUpdate": "2025-12-08T14:30:00Z",
      "status": "active",
      "members": [
        {
          "id": "member_001",
          "name": "Mario Rossi",
          "role": "captain"
        }
      ]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

### GET /teams/{teamId}
Restituisce i dettagli di una squadra specifica.

```http
GET /teams/team_001
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "team_001",
    "name": "Squadra Rossa",
    "color": "#ef4444",
    "currentCheckpoint": 3,
    "completedCheckpoints": [1, 2, 3],
    "checkpointHistory": [
      {
        "checkpointId": 1,
        "completedAt": "2025-12-08T09:00:00Z",
        "completedBy": "admin_user"
      },
      {
        "checkpointId": 2,
        "completedAt": "2025-12-08T11:30:00Z",
        "completedBy": "admin_user"
      }
    ],
    "statistics": {
      "averageTimePerCheckpoint": 120, // minutes
      "fastestCheckpoint": 45,
      "slowestCheckpoint": 180
    }
  }
}
```

### PUT /teams/{teamId}/checkpoint
Aggiorna il checkpoint di una squadra.

```http
PUT /teams/team_001/checkpoint
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkpointId": 4,
  "completedAt": "2025-12-08T15:00:00Z",
  "notes": "Checkpoint completato con successo"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "team_001",
    "currentCheckpoint": 4,
    "completedCheckpoints": [1, 2, 3, 4],
    "lastUpdate": "2025-12-08T15:00:00Z"
  },
  "message": "Progresso squadra aggiornato con successo"
}
```

### DELETE /teams/{teamId}/checkpoint/{checkpointId}
Rimuove un checkpoint dalla squadra (per correzioni).

```http
DELETE /teams/team_001/checkpoint/3
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Checkpoint rimosso con successo"
}
```

### POST /teams/{teamId}/reset
Resetta il progresso di una squadra.

```http
POST /teams/team_001/reset
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Correzione errore inserimento",
  "resetToCheckpoint": 0
}
```

## 🏁 Checkpoints API

### GET /checkpoints
Restituisce la lista di tutti i checkpoint del gioco.

```http
GET /checkpoints
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Partenza",
      "description": "Punto di partenza del gioco",
      "icon": "🚀",
      "order": 1,
      "isActive": true,
      "coordinates": {
        "lat": 45.0703,
        "lng": 7.6869
      },
      "estimatedDuration": 30, // minutes
      "difficulty": "easy"
    }
  ]
}
```

### POST /checkpoints
Crea un nuovo checkpoint (solo admin).

```http
POST /checkpoints
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuovo Checkpoint",
  "description": "Descrizione del checkpoint",
  "icon": "🎯",
  "order": 7,
  "coordinates": {
    "lat": 45.0703,
    "lng": 7.6869
  },
  "estimatedDuration": 45,
  "difficulty": "medium"
}
```

### PUT /checkpoints/{checkpointId}
Aggiorna un checkpoint esistente.

```http
PUT /checkpoints/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Partenza Aggiornata",
  "description": "Descrizione aggiornata",
  "isActive": false
}
```

### DELETE /checkpoints/{checkpointId}
Elimina un checkpoint.

```http
DELETE /checkpoints/7
Authorization: Bearer <token>
```

## 🎮 Game State API

### GET /game/state
Restituisce lo stato generale del gioco.

```http
GET /game/state
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "game_2025_001",
    "name": "CAT Arbus 2025",
    "status": "active", // active, paused, completed, scheduled
    "startTime": "2025-12-08T08:00:00Z",
    "endTime": "2025-12-08T18:00:00Z",
    "currentTime": "2025-12-08T14:30:00Z",
    "statistics": {
      "totalTeams": 5,
      "activeTeams": 5,
      "completedTeams": 0,
      "totalCheckpoints": 6,
      "averageProgress": 58.5,
      "leaderTeam": {
        "id": "team_002",
        "name": "Squadra Blu",
        "progress": 83.3
      }
    },
    "settings": {
      "autoRefreshInterval": 30000, // milliseconds
      "allowLateRegistration": false,
      "publicDashboard": true
    }
  }
}
```

### PUT /game/state
Aggiorna lo stato del gioco (solo admin).

```http
PUT /game/state
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paused",
  "settings": {
    "autoRefreshInterval": 60000
  }
}
```

### POST /game/start
Avvia il gioco.

```http
POST /game/start
Authorization: Bearer <token>
```

### POST /game/pause
Mette in pausa il gioco.

```http
POST /game/pause
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Pausa pranzo"
}
```

### POST /game/end
Termina il gioco.

```http
POST /game/end
Authorization: Bearer <token>
```

## 📊 Statistics API

### GET /statistics/teams
Restituisce statistiche dettagliate delle squadre.

```http
GET /statistics/teams
Authorization: Bearer <token>
```

**Query Parameters**
- `from` (optional): Data inizio periodo (ISO 8601)
- `to` (optional): Data fine periodo (ISO 8601)
- `groupBy` (optional): `day`, `hour`, `checkpoint`

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTeams": 5,
      "averageCompletionTime": 480, // minutes
      "fastestTeam": {
        "id": "team_002",
        "name": "Squadra Blu",
        "time": 420
      },
      "slowestTeam": {
        "id": "team_005",
        "name": "Squadra Viola",
        "time": 540
      }
    },
    "progressOverTime": [
      {
        "timestamp": "2025-12-08T09:00:00Z",
        "teams": [
          {
            "teamId": "team_001",
            "checkpoint": 1,
            "progress": 16.7
          }
        ]
      }
    ]
  }
}
```

### GET /statistics/checkpoints
Statistiche sui checkpoint.

```http
GET /statistics/checkpoints
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "checkpointId": 1,
      "name": "Partenza",
      "completedBy": 5,
      "averageTime": 25, // minutes to complete
      "difficulty": "easy",
      "completionRate": 100 // percentage
    }
  ]
}
```

## 📱 Real-time Events (WebSocket)

### Connection
```javascript
const ws = new WebSocket('wss://api.catarbus.com/v1/ws');
ws.send(JSON.stringify({
  type: 'auth',
  token: 'Bearer <token>'
}));
```

### Events

#### Team Progress Update
```json
{
  "type": "team_progress_updated",
  "data": {
    "teamId": "team_001",
    "checkpointId": 4,
    "timestamp": "2025-12-08T15:00:00Z"
  }
}
```

#### Game State Change
```json
{
  "type": "game_state_changed",
  "data": {
    "status": "paused",
    "reason": "Technical issue",
    "timestamp": "2025-12-08T15:30:00Z"
  }
}
```

#### New Team Registration
```json
{
  "type": "team_registered",
  "data": {
    "team": {
      "id": "team_006",
      "name": "Squadra Arancione",
      "color": "#f97316"
    }
  }
}
```

## 🚨 Error Handling

### Struttura Errore Standard
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Messaggio leggibile dall'utente",
    "details": "Dettagli tecnici per debug",
    "timestamp": "2025-12-08T15:00:00Z",
    "requestId": "req_123456789"
  }
}
```

### Codici Errore Comuni

| Codice | Descrizione | Status |
|--------|-------------|---------|
| `INVALID_CREDENTIALS` | Credenziali non valide | 401 |
| `TOKEN_EXPIRED` | Token scaduto | 401 |
| `INSUFFICIENT_PERMISSIONS` | Permessi insufficienti | 403 |
| `TEAM_NOT_FOUND` | Squadra non trovata | 404 |
| `CHECKPOINT_NOT_FOUND` | Checkpoint non trovato | 404 |
| `INVALID_CHECKPOINT_ORDER` | Ordine checkpoint non valido | 400 |
| `GAME_NOT_ACTIVE` | Gioco non attivo | 400 |
| `TEAM_ALREADY_COMPLETED` | Squadra già completata | 409 |
| `RATE_LIMIT_EXCEEDED` | Limite richieste superato | 429 |
| `INTERNAL_ERROR` | Errore interno server | 500 |

## 🔧 Rate Limiting

### Limiti per Endpoint

| Endpoint | Limit | Window |
|----------|--------|---------|
| `POST /auth/login` | 5 requests | 15 minutes |
| `GET /teams` | 100 requests | 1 minute |
| `PUT /teams/*/checkpoint` | 10 requests | 1 minute |
| `GET /game/state` | 60 requests | 1 minute |
| `WebSocket connections` | 10 connections | per IP |

### Headers di Risposta
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701874200
```

## 📝 Esempi di Utilizzo

### Aggiornamento Progresso Squadra
```javascript
// Frontend implementation
async function updateTeamProgress(teamId, checkpointId) {
  try {
    const response = await fetch(`/api/teams/${teamId}/checkpoint`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkpointId,
        completedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Errore aggiornamento progresso');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore:', error);
    throw error;
  }
}
```

### Monitoraggio Real-time
```javascript
// WebSocket implementation
class GameMonitor {
  constructor(token) {
    this.ws = new WebSocket('wss://api.catarbus.com/v1/ws');
    this.token = token;
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    this.ws.onopen = () => {
      this.authenticate();
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }
  
  authenticate() {
    this.ws.send(JSON.stringify({
      type: 'auth',
      token: this.token
    }));
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'team_progress_updated':
        this.updateTeamDisplay(message.data);
        break;
      case 'game_state_changed':
        this.updateGameStatus(message.data);
        break;
    }
  }
}
```

## 🧪 Testing API

### Esempio con cURL
```bash
# Login
curl -X POST https://api.catarbus.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"catarbus2025"}'

# Get teams
curl -X GET https://api.catarbus.com/v1/teams \
  -H "Authorization: Bearer <token>"

# Update team progress
curl -X PUT https://api.catarbus.com/v1/teams/team_001/checkpoint \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"checkpointId":4,"completedAt":"2025-12-08T15:00:00Z"}'
```

### Environment Variables per Testing
```bash
# .env.test
API_BASE_URL=https://api-staging.catarbus.com/v1
TEST_ADMIN_TOKEN=test_token_123
TEST_TEAM_ID=test_team_001
```

---

**Versione API**: 1.0  
**Ultimo Aggiornamento**: Dicembre 2025  
**Contatto**: api-support@catarbus.com
# Manuale Utente - Portale CAT Arbus

## 🏠 Panoramica

Il Portale CAT Arbus è una piattaforma web che permette di monitorare in tempo reale lo stato di avanzamento del gioco "CAT Arbus". Il portale è accessibile sia al pubblico per visualizzare i progressi delle squadre, sia agli amministratori per gestire l'evento.

**URL Portale**: `https://catarbus.com` (o `http://localhost:3000` per testing)

## 🎯 Accesso al Portale

### Homepage Pubblica
La homepage è accessibile a tutti e mostra:
- **Classifica Live**: Posizione attuale di tutte le squadre
- **Progresso Checkpoint**: Visualizzazione dei checkpoint completati
- **Statistiche di Gioco**: Informazioni generali sull'evento
- **Form di Login**: Per accedere all'area riservata

### Navigazione Principale
- **Logo CAT Arbus**: Cliccando sul logo si torna sempre alla homepage
- **Menu di Navigazione**: Links rapidi alle sezioni principali
- **Indicatore Live**: Mostra se il gioco è attivo con aggiornamenti in tempo reale

## 📊 Dashboard Pubblica

### Sezione Classifica
La classifica mostra tutte le squadre ordinate per progresso:

#### Elementi Visualizzati
- **🥇🥈🥉** Medaglie per i primi tre classificati
- **Pallino Colorato**: Colore distintivo di ogni squadra  
- **Nome Squadra**: Denominazione della squadra
- **Progresso**: "X/6 checkpoint completati"
- **Percentuale**: Progresso in percentuale
- **Ultimo Aggiornamento**: Timestamp dell'ultimo checkpoint

#### Come Leggere la Classifica
```
🥇 [🔴] Squadra Rossa    4/6 checkpoint completati    67%    14:30
🥈 [🔵] Squadra Blu      3/6 checkpoint completati    50%    14:15
🥉 [🟢] Squadra Verde    3/6 checkpoint completati    50%    14:10
4° [🟡] Squadra Gialla   2/6 checkpoint completati    33%    13:45
5° [🟣] Squadra Viola    1/6 checkpoint completati    17%    13:20
```

### Checkpoint di Gioco
La sezione mostra tutti i checkpoint disponibili:
- **🧢 Partenza**: Punto di partenza del gioco
- **🧢 Prima Tappa**: Primo checkpoint da raggiungere
- **🧢 Seconda Tappa**: Secondo checkpoint
- **🧢 Terza Tappa**: Terzo checkpoint  
- **🧢 Quarta Tappa**: Quarto checkpoint
- **🧢 Arrivo**: Traguardo finale

### Statistiche Generali
Informazioni aggregate sull'evento:
- **5 Squadre Attive**: Numero di squadre partecipanti
- **6 Checkpoint Totali**: Tappe totali del percorso
- **60% Progresso Medio**: Media di avanzamento
- **Live Stato Gioco**: Stato attuale dell'evento

## 🔐 Area Riservata

### Accesso Amministratore

#### 1. Login
Per accedere all'area riservata:
1. Nella homepage, compilare il **Form di Login** sulla destra
2. Inserire le credenziali:
   - **Username**: `admin`
   - **Password**: `catarbus2025`
3. Cliccare su **"Accedi"**

#### 2. Autenticazione Riuscita
Dopo il login sarete reindirizzati alla Dashboard Amministrativa.

### Dashboard Amministrativa

#### Header Amministrativo
- **Logo e Titolo**: "CAT Arbus - Admin"
- **Benvenuto**: Mostra l'username connesso
- **Pulsante Logout**: Per uscire dall'area riservata

#### Sezione "Aggiorna Progresso Squadra"
Permette di aggiornare manualmente i checkpoint delle squadre:

**Passaggi**:
1. **Seleziona Squadra**: Menu a tendina con tutte le squadre
2. **Checkpoint Completato**: Scegli il checkpoint raggiunto
3. **Aggiorna Progresso**: Clicca per confermare l'aggiornamento

**Esempio**:
```
Squadra: [Squadra Rossa ▼]
Checkpoint: [3. Seconda Tappa ▼] 
[Aggiorna Progresso]
```

#### Tabella Stato Squadre
Vista completa di tutte le squadre con:

| Squadra | Checkpoint Completati | Posizione Attuale | Ultimo Aggiornamento | Azioni |
|---------|----------------------|------------------|---------------------|--------|
| 🥇 🔴 Squadra Rossa | ●●●○○○ | Checkpoint 4 | 08/12/2025 14:30:25 | [Reset] |
| 🥈 🔵 Squadra Blu | ●●●○○○ | Checkpoint 4 | 08/12/2025 14:25:10 | [Reset] |

**Legenda**:
- **●** = Checkpoint completato (verde)
- **○** = Checkpoint non raggiunto (grigio)
- **🥇🥈🥉** = Posizione in classifica
- **[Reset]** = Pulsante per azzerare il progresso

#### Funzione Reset
Per correggere errori o ripartire da zero:
1. Cliccare sul pulsante **"Reset"** nella riga della squadra
2. **Confermare l'azione** (il progresso verrà azzerato)
3. La squadra tornerà al **Checkpoint 1**

⚠️ **Attenzione**: L'operazione di reset non è reversibile!

## 📱 Utilizzo su Dispositivi Mobili

### Layout Mobile
Il portale è ottimizzato per smartphone e tablet:
- **Menu Navigation**: Si trasforma in hamburger menu
- **Classifica**: Stack verticale per facile lettura
- **Form Login**: Si adatta alla larghezza schermo
- **Amministrazione**: Tabelle scrollabili orizzontalmente

### Funzionalità Touch
- **Tap per Selezionare**: Menu e pulsanti ottimizzati per touch
- **Swipe**: Scorri le tabelle su schermi piccoli
- **Zoom**: Compatibilità con zoom del browser

## ⚡ Aggiornamenti in Tempo Reale

### Auto-Refresh
Il portale si aggiorna automaticamente ogni **30 secondi**:
- La classifica viene riordinata automaticamente
- I timestamp mostrano gli aggiornamenti più recenti  
- L'indicatore **"Live"** conferma la connessione attiva

### Controlli Aggiornamento (Homepage)
- **🔄 Auto**: Auto-refresh attivato (verde)
- **⏸️ Pausa**: Auto-refresh disattivato (grigio)
- **🔃 Aggiorna ora**: Refresh manuale immediato
- **Countdown**: "Prossimo aggiornamento: 25s"

### Indicatori Stato
- **🟢 Live**: Gioco attivo, aggiornamenti in corso
- **🟡 Pausa**: Gioco in pausa temporanea
- **🔴 Offline**: Problemi di connessione

## ❓ Risoluzione Problemi

### Problemi Comuni

#### **Non riesco ad accedere all'area admin**
**Possibili Cause**:
- Username o password errati
- Connessione internet instabile
- Browser non aggiornato

**Soluzioni**:
1. Verificare le credenziali: `admin` / `catarbus2025`
2. Aggiornare la pagina (F5 o Ctrl+R)
3. Controllare la connessione internet
4. Provare con browser diverso (Chrome, Firefox, Safari)

#### **La classifica non si aggiorna**
**Possibili Cause**:
- Auto-refresh disattivato
- Problemi di rete
- Gioco in pausa

**Soluzioni**:
1. Verificare che l'indicatore **"Live"** sia verde
2. Cliccare su **"🔃 Aggiorna ora"** per refresh manuale
3. Ricaricare completamente la pagina
4. Verificare lo stato del gioco

#### **Le modifiche admin non si salvano**
**Possibili Cause**:
- Sessione scaduta
- Connessione internet persa
- Errore del server

**Soluzioni**:
1. Effettuare nuovamente il login
2. Riprovare l'operazione
3. Verificare la connessione internet
4. Contattare il supporto tecnico

#### **Il sito non si carica su mobile**
**Possibili Cause**:
- Connessione dati lenta
- Browser mobile non supportato
- JavaScript disabilitato

**Soluzioni**:
1. Verificare la connessione WiFi/4G
2. Aggiornare il browser mobile
3. Abilitare JavaScript nelle impostazioni
4. Provare con browser diverso (Chrome Mobile, Safari)

### Browser Supportati
✅ **Raccomandati**:
- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

⚠️ **Limitati**:
- Internet Explorer (non supportato)
- Browser molto vecchi

### Requisiti Minimi
- **Connessione Internet**: Stabile (WiFi o 4G)
- **JavaScript**: Abilitato
- **Cookies**: Abilitati per l'autenticazione
- **Risoluzione**: Minimo 320px di larghezza

## 📞 Supporto

### Contatti Rapidi
- **Email**: support@catarbus.com
- **Telefono**: +39 xxx xxx xxxx (durante l'evento)
- **Telegram**: @catarbus_support

### Informazioni per il Supporto
Quando contattate il supporto, fornite:
1. **Browser utilizzato** (Chrome, Firefox, etc.)
2. **Dispositivo** (PC, smartphone, tablet)
3. **Descrizione del problema**
4. **Screenshot** se possibile
5. **Orario** in cui si è verificato il problema

### Orari Supporto
- **Durante l'evento**: 8:00 - 20:00
- **Pre/Post evento**: 9:00 - 17:00 (giorni lavorativi)
- **Emergenze**: Sempre disponibili via email

### FAQ Rapide

**Q: Posso seguire l'evento senza registrarmi?**  
R: Sì, la dashboard pubblica è accessibile a tutti senza registrazione.

**Q: Ogni quanto si aggiorna la classifica?**  
R: Automaticamente ogni 30 secondi, o manualmente cliccando "Aggiorna ora".

**Q: Posso usare il portale dal telefono?**  
R: Sì, il sito è completamente responsive e ottimizzato per mobile.

**Q: Cosa succede se perdo la connessione?**  
R: Il sito mostrerà un indicatore offline e riprenderà gli aggiornamenti al ripristino della connessione.

**Q: Le modifiche admin sono immediate?**  
R: Sì, le modifiche appaiono immediatamente e vengono sincronizzate con tutti i dispositivi connessi.

---

**Buon utilizzo del Portale CAT Arbus! 🎯**

*Per assistenza immediata durante l'evento, utilizzate i canali di supporto rapido.*
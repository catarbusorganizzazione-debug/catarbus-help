# Guida per Sviluppatori - CAT Arbus Portal

## 🛠️ Setup Ambiente di Sviluppo

### Prerequisiti
```bash
# Verifica versioni richieste
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
git --version   # >= 2.0.0
```

### Configurazione Iniziale
```bash
# 1. Clone del repository
git clone https://github.com/catarbusorganizzazione-debug/catarbus-help.git
cd catarbus-help

# 2. Installazione dipendenze
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Avvio sviluppo
npm run dev
```

### Variabili di Ambiente
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
AUTH_SECRET=your-secret-key-here
NODE_ENV=development
```

## 📁 Struttura del Progetto

```
catarbus-help/
├── app/                    # Next.js App Router
│   ├── components/         # Componenti riutilizzabili
│   │   ├── Header.tsx      # Header principale
│   │   ├── Footer.tsx      # Footer del sito
│   │   ├── Classifica.tsx  # Componente classifica
│   │   └── LoginForm.tsx   # Form di login
│   ├── admin/              # Area amministrativa
│   │   └── page.tsx        # Dashboard admin
│   ├── login/              # Pagine autenticazione
│   │   └── page.tsx        # Pagina login
│   ├── globals.css         # Stili globali
│   ├── layout.tsx          # Layout radice
│   └── page.tsx           # Homepage
├── docs/                   # Documentazione
├── public/                 # Asset statici
├── next.config.ts          # Configurazione Next.js
├── tailwind.config.ts      # Configurazione Tailwind
├── tsconfig.json          # Configurazione TypeScript
└── package.json           # Dipendenze progetto
```

## 🧩 Architettura Componenti

### Gerarchia Componenti
```
App
├── Header (comune a tutte le pagine)
├── Main Content
│   ├── Homepage
│   │   ├── Classifica
│   │   ├── LoginForm
│   │   └── StatisticsSection
│   ├── Admin Dashboard
│   │   ├── TeamManagement
│   │   ├── CheckpointControl
│   │   └── GameStatus
│   └── Login Page
│       └── AuthForm
└── Footer (comune a tutte le pagine)
```

### Convenzioni Naming
```typescript
// Componenti: PascalCase
export default function TeamProgress() {}

// Props: camelCase
interface TeamProgressProps {
  teamData: Team;
  checkpointList: Checkpoint[];
}

// Files: kebab-case per utility, PascalCase per componenti
utils/format-date.ts
components/TeamProgress.tsx
```

## 🎨 Sistema di Design

### Tailwind CSS Classes
```typescript
// Layout
'container mx-auto px-4'           // Container responsive
'grid lg:grid-cols-3 gap-8'       // Grid layout
'flex items-center justify-between' // Flexbox alignment

// Componenti
'bg-white rounded-lg shadow-md p-6'  // Card standard
'text-lg font-semibold mb-4'         // Heading secondario
'text-sm text-gray-600'              // Testo secondario

// Stati interattivi
'hover:bg-gray-50 transition-colors' // Hover effect
'focus:ring-blue-500 focus:border-blue-500' // Focus states
'disabled:bg-gray-400 disabled:cursor-not-allowed' // Disabled
```

### Palette Colori Estesa
```css
/* Primary Colors */
--blue-50: #eff6ff;
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-700: #1d4ed8;

/* Success States */
--green-50: #f0fdf4;
--green-500: #10b981;
--green-600: #059669;

/* Warning States */
--yellow-50: #fefce8;
--yellow-500: #f59e0b;
--yellow-600: #d97706;

/* Error States */
--red-50: #fef2f2;
--red-500: #ef4444;
--red-600: #dc2626;

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

## 🔧 Sviluppo Componenti

### Template Componente Base
```typescript
// components/NewComponent.tsx
interface NewComponentProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function NewComponent({ 
  title, 
  isActive = false, 
  onClick,
  children 
}: NewComponentProps) {
  return (
    <div 
      className={`
        p-4 rounded-lg border transition-colors
        ${isActive 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
        }
      `}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
```

### Hooks Personalizzati
```typescript
// hooks/useGameState.ts
export function useGameState() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carica dati iniziali
    loadGameData();
  }, []);

  const updateTeamProgress = async (teamId: string, checkpoint: number) => {
    try {
      setLoading(true);
      // API call per aggiornamento
      await updateTeam(teamId, checkpoint);
      // Ricarica dati
      await loadGameData();
    } catch (err) {
      setError('Errore aggiornamento squadra');
    } finally {
      setLoading(false);
    }
  };

  return { teams, loading, error, updateTeamProgress };
}
```

### Context per State Management
```typescript
// contexts/GameContext.tsx
const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const updateGame = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <GameContext.Provider value={{ gameState, updateGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
```

## 🧪 Testing Strategy

### Unit Tests con Jest
```typescript
// __tests__/components/TeamProgress.test.tsx
import { render, screen } from '@testing-library/react';
import TeamProgress from '../components/TeamProgress';

const mockTeam = {
  id: 'team-1',
  name: 'Test Team',
  color: '#3b82f6',
  completedCheckpoints: [1, 2],
  currentCheckpoint: 3,
  lastUpdate: new Date()
};

describe('TeamProgress Component', () => {
  it('renders team name correctly', () => {
    render(<TeamProgress team={mockTeam} checkpoints={mockCheckpoints} />);
    expect(screen.getByText('Test Team')).toBeInTheDocument();
  });

  it('shows correct progress percentage', () => {
    render(<TeamProgress team={mockTeam} checkpoints={mockCheckpoints} />);
    expect(screen.getByText('33%')).toBeInTheDocument(); // 2/6 checkpoints
  });
});
```

### Integration Tests con Cypress
```typescript
// cypress/e2e/game-flow.cy.ts
describe('Game Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows admin to update team progress', () => {
    // Login come admin
    cy.get('[data-cy=login-username]').type('admin');
    cy.get('[data-cy=login-password]').type('catarbus2025');
    cy.get('[data-cy=login-submit]').click();

    // Vai alla dashboard admin
    cy.url().should('include', '/admin');

    // Seleziona squadra e checkpoint
    cy.get('[data-cy=team-select]').select('team-1');
    cy.get('[data-cy=checkpoint-select]').select('3');
    cy.get('[data-cy=update-progress]').click();

    // Verifica aggiornamento
    cy.get('[data-cy=team-progress-team-1]').should('contain', '3/6');
  });
});
```

## 📦 Build e Deploy

### Script NPM
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "cypress run",
    "analyze": "cross-env ANALYZE=true next build"
  }
}
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel Deployment
```bash
# Installazione Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy produzione
vercel --prod

# Environment variables
vercel env add NEXT_PUBLIC_API_URL
```

## 🔄 Workflow di Sviluppo

### Git Flow
```bash
# Feature development
git checkout -b feature/new-dashboard
git add .
git commit -m "feat: add new admin dashboard"
git push origin feature/new-dashboard

# Pull request e code review
# Merge dopo approvazione

# Hotfix
git checkout -b hotfix/login-bug
git commit -m "fix: resolve login authentication issue"
```

### Conventional Commits
```bash
# Types
feat:     # nuova funzionalità
fix:      # bug fix
docs:     # aggiornamento documentazione
style:    # formatting, missing semicolons, etc
refactor: # ristrutturazione codice
test:     # aggiunta test
chore:    # aggiornamento dipendenze, config

# Examples
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(dashboard): resolve team progress calculation"
git commit -m "docs: update API documentation"
```

### Code Review Checklist
- [ ] Funzionalità implementata correttamente
- [ ] Tests passano tutti
- [ ] Nessun errore TypeScript
- [ ] Stili consistenti con design system
- [ ] Performance acceptable (< 3s loading)
- [ ] Accessibilità rispettata (ARIA labels)
- [ ] Responsive design verificato
- [ ] Documentazione aggiornata

## 🐛 Debug e Troubleshooting

### Development Tools
```typescript
// Debug logging
const debug = process.env.NODE_ENV === 'development';
if (debug) {
  console.log('Game State:', gameState);
  console.log('User Actions:', userActions);
}

// Error boundaries
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logErrorToService}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Performance Monitoring
```typescript
// Performance metrics
export function withPerformanceMonitoring<T>(
  Component: React.ComponentType<T>
) {
  return function PerformanceWrapper(props: T) {
    useEffect(() => {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`${Component.name} render time:`, endTime - startTime);
      };
    });

    return <Component {...props} />;
  };
}
```

### Common Issues Solutions
```typescript
// Hydration mismatch
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// Memory leaks prevention
useEffect(() => {
  const interval = setInterval(updateData, 30000);
  return () => clearInterval(interval); // Cleanup
}, []);

// State updates after unmount
useEffect(() => {
  let isMounted = true;
  
  fetchData().then(data => {
    if (isMounted) {
      setState(data);
    }
  });
  
  return () => { isMounted = false; };
}, []);
```

## 📚 Risorse Utili

### Documentazione Ufficiale
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Tools e Extensions
- **VS Code Extensions**: ES7 React snippets, Tailwind CSS IntelliSense
- **Chrome DevTools**: React Developer Tools, Lighthouse
- **Testing**: Jest, React Testing Library, Cypress

### Community Resources
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [React Discord](https://discord.gg/react)
- [Tailwind CSS Discord](https://discord.gg/tailwindcss)

---

**Happy Coding! 🚀**
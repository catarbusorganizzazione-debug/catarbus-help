# Deployment Guide - CAT Arbus Portal

## 🚀 Panoramica Deployment

Questa guida fornisce istruzioni dettagliate per il deployment del Portale CAT Arbus in diversi ambienti di produzione. Il portale è stato sviluppato con Next.js e può essere deployato su varie piattaforme.

## 🏗️ Preparazione per il Deployment

### 1. Build di Produzione
```bash
# Verifica che il progetto compili correttamente
npm run build

# Test della build locale
npm run start

# Verifica su http://localhost:3000
```

### 2. Ottimizzazioni Pre-Deployment
```bash
# Analisi bundle size
npm run analyze

# Controllo TypeScript
npm run type-check

# Linting completo
npm run lint

# Test completi
npm run test
```

### 3. Environment Variables
Configurare le variabili d'ambiente per la produzione:

```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://catarbus.com
NEXT_PUBLIC_API_URL=https://api.catarbus.com/v1
AUTH_SECRET=your-super-secret-key-here
NODE_ENV=production
ANALYZE=false

# Database (se utilizzato)
DATABASE_URL=postgresql://user:password@host:5432/catarbus_db

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
VERCEL_ANALYTICS_ID=your-analytics-id

# Rate Limiting
REDIS_URL=redis://localhost:6379
```

## ☁️ Deployment su Vercel (Raccomandato)

### 1. Setup Vercel CLI
```bash
# Installazione globale
npm i -g vercel

# Login
vercel login

# Configurazione progetto
vercel
```

### 2. Configurazione Vercel
Creare `vercel.json` nella root del progetto:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://catarbus.vercel.app",
    "NODE_ENV": "production"
  },
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.catarbus.com/v1/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 3. Deploy Commands
```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# Configurare custom domain
vercel domains add catarbus.com
vercel alias catarbus.vercel.app catarbus.com
```

### 4. Environment Variables su Vercel
```bash
# Aggiungere variabili tramite CLI
vercel env add NEXT_PUBLIC_API_URL production
vercel env add AUTH_SECRET production

# Oppure tramite Dashboard Vercel
# https://vercel.com/dashboard/[team]/[project]/settings/environment-variables
```

## 🐳 Deployment con Docker

### 1. Dockerfile
Creare `Dockerfile` nella root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

### 2. Docker Compose
Creare `docker-compose.yml`:

```yaml
version: '3.8'

services:
  catarbus-portal:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://catarbus.com
      - DATABASE_URL=postgresql://postgres:password@db:5432/catarbus
    depends_on:
      - db
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=catarbus
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - catarbus-portal

volumes:
  postgres_data:
  redis_data:
```

### 3. Build e Deploy Docker
```bash
# Build dell'immagine
docker build -t catarbus-portal .

# Test locale
docker run -p 3000:3000 catarbus-portal

# Deploy con compose
docker-compose up -d

# Logs
docker-compose logs -f catarbus-portal

# Stop
docker-compose down
```

## 🌐 Deployment su VPS/Server Dedicato

### 1. Setup Server Ubuntu 22.04
```bash
# Aggiornamento sistema
sudo apt update && sudo apt upgrade -y

# Installazione Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installazione PM2
sudo npm install -g pm2

# Nginx
sudo apt install nginx

# Certificati SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

### 2. Configurazione Nginx
Creare `/etc/nginx/sites-available/catarbus`:

```nginx
server {
    listen 80;
    server_name catarbus.com www.catarbus.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name catarbus.com www.catarbus.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/catarbus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/catarbus.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 3. Deploy dell'Applicazione
```bash
# Clone del repository
cd /var/www
sudo git clone https://github.com/catarbusorganizzazione-debug/catarbus-help.git
sudo chown -R $USER:$USER catarbus-help
cd catarbus-help

# Installazione dipendenze
npm ci --only=production

# Build produzione
npm run build

# Configurazione PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'catarbus-portal',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/catarbus-help',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_APP_URL: 'https://catarbus.com'
    },
    error_file: '/var/log/pm2/catarbus-error.log',
    out_file: '/var/log/pm2/catarbus-out.log',
    log_file: '/var/log/pm2/catarbus-combined.log',
    time: true
  }]
}
EOF

# Avvio con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. SSL Certificate
```bash
# Generazione certificato Let's Encrypt
sudo certbot --nginx -d catarbus.com -d www.catarbus.com

# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal crontab
sudo crontab -e
# Aggiungi: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring e Logging

### 1. Application Monitoring con Sentry
```bash
# Installazione Sentry SDK
npm install @sentry/nextjs

# Configurazione sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

# Configurazione sentry.server.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring
```javascript
// utils/analytics.js
export function trackPageView(url) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_TRACKING_ID', {
      page_path: url,
    });
  }
}

export function trackEvent(action, category, label, value) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
```

### 3. Health Check Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection
    // Check external services
    // Check memory usage
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

## 🔒 Security Best Practices

### 1. Environment Security
```bash
# Protezione file sensibili
chmod 600 .env.production
chmod 600 ecosystem.config.js

# Backup secrets
sudo mkdir -p /etc/catarbus/secrets
sudo cp .env.production /etc/catarbus/secrets/
sudo chmod 600 /etc/catarbus/secrets/.env.production
sudo chown root:root /etc/catarbus/secrets/.env.production
```

### 2. Firewall Configuration
```bash
# Ubuntu UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
```

### 3. Security Headers
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
Creare `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2. Deployment Script
Creare `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Backup current version
sudo cp -r /var/www/catarbus-help /var/www/catarbus-help-backup-$(date +%Y%m%d_%H%M%S)

# Pull latest code
cd /var/www/catarbus-help
sudo git pull origin main

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Restart PM2
pm2 restart catarbus-portal

# Health check
sleep 10
curl -f http://localhost:3000/api/health || {
  echo "❌ Health check failed, rolling back..."
  pm2 stop catarbus-portal
  sudo rm -rf /var/www/catarbus-help
  sudo mv /var/www/catarbus-help-backup-* /var/www/catarbus-help
  cd /var/www/catarbus-help
  pm2 start ecosystem.config.js
  exit 1
}

echo "✅ Deployment successful!"

# Cleanup old backups (keep last 5)
sudo ls -t /var/www/catarbus-help-backup-* | tail -n +6 | xargs -r sudo rm -rf
```

## 📈 Performance Optimization

### 1. CDN Configuration
```javascript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['cdn.catarbus.com'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/catarbus/image/upload/',
  },
  experimental: {
    optimizeCss: true,
  }
};
```

### 2. Caching Strategy
```javascript
// Cache configuration
const cacheConfig = {
  // Static assets
  'public, max-age=31536000, immutable': [
    '/_next/static/**',
  ],
  // API responses
  'public, max-age=300, s-maxage=300': [
    '/api/teams',
    '/api/game/state'
  ],
  // HTML pages
  'public, max-age=60, s-maxage=60': [
    '/',
    '/admin'
  ]
};
```

### 3. Database Optimization
```sql
-- Indexes per performance
CREATE INDEX idx_teams_progress ON teams(completed_checkpoints);
CREATE INDEX idx_checkpoints_order ON checkpoints(order_number);
CREATE INDEX idx_game_events_timestamp ON game_events(timestamp);

-- Archival strategy
CREATE TABLE teams_archive AS SELECT * FROM teams WHERE game_id < current_game_id;
DELETE FROM teams WHERE game_id < current_game_id;
```

## 🆘 Rollback Procedures

### 1. Vercel Rollback
```bash
# Lista deployments
vercel ls

# Rollback a deployment specifico
vercel rollback [deployment-url]
```

### 2. Server Rollback
```bash
# Automatic rollback script
#!/bin/bash
echo "🔄 Rolling back deployment..."

# Stop current version
pm2 stop catarbus-portal

# Restore from backup
BACKUP_DIR=$(ls -t /var/www/catarbus-help-backup-* | head -n 1)
sudo rm -rf /var/www/catarbus-help
sudo mv "$BACKUP_DIR" /var/www/catarbus-help

# Restart service
cd /var/www/catarbus-help
pm2 start ecosystem.config.js

echo "✅ Rollback completed!"
```

## 📋 Post-Deployment Checklist

- [ ] ✅ Applicazione accessibile tramite HTTPS
- [ ] ✅ Certificati SSL validi e auto-renewal configurato
- [ ] ✅ Health check endpoint risponde correttamente
- [ ] ✅ Logs applicazione visibili e configurati
- [ ] ✅ Monitoring attivo (Sentry, Analytics)
- [ ] ✅ Performance acceptable (< 3s load time)
- [ ] ✅ Database connectivity funzionante
- [ ] ✅ Backup strategy implementata
- [ ] ✅ Security headers configurati
- [ ] ✅ CDN configurato per static assets
- [ ] ✅ Error pages personalizzate (404, 500)
- [ ] ✅ Mobile responsiveness verificata
- [ ] ✅ Cross-browser compatibility testata
- [ ] ✅ SEO meta tags configurati
- [ ] ✅ Analytics tracking attivo

---

**Deployment completato con successo! 🎉**

*Per supporto post-deployment: deployment-support@catarbus.com*
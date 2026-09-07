# Todo List — Fullstack (Symfony + React)

Application de gestion de tâches avec authentification JWT.

| Couche   | Technologies |
|----------|--------------|
| Backend  | Symfony 7.3 · API Platform 4 · Doctrine ORM · LexikJWT |
| Frontend | React 19 · Vite 7 · Tailwind CSS 3 · daisyUI 5 · Axios |
| Base de données | SQLite par défaut (MySQL possible, voir `.env`) |

## Fonctionnalités

- Inscription (`POST /api/register`) et connexion JWT (`POST /api/login`)
- CRUD des tâches (`/api/tasks`) : création, liste, terminé / à faire, suppression
- Isolation par utilisateur : chacun ne voit et ne modifie que **ses** tâches
  (filtre Doctrine `TaskExtension` + règles `security:` sur chaque opération API Platform)
- Assignation automatique de l'utilisateur connecté à la création (`TaskListener`)

## Démarrage rapide (installation classique)

Prérequis : PHP ≥ 8.2, Composer 2, Node.js ≥ 20.

### 1. Backend

```bash
cd backend
composer install

# Clés JWT (la passphrase est JWT_PASSPHRASE du .env)
mkdir -p config/jwt
php bin/console lexik:jwt:generate-keypair

# Base de données (SQLite par défaut — rien à installer)
php bin/console doctrine:schema:update --force

# Lancer l'API sur le port 8000
php -S 0.0.0.0:8000 -t public
# ou : symfony server:start --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Le dev server Vite proxifie automatiquement `/api` vers `http://127.0.0.1:8000`
(configurable via `VITE_API_TARGET`).

## Démarrage sans PHP installé (runtime embarqué)

Si PHP/Composer ne sont pas disponibles sur la machine, un runtime Node
embarquant PHP 8.4 (`@platformatic/php-node`) est fourni dans `backend/runtime/` :

```bash
cd backend/runtime
npm install
npm run setup-db       # crée/actualise le schéma (équivaut à doctrine:schema:update --force)
npm start              # API sur le port 8000 (PORT=... pour changer)
```

> Le dossier `backend/vendor/` doit être présent (via `composer install`,
> ou déjà fourni). Selon l'environnement, certaines bibliothèques natives
> (`libpq.so.5`, `libzip.so.4`) peuvent être requises par le module PHP embarqué —
> pointez `LD_LIBRARY_PATH` vers un dossier qui les contient si nécessaire.

## Configuration

Fichier `backend/.env` :

- `DATABASE_URL` — SQLite par défaut ; décommentez la ligne MySQL pour la production.
- `CORS_ALLOW_ORIGIN` — origines autorisées (localhost par défaut).
- `JWT_PASSPHRASE` — passphrase des clés `config/jwt/*.pem` (à régénérer en production !).
- `APP_SECRET` — à changer en production.

Frontend : `VITE_API_URL` (URL de l'API au build, par défaut `/api` relatif).

## Déploiement gratuit (Render + Vercel)

Le repo contient tout le nécessaire :

| Fichier | Rôle |
|---------|------|
| `render.yaml` | Blueprint Render : API + base PostgreSQL gratuite |
| `backend/Dockerfile` | Image de production (PHP 8.3 + Apache) |
| `backend/docker/entrypoint.sh` | Clés JWT auto-générées, schéma BDD auto-appliqué |
| `frontend/vercel.json` | Rewrites SPA pour React Router |

### Backend sur Render (gratuit)

1. Créez un compte sur https://render.com (connexion GitHub).
2. **New +** → **Blueprint** → sélectionnez ce repo et la branche à déployer.
3. Render lit `render.yaml` et crée automatiquement :
   - le service web `taskly-api` (Docker, plan gratuit),
   - la base PostgreSQL `taskly-db` (gratuite),
   - `APP_SECRET` et `JWT_PASSPHRASE` (générés),
   - `DATABASE_URL` (branché sur la base).
4. Au premier démarrage, l'entrypoint génère les clés JWT et crée les tables.
5. Notez l'URL publique, ex. `https://taskly-api.onrender.com`.

> ⚠️ Plan gratuit Render : le service s'endort après 15 min d'inactivité
> (premier appel suivant ≈ 30-60 s) et la base PostgreSQL gratuite expire
> après 30 jours (recréable). Suffisant pour une démo / un portfolio.

### Frontend sur Vercel (gratuit)

1. Créez un compte sur https://vercel.com (connexion GitHub).
2. **Add New** → **Project** → importez ce repo.
3. Réglages du projet :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Variable d'environnement** : `VITE_API_URL` = `https://taskly-api.onrender.com/api`
     (l'URL Render de l'étape précédente, suffixée de `/api`)
4. **Deploy** → votre site est en ligne sur `https://votre-projet.vercel.app`.

### Dernier réglage : CORS

Dans Render → `taskly-api` → **Environment**, ajustez `CORS_ALLOW_ORIGIN`
avec l'URL exacte de votre front (échappez les points) :

```
^https://votre-projet\.vercel\.app$
```

Redéployez le service et testez l'inscription depuis le site Vercel.

### Alternatives gratuites

- **Front** : Netlify, Cloudflare Pages, GitHub Pages (mêmes réglages : dossier `frontend`, build `npm run build`, sortie `dist`).
- **Back** : Koyeb ou Fly.io (le `Dockerfile` fourni fonctionne partout) ; base gratuite durable : Neon.tech (PostgreSQL) — mettez son URL dans `DATABASE_URL`.

## Structure de l'API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/register` | — | Inscription `{email, password}` |
| POST | `/api/login` | — | Connexion → `{token}` |
| GET | `/api/tasks` | JWT | Tâches de l'utilisateur connecté |
| POST | `/api/tasks` | JWT | Créer `{title, description?}` |
| GET | `/api/tasks/{id}` | JWT | Détail (propriétaire uniquement) |
| PATCH | `/api/tasks/{id}` | JWT | Mise à jour partielle (`application/merge-patch+json`) |
| DELETE | `/api/tasks/{id}` | JWT | Suppression (propriétaire uniquement) |

Documentation interactive : `http://localhost:8000/api` (Swagger UI d'API Platform).

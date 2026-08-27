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

## Déploiement (production)

1. **Backend**
   - `APP_ENV=prod` ; changez `APP_SECRET` et `JWT_PASSPHRASE`, régénérez les clés JWT.
   - Passez sur MySQL/PostgreSQL et lancez les migrations : `php bin/console doctrine:migrations:migrate`.
   - Servez `backend/public/` derrière Nginx/Apache + PHP-FPM.
   - Restreignez `CORS_ALLOW_ORIGIN` à votre domaine.
2. **Frontend**
   - `npm run build` → servez `frontend/dist/` (statique).
   - Faites pointer `/api` vers le backend via le reverse proxy (même domaine = pas de CORS),
     ou définissez `VITE_API_URL=https://api.mondomaine.com/api` au build.

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

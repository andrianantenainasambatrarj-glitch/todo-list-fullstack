#!/bin/bash
set -e

cd /var/www/html

# ---------------------------------------------------------------------------
# 1. Port dynamique (Render/Koyeb fournissent $PORT ; défaut 80)
# ---------------------------------------------------------------------------
if [ -n "$PORT" ] && [ "$PORT" != "80" ]; then
    sed -ri "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
    sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

# ---------------------------------------------------------------------------
# 2. Clés JWT : générées au premier démarrage si absentes
#    (JWT_PASSPHRASE doit être défini dans les variables d'environnement)
# ---------------------------------------------------------------------------
if [ ! -f config/jwt/private.pem ]; then
    echo ">> Génération des clés JWT…"
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa \
        -pkeyopt rsa_keygen_bits:4096 -pass pass:"${JWT_PASSPHRASE:?JWT_PASSPHRASE manquant}"
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem \
        -pubout -passin pass:"$JWT_PASSPHRASE"
    chown -R www-data:www-data config/jwt
fi

# ---------------------------------------------------------------------------
# 3. Cache Symfony + schéma de base de données
# ---------------------------------------------------------------------------
php bin/console cache:clear --no-warmup 2>&1 || true
php bin/console cache:warmup 2>&1 || true

echo ">> Mise à jour du schéma de base de données…"
php bin/console doctrine:schema:update --force --complete 2>&1 || \
    echo "!! Échec schéma (vérifiez DATABASE_URL) — le serveur démarre quand même."

chown -R www-data:www-data var

# ---------------------------------------------------------------------------
# 4. Apache au premier plan
# ---------------------------------------------------------------------------
exec apache2-foreground

# ---------------------------------------------------------------------------
# Image de production du backend Symfony (utilisée par Render, Koyeb, etc.)
# ---------------------------------------------------------------------------
FROM php:8.3-apache

# Extensions PHP requises (PostgreSQL, MySQL, SQLite, intl, zip, opcache)
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip openssl \
        libpq-dev libicu-dev libzip-dev libsqlite3-dev \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql pdo_mysql pdo_sqlite intl zip opcache \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV APP_ENV=prod \
    APP_DEBUG=0 \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# Dépendances d'abord (meilleur cache Docker)
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --no-progress --no-interaction

# Code applicatif
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

# DocumentRoot Apache -> public/
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
        /etc/apache2/sites-available/*.conf /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Réglages PHP de production
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'expose_php=0'; \
    } > /usr/local/etc/php/conf.d/prod.ini

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && mkdir -p var config/jwt \
    && chown -R www-data:www-data var config/jwt

EXPOSE 80
CMD ["/entrypoint.sh"]

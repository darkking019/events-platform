FROM php:8.3-fpm-alpine

# Instala Nginx + dependências PHP
RUN apk add --no-cache \
    nginx \
    bash \
    libzip-dev \
    zip unzip git curl \
    && docker-php-ext-install pdo_mysql zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# App
WORKDIR /var/www/html
COPY . .

# Dependências Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction \
 && mkdir -p storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# 👉 nginx.conf PRINCIPAL
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 👉 server (default)
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Limpa caches Laravel
RUN php artisan optimize:clear || true


# Start PHP-FPM + Nginx
CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"


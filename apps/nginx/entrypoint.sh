#!/bin/sh

# Первоначальное получение сертификата
certbot --nginx -d vududu.ru -d www.vududu.ru --agree-tos --email snezhinka.alisa@gmail.com --no-eff-email --redirect --non-interactive

# Запуск NGINX в фоне
nginx -g 'daemon off;' &
# Планировщик для автоматического продления сертификатов
while :; do
  sleep 12h
  certbot renew
done

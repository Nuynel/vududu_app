FROM nginx:latest

# Устанавливаем Certbot
RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx


# Скрипт для запуска NGINX и автоматического обновления сертификатов
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]

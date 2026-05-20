# Live Server Deployment Guide

This guide explains how to deploy the M-Pesa QR Payment System to a live production server (e.g., VPS on DigitalOcean, AWS, Linode) using Docker Compose and configure Safaricom Daraja API callbacks.

## Prerequisites

Ensure the following are installed on your live server:
1. **Docker** (version 20.10+)
2. **Docker Compose** (version 2.0+)
3. A domain name pointed to your server IP (e.g., `realedgeventure.com` with an `A` record).

---

## Step 1: Configuration

1. SSH into your server.
2. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url> qr-payment-system
   cd qr-payment-system
   ```
3. Update environment variables in the `docker-compose.yml` or create an overrides file. Under the `backend` service, replace:
   * `SECRET_KEY`: A random secure string for Django.
   * `ALLOWED_HOSTS`: Add your custom domain (e.g., `realedgeventure.com`).
   * `CORS_ALLOWED_ORIGINS`: Add your custom domain with `https://`.
   * `DARAJA_ENV`: Change to `production` when deploying to live Safaricom API.
   * `DARAJA_CONSUMER_KEY` & `DARAJA_CONSUMER_SECRET`: Your Safaricom Developer Portal credentials.
   * `DARAJA_BUSINESS_SHORTCODE`: Your M-Pesa Paybill / Till shortcode.
   * `DARAJA_PASSKEY`: Your Lipa Na M-Pesa Online passkey.
   * `DARAJA_CALLBACK_URL`: Must be an HTTPS url pointing to your webhook receiver: `https://realedgeventure.com/api/payments/mpesa/callback/`.

---

## Step 2: Build & Start Containers

Build and launch the services in the background:
```bash
docker compose up -d --build
```

Verify that all containers are healthy:
```bash
docker compose ps
```

---

## Step 3: Run Database Migrations & Collect Static

The backend container is configured to automatically run migrations on startup, but you can manually execute them:
```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

Create a superuser to access the Django admin portal (`/admin/`):
```bash
docker compose exec backend python manage.py createsuperuser
```

---

## Step 4: HTTPS & SSL Setup (Certbot)

Safaricom Daraja API requires HTTPS for payment callback webhooks. You can set up free SSL certificates using Let's Encrypt / Certbot.

1. **Install Certbot on host:**
   ```bash
   sudo apt update
   sudo apt install certbot -y
   ```
2. **Stop Nginx container briefly to free port 80 for verification:**
   ```bash
   docker compose stop frontend
   ```
3. **Request certificate:**
   ```bash
   sudo certbot certonly --standalone -d realedgeventure.com -d www.realedgeventure.com
   ```
4. **Configure Nginx to serve HTTPS:**
   Create an SSL Nginx config or mount SSL directories. Update your root `nginx.conf` to handle SSL redirecting:
   ```nginx
   server {
       listen 80;
       server_name realedgeventure.com www.realedgeventure.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name realedgeventure.com www.realedgeventure.com;

       ssl_certificate /etc/letsencrypt/live/realedgeventure.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/realedgeventure.com/privkey.pem;
       
       # (Include rest of original locations here...)
   }
   ```
5. **Update `docker-compose.yml` to map host Let's Encrypt directory to the frontend container:**
   ```yaml
   frontend:
     ...
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
       - /etc/letsencrypt:/etc/letsencrypt:ro
       - static_volume:/app/static:ro
       - media_volume:/app/media:ro
   ```
6. **Restart containers:**
   ```bash
   docker compose up -d
   ```

---

## Step 5: Safaricom Daraja Webhook Registration

To receive payment confirmations:
1. Log in to the [Safaricom Developer Portal](https://developer.safaricom.co.ke/).
2. Create an App and select the **Lipa Na M-Pesa Sandbox** (or go Live when ready).
3. If using C2B (QR scanning), register your confirmation URLs pointing to `https://realedgeventure.com/api/payments/mpesa/callback/`.
4. Ensure your webhook route `/api/payments/mpesa/callback/` is reachable and returns HTTP status `200` to avoid Safaricom blacklisting your callback URL.

---

## Troubleshooting & Diagnostics

### View Logs
Check application logs in real time:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart Services
```bash
docker compose restart backend
```

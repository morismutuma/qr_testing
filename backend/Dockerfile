# Use lightweight Python base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set work directory
WORKDIR /app

# Install system dependencies needed for compiling psycopg2 and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
# Add psycopg2-binary to requirements on production build if postgres is used,
# or we can install it here directly. Let's install it here so PostgreSQL works out of the box in the Docker compose!
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir psycopg2-binary==2.9.10

# Copy project files
COPY . /app/

# Expose port
EXPOSE 8000

# Start server using Gunicorn after running migrations
CMD python manage.py migrate && gunicorn qr_payment_system.wsgi:application --bind 0.0.0.0:8000 --workers 3

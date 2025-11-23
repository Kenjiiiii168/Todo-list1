FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies including gunicorn
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt gunicorn

# Copy the rest of the application
COPY . .

# Set PYTHONPATH so Python can find the app module
ENV PYTHONPATH=/app

# Expose port 5000
EXPOSE 5000

# Start command - run from /app directory
WORKDIR /app/app
CMD ["gunicorn", "wsgi:application", "--bind", "0.0.0.0:5000", "--workers", "2"]

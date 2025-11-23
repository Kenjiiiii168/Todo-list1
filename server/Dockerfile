FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies including gunicorn
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt gunicorn

# Copy the rest of the application
COPY . .

# Set working directory to Login folder where app.py is
WORKDIR /app/Login

# Expose port 5000
EXPOSE 5000

# Start command
CMD ["gunicorn", "wsgi:application", "--bind", "0.0.0.0:5000", "--workers", "2"]

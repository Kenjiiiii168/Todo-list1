FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --break-system-packages -r requirements.txt

# Copy the rest of the application
COPY . .

# Set working directory to Login folder
WORKDIR /app/Login

# Expose port (Railway will set PORT env var)
EXPOSE $PORT

# Start command
CMD ["python", "-m", "gunicorn", "wsgi:application", "--bind", "0.0.0.0:$PORT", "--workers", "2"]


FROM python:3.11-slim

# Install pkg-config and default-libmysqlclient-dev required for PyMySQL or MySQLdb natively, though pymysql works without it.
# Kept slim.

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source and trained models
COPY backend /app/backend
COPY model_training /app/model_training

# Optional: Add any pre-trained keys or env vars here, though better passed via Docker Compose
ENV DATABASE_URL=mysql+pymysql://root:password@mysql-db:3306/churn_db

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

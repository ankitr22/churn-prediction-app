from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import router

# Create the database tables if they do not exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Failed to create tables (might need to configure DB first): {e}")

app = FastAPI(title="Churn Prediction API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For demo/development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Churn Prediction API is running!"}

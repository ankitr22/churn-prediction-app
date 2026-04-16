from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.database import get_db
from backend.models import User
from backend.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user
)
from backend.predictor import predict_churn
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/auth/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me")
def get_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@router.post("/predict")
async def predict(
    file: UploadFile = File(...), 
    current_user: str = Depends(get_current_user)
):
    if not file.filename.endswith(('.csv', '.xls', '.xlsx')):
        raise HTTPException(status_code=400, detail="File must be a CSV or Excel file")
    
    content = await file.read()
    try:
        import os
        result_csv_bytes = predict_churn(content, file.filename)
        
        # We always output CSV text, so force the downloaded file to have a .csv extension
        base_filename = os.path.splitext(file.filename)[0]
        download_name = f"predicted_{base_filename}.csv"
        
        return Response(
            content=result_csv_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={download_name}",
                     "Access-Control-Expose-Headers": "Content-Disposition"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

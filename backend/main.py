from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Depends,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from PIL import Image

import io

from pydantic import BaseModel

from sqlalchemy.orm import Session

from backend.model import predict_plant
from backend.recommendations import get_recommendation

from backend.database import (
    Base,
    engine,
    get_db
)

from backend.user_model import User

from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

from datetime import timedelta


# =====================================================
# DATABASE
# =====================================================

Base.metadata.create_all(
    bind=engine
)


# =====================================================
# APP
# =====================================================

app = FastAPI(
    title="Agri Smart AI",
    description="AI Plant Disease Detection & Recommendation API"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Agri Smart AI API is running!"
    }


# =====================================================
# AUTH SCHEMAS
# =====================================================

class RegisterRequest(BaseModel):

    username: str

    email: str

    password: str


class LoginRequest(BaseModel):

    username: str

    password: str


# =====================================================
# REGISTER
# =====================================================

@app.post("/register")
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # Check username

    existing_username = (
        db.query(User)
        .filter(
            User.username
            == user_data.username
        )
        .first()
    )

    if existing_username:

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )


    # Check email

    existing_email = (
        db.query(User)
        .filter(
            User.email
            == user_data.email
        )
        .first()
    )

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    # Create user

    hashed_password = hash_password(
        user_data.password
    )


    new_user = User(

        username=user_data.username,

        email=user_data.email,

        hashed_password=hashed_password
    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {

        "message": "User registered successfully",

        "username": new_user.username,

        "email": new_user.email
    }


# =====================================================
# LOGIN
# =====================================================

@app.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.username
            == user_data.username
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )


    password_correct = verify_password(

        user_data.password,

        user.hashed_password
    )


    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )


    access_token_expires = timedelta(

        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )


    access_token = create_access_token(

        data={
            "sub": user.username
        },

        expires_delta=access_token_expires
    )


    return {

        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "username": user.username
    }


# =====================================================
# CURRENT USER
# =====================================================

@app.get("/me")
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):

    return {

        "id": current_user.id,

        "username": current_user.username,

        "email": current_user.email
    }


# =====================================================
# PREDICT
# =====================================================

@app.post("/predict")
async def predict(

    file: UploadFile = File(...),

    current_user: User = Depends(
        get_current_user
    )
):

    # =================================================
    # READ IMAGE
    # =================================================

    contents = await file.read()


    image = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")


    # =================================================
    # MODEL PREDICTION
    # =================================================

    predicted_class, confidence = predict_plant(
        image
    )


    # =================================================
    # SPLIT CLASS
    # =================================================

    parts = predicted_class.split("___")


    plant = parts[0].replace(
        "_",
        " "
    ).strip()


    condition = (

        parts[1]
        .replace("_", " ")
        .strip()

        if len(parts) > 1

        else "Unknown"
    )


    # =================================================
    # HEALTHY
    # =================================================

    healthy = (
        "healthy"
        in condition.lower()
    )


    # =================================================
    # CONFIDENCE
    # =================================================

    if confidence >= 0.90:

        confidence_level = "Very High"

    elif confidence >= 0.75:

        confidence_level = "High"

    elif confidence >= 0.60:

        confidence_level = "Medium"

    else:

        confidence_level = "Low"


    # =================================================
    # RECOMMENDATION
    # =================================================

    if confidence < 0.60:

        recommendation = {

            "status": "uncertain",

            "message":
                "The model is not confident enough. "
                "Please upload a clearer image.",

            "actions": [

                "Take a clear picture of the affected leaf.",

                "Make sure the leaf is well illuminated.",

                "Avoid blurry or distant images."
            ]
        }


    elif healthy:

        recommendation = {

            "status": "healthy",

            "message":
                "The plant appears to be healthy.",

            "actions": [

                "Continue regular monitoring.",

                "Maintain appropriate irrigation.",

                "Monitor the plant for new symptoms."
            ]
        }


    else:

        recommendation = get_recommendation(
            predicted_class
        )


    # =================================================
    # RESPONSE
    # =================================================

    return {

        "user": current_user.username,

        "plant": plant,

        "condition": condition,

        "confidence": round(
            confidence * 100,
            2
        ),

        "confidence_level":
            confidence_level,

        "healthy":
            healthy,

        "recommendation":
            recommendation
    }
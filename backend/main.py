from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from backend.model import predict_plant
from backend.recommendations import get_recommendation


app = FastAPI(
    title="Agri Smart AI",
    description="AI Plant Disease Detection API"
)


# ================= CORS =================

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


# ================= HOME =================

@app.get("/")
def home():

    return {
        "message": "Agri Smart AI API is running!"
    }


# ================= PREDICT =================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # Read uploaded image
    contents = await file.read()

    # Open image
    image = Image.open(
        io.BytesIO(contents)
    ).convert("RGB")

    # Model prediction
    predicted_class, confidence = predict_plant(
        image
    )

    # Split class name
    parts = predicted_class.split("___")

    plant = parts[0].replace(
        "_",
        " "
    ).strip()

    condition = (
        parts[1].replace("_", " ").strip()
        if len(parts) > 1
        else "Unknown"
    )

    # Healthy?
    healthy = (
        "healthy"
        in condition.lower()
    )

    # Confidence level
    if confidence >= 0.90:
        confidence_level = "Very High"

    elif confidence >= 0.75:
        confidence_level = "High"

    elif confidence >= 0.60:
        confidence_level = "Medium"

    else:
        confidence_level = "Low"

    # Recommendation
    recommendation = get_recommendation(
        predicted_class
    )

    return {

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
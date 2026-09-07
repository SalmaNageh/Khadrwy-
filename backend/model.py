import tensorflow as tf
import numpy as np
import json

from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


MODEL_PATH = "backend/best_plant_mobilenet.keras"
CLASS_PATH = "backend/class_names.json"


# Load model
model = tf.keras.models.load_model(MODEL_PATH)


# Load class names
with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)


def predict_plant(image: Image.Image):

    # RGB
    image = image.convert("RGB")

    # Resize
    image = image.resize((224, 224))

    # NumPy
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # IMPORTANT:
    # Same preprocessing used during training
    image_array = preprocess_input(image_array)

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Prediction
    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    # Best class
    predicted_index = int(
        np.argmax(predictions)
    )

    confidence = float(
        predictions[predicted_index]
    )

    predicted_class = class_names[
        predicted_index
    ]

    return predicted_class, confidence
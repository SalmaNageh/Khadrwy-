# 🌱 Khadrwy — AI Agricultural System

**Khadrwy** is an AI-powered agricultural system designed to help farmers and agricultural users detect plant diseases, understand plant health problems, and get reliable agricultural guidance using **Computer Vision, RAG, and Generative AI**.

The system combines an AI Plant Doctor with an intelligent agricultural assistant to provide practical, evidence-grounded recommendations.

---

## 🚀 Project Overview

Khadrwy is built around two main components:

### 🩺 1. AI Plant Doctor

Users can upload an image of a plant or leaf, and Khadrwy analyzes it using a trained **MobileNetV2** deep learning model.

The system provides:

* 🌿 Plant identification
* 🦠 Disease/condition prediction
* 📊 Prediction confidence
* 💡 Agricultural recommendations
* 🔎 Plant health analysis

The current classification model supports **38 plant conditions/classes** and was trained on approximately **54,000 images**.

---

### 🤖 2. Khadrwy AI Agricultural Assistant

Khadrwy includes an AI assistant that uses **Retrieval-Augmented Generation (RAG)** to answer agricultural questions based on a curated agricultural knowledge base.

The assistant combines:

```text
User Question
      ↓
RAG Retriever
      ↓
FAISS + Semantic Search
      ↓
Agricultural Knowledge
      ↓
Gemini
      ↓
Grounded Agricultural Answer
```

The assistant can use:

* General agricultural knowledge
* Retrieved knowledge-base documents
* Plant diagnosis context
* Disease/condition information
* Future sensor measurements

The goal is to reduce unsupported AI answers and provide responses grounded in available agricultural information.

---

# ✨ Main Features

## 🩺 AI Plant Doctor

* Upload plant/leaf images
* AI-based plant disease classification
* MobileNetV2 model
* Confidence score
* Agricultural recommendations
* Clean and interactive web interface

---

## 🤖 AI Agricultural Assistant

* Natural language agricultural questions
* Arabic and English support
* RAG-based retrieval
* FAISS vector similarity search
* Multilingual sentence embeddings
* Gemini-powered answer generation
* Context-aware responses
* Source references

---

## 📚 Agricultural Knowledge Base

Khadrwy contains a curated agricultural knowledge base covering topics such as:

* 🌱 Plant health
* 💧 Irrigation
* 🌡️ Environmental conditions
* 🌾 Soil
* 🧪 Plant nutrition
* 🦠 Plant diseases
* 🐛 Pest monitoring
* 🌿 Crop cultivation
* 🍅 Tomato
* 🌽 Corn
* 🥔 Potato
* 🥒 Cucumber
* 🧅 Onion
* 🌾 Wheat
* 🍎 Apple
* 🫑 Pepper
* 🥬 Lettuce
* Greenhouse management
* Smart agriculture
* Early plant stress detection

---

# 🧠 AI Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             Plant Image                      User Question
                    │                               │
                    ▼                               ▼
              MobileNetV2                    RAG Retriever
                    │                               │
                    ▼                               ▼
          Plant / Condition /             Sentence Transformer
             Confidence                         │
                                                    ▼
                                                 FAISS
                                                    │
                                                    ▼
                                          Agricultural Knowledge
                                                    │
                    ┌───────────────────────────────┘
                    │
                    ▼
                 Gemini
                    │
                    ▼
          Grounded AI Response
```

---

# 🧬 Machine Learning Model

Khadrwy currently uses **MobileNetV2** for plant disease classification.

### Model Pipeline

```text
Input Image
     ↓
Resize to 224 × 224
     ↓
MobileNetV2 Preprocessing
     ↓
MobileNetV2
     ↓
Classification
     ↓
Plant + Condition + Confidence
```

### Model Information

| Property          | Value                        |
| ----------------- | ---------------------------- |
| Model             | MobileNetV2                  |
| Input Size        | 224 × 224                    |
| Dataset Size      | ~54,000 images               |
| Number of Classes | 38                           |
| Framework         | TensorFlow / Keras           |
| Output            | Plant condition + confidence |

The trained model is stored in:

```text
backend/best_plant_mobilenet.keras
```

Class names are stored in:

```text
backend/class_names.json
```

---

# 🔎 RAG System

Khadrwy uses **Retrieval-Augmented Generation** to improve the reliability of the AI assistant.

### Retrieval Pipeline

```text
User Query
    ↓
Text Normalization
    ↓
Multilingual Embedding
    ↓
FAISS Similarity Search
    ↓
Relevant Agricultural Documents
    ↓
Context Construction
    ↓
Gemini
    ↓
Final Answer
```

### Technologies

* Sentence Transformers
* `paraphrase-multilingual-MiniLM-L12-v2`
* FAISS
* Gemini
* Custom agricultural knowledge base

The retriever also considers agricultural topics, plant names, diseases, symptoms, and other relevant metadata when ranking documents.

---

# 🌍 Multilingual Support

Khadrwy is designed to support both:

* 🇪🇬 Arabic
* 🇬🇧 English

The RAG system includes Arabic text normalization to improve semantic retrieval for Arabic agricultural questions.

---

# 🔐 Authentication

Khadrwy includes a user authentication system using:

* Registration
* Login
* JWT authentication
* Password hashing
* Protected AI Assistant endpoint

Authenticated users can access the AI assistant through the protected `/chat` endpoint.

---

# ⚡ Backend

The backend is built using **FastAPI**.

### Main API Endpoints

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| GET    | `/`         | API health check                  |
| POST   | `/register` | Create a new account              |
| POST   | `/login`    | Login                             |
| GET    | `/me`       | Get current user                  |
| POST   | `/predict`  | Analyze plant image               |
| POST   | `/chat`     | Ask the AI agricultural assistant |

Interactive API documentation is available through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend

The frontend is built using:

* HTML
* CSS
* JavaScript

Main sections include:

* 🏠 Home
* 🩺 Plant Doctor
* 📡 Monitoring
* 🤖 AI Assistant
* ℹ️ About

The frontend communicates with the FastAPI backend through REST APIs.

---

# 📁 Project Structure

```text
Khadrwy/
│
├── backend/
│   │
│   ├── main.py
│   ├── model.py
│   ├── auth.py
│   ├── database.py
│   ├── user_model.py
│   ├── recommendations.py
│   ├── best_plant_mobilenet.keras
│   ├── class_names.json
│   │
│   └── rag/
│       │
│       ├── retriever.py
│       ├── generator.py
│       ├── knowledge_base.py
│       ├── fao_loader.py
│       │
│       └── sources/
│           └── fao/
│
├── frontend/
│   │
│   ├── index.htm
│   ├── script.js
│   └── style.css
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/SalmaNageh/Khadrwy-
```

Then:

```bash
cd Khadrwy
```

---

## 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.5-flash
```

⚠️ **Never upload your real API key to GitHub.**

Make sure `.env` is included in `.gitignore`.

---

# ▶️ Running the Backend

From the project root:

```bash
python -m uvicorn backend.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🌐 Running the Frontend

Open the `frontend` folder using VS Code and start it using **Live Server**.

For example:

```text
http://127.0.0.1:5500
```

The frontend communicates with:

```text
http://127.0.0.1:8000
```

---

# 📸 Plant Analysis Workflow

```text
User
 ↓
Upload Plant Image
 ↓
FastAPI /predict
 ↓
MobileNetV2
 ↓
Prediction
 ↓
Plant + Condition + Confidence
 ↓
Agricultural Recommendation
```

Example:

```json
{
    "plant": "Tomato",
    "condition": "Tomato Early Blight",
    "confidence": 91.4
}
```

---

# 💬 AI Assistant Workflow

The assistant can work in two situations.

### General Agricultural Question

```text
User:
أفضل طريقة لري الطماطم؟

        ↓

RAG Retrieval

        ↓

Tomato Agricultural Knowledge

        ↓

Gemini

        ↓

Agricultural Answer
```

### Question Related to Previous Diagnosis

```text
Plant Image
    ↓
AI Diagnosis
    ↓
Tomato / Disease / Confidence
    ↓
User asks about the diagnosed plant
    ↓
Diagnosis Context + RAG
    ↓
Gemini
    ↓
Context-aware Answer
```

Khadrwy intentionally avoids automatically attaching an old diagnosis to unrelated questions.

---

# 📡 Future Smart Monitoring System

The next stage of Khadrwy is a smart agricultural monitoring system using sensors.

Planned sensors include:

* 🌱 Soil Moisture Sensor
* 🌡️ DHT22 Temperature & Humidity Sensor
* 💡 BH1750 Light Sensor

Planned monitoring data:

```text
Timestamp
Temperature_C
Humidity_pct
Soil_Moisture_pct
Light_Intensity
Pump_Status
```

Future versions may support:

```text
Sensor Data
     ↓
Plant/Farm Monitoring
     ↓
AI Analysis
     ↓
Irrigation Decision
     ↓
Automatic Pump Control
```

---

# 🔮 Future Improvements

* 🌱 YOLO-based leaf detection
* 📷 Better handling of distant/whole-plant images
* 📡 Real-time IoT sensor integration
* 💧 Automated irrigation
* 🧠 Improved agricultural RAG
* 📚 More scientific agricultural sources
* 🌍 More Arabic agricultural content
* 📊 Farm monitoring dashboard
* 📈 Historical plant health tracking
* 🔔 Smart alerts
* 👨‍🌾 Personalized farm recommendations
* ☁️ Cloud deployment
* 📱 Mobile application

---

# 🛠️ Technologies

### AI / Machine Learning

* Python
* TensorFlow
* Keras
* MobileNetV2
* Computer Vision
* Sentence Transformers
* FAISS
* RAG
* Gemini

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* SQLite
* Pydantic

### Frontend

* HTML5
* CSS3
* JavaScript

### Development

* VS Code
* Git
* GitHub

---

# 🎯 Project Goals

Khadrwy aims to make agricultural AI more accessible by combining:

> **Computer Vision + Retrieval-Augmented Generation + Agricultural Knowledge + Smart Monitoring**

The long-term goal is to create an integrated agricultural assistant that can understand:

* 📷 What the plant looks like
* 🦠 What condition it may have
* 🌱 What agricultural factors may be involved
* 💧 What the environmental conditions are
* 🤖 What action the farmer should consider

---

# ⚠️ Disclaimer

Khadrwy provides AI-assisted agricultural information and should not be considered a replacement for a qualified agricultural specialist.

AI predictions may be uncertain, and recommendations should be evaluated according to the actual farm conditions, crop variety, environment, and local agricultural guidelines.

---
# 👩‍💻 Development Team

### Salma Nageh

**AI / Machine Learning / RAG Developer**

Responsible for:

* Machine Learning & Deep Learning models
* Plant disease classification
* Computer Vision
* RAG pipeline
* FAISS semantic retrieval
* Gemini integration
* Agricultural Knowledge Base
* AI Assistant backend logic

### Menna

**Frontend & Backend Developer**

Responsible for:

* Frontend development
* Web interface and user experience
* Backend development
* FastAPI integration
* API communication
* Authentication and system integration

---

## 🤝 Teamwork

Khadrwy is developed as a collaborative AI agriculture project, combining:

**AI & Machine Learning + Backend + Frontend + Smart Agriculture**


# ⭐ Project Status

🚧 **Active Development**

Khadrwy is currently under development, with the AI Plant Doctor and RAG Agricultural Assistant implemented and the smart monitoring/IoT system planned for future development.

---

## 🌱 Khadrwy

**Smart AI for healthier plants and smarter agriculture.**

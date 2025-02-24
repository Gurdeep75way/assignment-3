import os
import sys
import joblib
import json
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "InventoryDB"

# API Configuration
HOST = "0.0.0.0"
PORT = 8000

# Model Path
MODEL_PATH = "models/demand_forecast.pkl"
ENCODER_PATH = "models/label_encoder.pkl" 
SCALER_PATH = "models/scaler_file.pkl"

app = FastAPI(title="AI Inventory API", version="1.4")

# ✅ Load Model & Encoder
try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"❌ Model file not found: {MODEL_PATH}")

    model = joblib.load(MODEL_PATH)
    print("✅ Model Loaded Successfully!")

    # ✅ Check expected feature names
    expected_features = model.feature_names_in_ if hasattr(model, "feature_names_in_") else None
    print(f"✅ Model expects features: {expected_features}")

except Exception as e:
    print(f"❌ Error Loading Model: {e}")
    model = None  # Prevent crashes if loading fails

# ✅ Load Label Encoder
try:
    if not os.path.exists(ENCODER_PATH):
        raise FileNotFoundError(f"❌ Encoder file not found: {ENCODER_PATH}")

    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ Label Encoder Loaded Successfully!")

except Exception as e:
    print(f"❌ Error Loading Label Encoder: {e}")
    label_encoder = None

# ✅ Load Scaler
try:
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"❌ Scaler file not found: {SCALER_PATH}")

    scaler = joblib.load(SCALER_PATH)
    print("✅ Scaler Loaded Successfully!")

except Exception as e:
    print(f"❌ Error Loading Scaler: {e}")
    scaler = None

# ✅ Connect to MongoDB
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    print("✅ Connected to MongoDB!")
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    db = None


@app.get("/")
def home():
    """API Health Check"""
    return {"message": "✅ AI Inventory API is running successfully!"}

CATEGORY_MAPPING = {
    "Groceries": 0,
    "Electronics": 1,
    "Clothing": 2,
    "Furniture": 3
}

class InputFeatures(BaseModel):
    category: str
    item_id: int
    price_per_unit: float
    quantity: int
    prev_sales: int
    day_of_week: int
    month: int
    is_weekend: int
    price_x_prev_sales: float
    price_x_dayofweek: float
    price_x_is_weekend: float

@app.post("/predict/")
async def predict_demand(features: InputFeatures):
    try:
        # Convert category to numerical value
        if features.category not in CATEGORY_MAPPING:
            raise HTTPException(status_code=400, detail=f"Invalid category: {features.category}")

        category_encoded = CATEGORY_MAPPING[features.category]

        # Prepare input for the model
        input_data = [
            category_encoded,  # Encoded category
            features.item_id,
            features.price_per_unit,
            features.quantity,
            features.prev_sales,
            features.day_of_week,
            features.month,
            features.is_weekend,
            features.price_x_prev_sales,
            features.price_x_dayofweek,
            features.price_x_is_weekend
        ]

        # Convert to NumPy array and reshape for model
        input_data = np.array(input_data).reshape(1, -1)

        # Apply feature scaling
        input_data = scaler.transform(input_data)

        # Debugging: Print final input
        print("Final Input to Model:", input_data)

        # Predict demand
        prediction = model.predict(input_data)
        return {"predicted_demand": float(np.expm1(prediction[0]))}  # Convert back from log scale

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

@app.get("/inventory/")
def get_inventory():
    """Fetch inventory details from MongoDB."""
    if db is None:
        raise HTTPException(status_code=500, detail="❌ Database connection failed.")

    try:
        inventory = list(db.inventory.find({}, {"_id": 0}))  # Exclude MongoDB _id
        return {"inventory": inventory}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory: {e}")


@app.get("/sales/")
def get_sales():
    """Fetch sales data from MongoDB."""
    if db is None:
        raise HTTPException(status_code=500, detail="❌ Database connection failed.")

    try:
        sales = list(db.sales.find({}, {"_id": 0}))  # Exclude MongoDB _id
        return {"sales": sales}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sales: {e}")


# ✅ Run API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

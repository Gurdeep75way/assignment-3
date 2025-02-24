import pickle
import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

# ✅ Initialize FastAPI App
app = FastAPI(title="Sales Forecasting API")

# ✅ Load Model & Features
MODEL_PATH = "models/sales_forecasting_model.pkl"
DATASET_PATH = "cleaned_dataset.csv"

# Load model if available
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
else:
    model = None

# ✅ Define Request Schema
class SalesPredictionRequest(BaseModel):
    item_id: int
    category: int
    user_id: int
    supplier_id: int
    warehouse_id: int
    stock_level: float
    restock_threshold: float
    profit_margin: float
    space_utilization: float
    total_stock_value: float
    operating_costs: float
    profit_generated: float
    staff_count: int
    avg_sales_7d: float
    avg_sales_30d: float
    profit_per_unit: float
    discount_rate: float
    adjusted_restock_time: float
    year: int
    month: int
    day: int
    weekday: int

# ✅ Health Check Endpoint
@app.get("/")
def root():
    return {"message": "🚀 Sales Forecasting API is Running!"}

# ✅ Prediction Endpoint
@app.post("/predict")
def predict_sales(data: SalesPredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not found. Train the model first!")

    input_data = pd.DataFrame([data.dict()])  # Convert request data to DataFrame
    prediction = model.predict(input_data)[0]  # Make prediction
    return {"predicted_quantity": round(prediction, 2)}

# # ✅ Run FastAPI with Uvicorn
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
import os
import pickle
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.ensemble import GradientBoostingRegressor, IsolationForest
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
# ✅ Load Config Variables
from config import MONGO_URI, DB_NAME

app = FastAPI()

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ✅ Load Pre-trained Models
MODEL_PATH = "models/demand_forecasting.pkl"
ENCODER_PATH = "models/label_encoder.pkl"
SCALER_PATH = "models/scaler.pkl"
ANOMALY_MODEL_PATH = "models/anomaly_model.pkl"

model = pickle.load(open(MODEL_PATH, "rb"))
label_encoder = pickle.load(open(ENCODER_PATH, "rb"))
scaler = pickle.load(open(SCALER_PATH, "rb"))
anomaly_model = pickle.load(open(ANOMALY_MODEL_PATH, "rb"))

# ✅ Fetch Data from MongoDB
def fetch_collection(collection_name):
    data = list(db[collection_name].find())
    return pd.DataFrame(data) if data else pd.DataFrame()

# ✅ Load & Merge Data
def load_data():
    sales = fetch_collection("sales")
    inventory = fetch_collection("inventory")
    warehouse = fetch_collection("warehouse")
    suppliers = fetch_collection("suppliers")

    if sales.empty or inventory.empty:
        return pd.DataFrame()

    df = pd.merge(sales, inventory, on="item_id", how="left")
    df = pd.merge(df, warehouse, on="warehouse_id", how="left")
    df = pd.merge(df, suppliers, on="supplier_id", how="left")

    df["total_revenue"] = df["price"] * df["quantity"]
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    return df

df = load_data()

# ✅ API Routes

@app.get("/")
def home():
    return {"message": "Welcome to Inventory & Demand Forecasting API"}

@app.get("/fetch_data/{collection_name}")
def fetch_data(collection_name: str):
    data = fetch_collection(collection_name)
    return {"data": data.to_dict(orient="records")}

@app.get("/forecast_demand")
def forecast_demand():
    """Predict future demand based on trained model"""
    if df.empty:
        return {"error": "No data available"}
    
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["is_weekend"] = df["day_of_week"].apply(lambda x: 1 if x >= 5 else 0)
    df["prev_sales"] = df.groupby("item_id")["quantity"].shift(1).fillna(0)
    
    features = ["item_id", "price", "prev_sales", "day_of_week", "month", "is_weekend"]
    X = df[features]
    
    X["item_id"] = label_encoder.transform(X["item_id"])
    X_scaled = scaler.transform(X)
    
    predictions = np.expm1(model.predict(X_scaled))
    df["predicted_demand"] = predictions
    
    return {"predictions": df[["item_id", "predicted_demand"]].to_dict(orient="records")}

@app.get("/anomaly_detection")
def detect_anomalies():
    """Detect anomalies using Isolation Forest"""
    if df.empty:
        return {"error": "No data available"}
    
    features = ["item_id", "price", "prev_sales", "day_of_week", "month", "is_weekend"]
    X = df[features]
    
    X["item_id"] = label_encoder.transform(X["item_id"])
    X_scaled = scaler.transform(X)
    
    df["anomaly_score"] = anomaly_model.decision_function(X_scaled)
    df["is_anomaly"] = anomaly_model.predict(X_scaled)
    
    anomalies = df[df["is_anomaly"] == -1]
    
    return {"anomalies": anomalies.to_dict(orient="records")}

@app.get("/supplier_performance")
def supplier_performance():
    """Analyze supplier performance"""
    if df.empty:
        return {"error": "No data available"}
    
    df_suppliers = df.groupby("supplier_id")["delivery_time"].mean().to_dict()
    
    return {"supplier_performance": df_suppliers}

@app.get("/simulate_future_demand/{days}")
def simulate_future_demand(days: int):
    """Simulate future sales for a given number of days"""
    if df.empty:
        return {"error": "No data available"}
    
    future_dates = pd.date_range(df["date"].max(), periods=days)
    X_scaled = scaler.transform(df[["item_id", "price", "prev_sales", "day_of_week", "month", "is_weekend"]].tail(days))
    future_predictions = np.expm1(model.predict(X_scaled))

    predictions = [{"date": str(date.date()), "predicted_sales": round(sales, 2)} 
                   for date, sales in zip(future_dates, future_predictions)]
    
    return {"future_demand": predictions}

@app.get("/automated_replenishment")
def automated_replenishment():
    """Identify items that need restocking"""
    if df.empty:
        return {"error": "No data available"}
    
    reorder_threshold = df["prev_sales"].quantile(0.75)
    df_restock = df[df["stock"] < reorder_threshold]

    return {"items_to_restock": df_restock[["item_id", "stock"]].to_dict(orient="records")}

@app.get("/warehouse_optimization")
def warehouse_optimization():
    """Analyze warehouse efficiency"""
    if df.empty:
        return {"error": "No data available"}
    
    df_warehouse = df.groupby("warehouse_id").agg({"stock": "sum", "total_revenue": "sum"}).reset_index()
    
    return {"warehouse_data": df_warehouse.to_dict(orient="records")}

# ✅ Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

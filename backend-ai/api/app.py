import sys
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd

# 🔹 Add inventory_forecasting to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent / "inventory_forecasting"))

# 🔹 Import models from predict.py
from predict import predicted_demand, anomaly_model, pricing_model
from data_loader import load_data

app = FastAPI()

# ✅ Load Data
users, suppliers, warehouses, products, transactions = load_data()

# ✅ Define request model
class TransactionRequest(BaseModel):
    quantity: int
    product_id: int
    payment_method: str



# ✅ API Endpoint: Predict Future Demand
@app.get("/predict/demand/")
async def get_predicted_demand():
    return {"predicted_demand": predicted_demand.tolist()}

# ✅ API Endpoint: Fraud Detection
@app.post("/predict/fraud/")
async def predict_fraud(transaction: TransactionRequest):
    try:
        # Convert request data to DataFrame
        input_data = pd.DataFrame([transaction.dict()])

        # ✅ Ensure categorical features are encoded properly
        if "payment_method" in input_data.columns:
            input_data["payment_method"] = payment_method_encoder.transform([input_data["payment_method"][0]])[0]

        # ✅ Ensure input_data contains all required features
        trained_features = list(anomaly_model.feature_names_in_)

        # ✅ Handle missing columns
        for feature in trained_features:
            if feature not in input_data.columns:
                input_data[feature] = 0  # Default value (adjust based on your model)

        # ✅ Ensure columns are in correct order
        input_data = input_data[trained_features]

        # ✅ Convert data types to match model expectations
        input_data = input_data.astype(float)

        # ✅ Predict fraud
        fraud_prediction = anomaly_model.predict(input_data)[0]

        return {"fraud_prediction": int(fraud_prediction)}

    except Exception as e:
        return {"error": str(e)}

# ✅ API Endpoint: Optimize Pricing
pricing_model, scaler = train_pricing_model(*load_data())

@app.post("/predict/price/")
async def predict_price(transaction: TransactionRequest):
    try:
        # ✅ Load fresh data
        users, suppliers, warehouses, products, transactions = load_data()

        # ✅ Convert product_id to INT for matching
        products["product_id"] = products["product_id"].astype(int)
        suppliers["supplier_id"] = suppliers["supplier_id"].astype(int)
        transaction.product_id = int(transaction.product_id)

        # ✅ Fetch Product Details
        product_info = products[products["product_id"] == transaction.product_id]

        if product_info.empty:
            raise HTTPException(status_code=404, detail="Product not found")

        product_info = product_info.iloc[0]  # Extract first row

        # ✅ Fetch Supplier Details
        supplier_info = suppliers[suppliers["supplier_id"] == product_info["supplier_id"]]
        reliability_score = supplier_info["reliability_score"].iloc[0] if not supplier_info.empty else 0.5  # Default reliability

        # ✅ Prepare Input Data for Prediction
        input_data = np.array([[
            transaction.quantity,  
            product_info["product_id"],
            product_info["cost_per_unit"],
            product_info["price_per_unit"],
            product_info["stock_level"],
            reliability_score
        ]])

        # ✅ Scale the input data
        input_data_scaled = scaler.transform(input_data)

        # ✅ Predict Optimized Price
        optimized_price = pricing_model.predict(input_data_scaled)[0]

        return {
            "product_id": int(product_info["product_id"]),
            "product_name": product_info["product_name"],
            "category": product_info["category"],
            "cost_per_unit": float(product_info["cost_per_unit"]),
            "price_per_unit": float(product_info["price_per_unit"]),
            "stock_level": int(product_info["stock_level"]),
            "supplier_id": int(product_info["supplier_id"]),
            "reliability_score": float(reliability_score),
            "optimized_price": round(float(optimized_price), 2)  # Rounded for better readability
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ✅ Run the FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

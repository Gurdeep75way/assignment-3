import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from train_tft import train_tft
from train_anomaly import train_anomaly_model
from train_pricing import train_pricing_model
from data_loader import load_data
from feature_engineering import preprocess_data

# ✅ Load Data
users, suppliers, warehouses, products, transactions = load_data()
time_series_data, time_series_scaled, scaler = preprocess_data(transactions)  # Returns 3 values

# ✅ Load Models
tft_model = train_tft(time_series_data)
anomaly_model = train_anomaly_model(transactions)
pricing_model = train_pricing_model(transactions, products, suppliers,warehouses)  # Pass additional data

# ✅ Predict Future Demand
future_days = 7
predicted_demand = []

# 🔹 Convert to NumPy (Ensure only numeric columns)
time_series_scaled = time_series_scaled.select_dtypes(include=[np.number])

# ✅ Check if enough data exists
if time_series_scaled.shape[0] < 30:
    raise ValueError("Insufficient time-series data for demand prediction.")

# Convert to NumPy
current_input = time_series_scaled[-30:].astype(np.float32).to_numpy()[np.newaxis, :, :]

for _ in range(future_days):
    next_day_demand = tft_model.predict(current_input)[0]  # Assuming model uses `.predict()`
    predicted_demand.append(next_day_demand)
    
    # ✅ Ensure shifting is correct
    current_input = np.roll(current_input, shift=-1, axis=1)
    current_input[:, -1, :] = next_day_demand  # Update last position

# ✅ Reshape for inverse transformation
predicted_demand = np.array(predicted_demand).reshape(-1, 1)
predicted_demand = scaler.inverse_transform(predicted_demand)

# ✅ Select only trained features for fraud detection
trained_features = anomaly_model.feature_names_in_
transactions_filtered = transactions[trained_features].copy()

# ✅ Handle categorical encoding properly
label_encoders = {}  # Store encoders for reference
for col in transactions_filtered.select_dtypes(include=["object"]).columns:
    encoder = LabelEncoder()
    transactions_filtered[col] = encoder.fit_transform(transactions_filtered[col])
    label_encoders[col] = encoder  # Store for later use
print("✅ 1")
# ✅ Predict Fraud Anomalies
transactions["fraud_prediction"] = anomaly_model.predict(transactions_filtered)

# ✅ Optimize Pricing (Ensure feature alignment)
pricing_features = list(pricing_model.feature_names_in_)  # Get trained feature names
print("✅ 2")
# 🔹 Check for missing features
missing_features = [f for f in pricing_features if f not in transactions.columns]
if missing_features:
    raise ValueError(f"Missing required columns for pricing model: {missing_features}")
print("✅ 3")
# ✅ Handle missing values before prediction
transactions[pricing_features] = transactions[pricing_features].fillna(0)
print("✅ 4")
# ✅ Predict optimized prices
transactions["optimized_price"] = pricing_model.predict(transactions[pricing_features])

print("✅ All Predictions Completed Successfully!")

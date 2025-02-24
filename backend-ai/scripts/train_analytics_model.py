import pickle
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import shap

# ✅ Load Cleaned Data
df = pd.read_csv("cleaned_dataset.csv")

# ✅ Feature Engineering
df["sales_ratio"] = df["avg_sales_7d"] / (df["avg_sales_30d"] + 1e-5)  # Avoid division by zero
df["profit_to_cost_ratio"] = df["profit_generated"] / (df["operating_costs"] + 1e-5)
df["space_efficiency"] = df["stock_level"] / (df["space_utilization"] + 1e-5)

# ✅ Features & Target Variable
target = "quantity"
features = [
    "item_id", "category", "user_id", "supplier_id", "warehouse_id",
    "stock_level", "restock_threshold", "profit_margin", "space_utilization",
    "total_stock_value", "operating_costs", "profit_generated", "staff_count",
    "avg_sales_7d", "avg_sales_30d", "profit_per_unit", "discount_rate", "adjusted_restock_time",
    "year", "month", "day", "weekday", "sales_ratio", "profit_to_cost_ratio", "space_efficiency"
]

X = df[features]
y = df[target]

# ✅ Normalize Numerical Features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ✅ Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Use Gradient Boosting for Better Accuracy
model = GradientBoostingRegressor(n_estimators=300, learning_rate=0.05, max_depth=5, random_state=42)

# ✅ Train Model
model.fit(X_train, y_train)

# ✅ Evaluate Model
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"📊 Advanced Model Performance:\nMAE: {mae:.2f}, MSE: {mse:.2f}, R²: {r2:.2f}")

# ✅ Feature Importance (SHAP Analysis)
explainer = shap.Explainer(model, X_train)
shap_values = explainer(X_test)
shap.summary_plot(shap_values, X_test)

# ✅ Save Model
os.makedirs("models", exist_ok=True)
with open("models/advanced_sales_forecasting_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("🎯 Advanced model training complete! Saved as `models/advanced_sales_forecasting_model.pkl`.")

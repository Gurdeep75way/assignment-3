import pickle
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import pandas as pd
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME  # Ensure config.py has the correct MongoDB credentials

# ✅ Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ✅ Fetch Data from MongoDB
def fetch_data(collection_name):
    data = list(db[collection_name].find({}, {"_id": 0}))  # Exclude MongoDB's _id
    df = pd.DataFrame(data)

    # ✅ Standardize column names (remove spaces)
    df.columns = df.columns.str.strip()

    # ✅ Ensure warehouse_id & supplier_id are strings for merging
    for col in ["warehouse_id", "supplier_id"]:
        if col in df.columns:
            df[col] = df[col].astype(str)

    return df

# ✅ Load & Merge Data
def load_and_merge_data():
    inventory = fetch_data("inventory")
    sales = fetch_data("sales")
    suppliers = fetch_data("suppliers")
    users = fetch_data("users")
    warehouse = fetch_data("warehouse")

    # ✅ Merge Sales with Inventory
    df = sales.merge(inventory, on="item_id", how="left")

    # ✅ Check & Fix Warehouse ID mismatches
    if "warehouse_id_x" in df.columns and "warehouse_id_y" in df.columns:
        mismatched_warehouses = df[df["warehouse_id_x"] != df["warehouse_id_y"]]

        if not mismatched_warehouses.empty:
            print("⚠️ Mismatched warehouse IDs found, fixing...")
            df["warehouse_id"] = df["warehouse_id_x"].fillna(df["warehouse_id_y"])
        else:
            print("✅ All warehouse IDs match correctly.")
        
        df.drop(columns=["warehouse_id_x", "warehouse_id_y"], inplace=True)

    # ✅ Merge with other tables
    df = df.merge(suppliers, on="supplier_id", how="left")
    df = df.merge(users, on="user_id", how="left")
    df = df.merge(warehouse, on="warehouse_id", how="left")

    # ✅ Fix Missing Category Column
    if "category_x" in df.columns and "category_y" in df.columns:
        df["category"] = df["category_x"].fillna(df["category_y"])
        df.drop(columns=["category_x", "category_y"], inplace=True)
    elif "category" not in df.columns:
        print("⚠️ Category column missing in data!")

    # ✅ Convert Timestamp & Extract Features
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["year"] = df["timestamp"].dt.year
    df["month"] = df["timestamp"].dt.month
    df["day"] = df["timestamp"].dt.day
    df["weekday"] = df["timestamp"].dt.weekday

    # ✅ Rolling Sales Features
    df["avg_sales_7d"] = df.groupby("item_id")["quantity"].transform(lambda x: x.rolling(7, min_periods=1).mean())
    df["avg_sales_30d"] = df.groupby("item_id")["quantity"].transform(lambda x: x.rolling(30, min_periods=1).mean())

    # ✅ Price & Profit Features
    df["profit_per_unit"] = df["selling_price"] - df["cost_per_unit"]
    df["discount_rate"] = (df["discount_applied"] / df["price_per_unit"]).fillna(0)

    # ✅ Supplier Performance
    df["adjusted_restock_time"] = df["average_delivery_time"] * (1 - df["reliability_score"] / 100)

    # ✅ Fill Missing Values
    df.fillna(0, inplace=True)

    return df

# ✅ Encode & Normalize Data
def preprocess_data(df):
    label_encoders = {}

    categorical_features = ["item_id", "category", "user_id", "supplier_id", "warehouse_id", "payment_method"]
    for col in categorical_features:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            label_encoders[col] = le

    # ✅ Normalize Numeric Features
    scaler = MinMaxScaler()
    num_features = [
        "stock_level", "restock_threshold", "profit_margin", "space_utilization",
        "total_stock_value", "operating_costs", "profit_generated", "staff_count",
        "avg_sales_7d", "avg_sales_30d", "profit_per_unit", "discount_rate", "adjusted_restock_time"
    ]
    
    for col in num_features:
        if col in df.columns:
            df[col] = scaler.fit_transform(df[[col]])

    return df, label_encoders, scaler, num_features

# ✅ Save Encoders & Scalers
def save_preprocessing_objects(label_encoders, scaler):
    os.makedirs("models", exist_ok=True)  # Ensure models directory exists
    with open("models/encoders.pkl", "wb") as f:
        pickle.dump(label_encoders, f)
    with open("models/scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)

# ✅ Run Preprocessing
if __name__ == "__main__":
    df = load_and_merge_data()
    df, encoders, scaler, num_features = preprocess_data(df)
    save_preprocessing_objects(encoders, scaler)
    
    # ✅ Save Final Cleaned Data
    df.to_csv("cleaned_dataset.csv", index=False)
    print("🎯 Preprocessing complete! Cleaned dataset saved as `cleaned_dataset.csv`.")

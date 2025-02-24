import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME  # Now Python can find config.py

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def preprocess_csv(file_path, collection_name):
    df = pd.read_csv(file_path)

    # 🔹 Debug: Print available columns
    print(f"Columns in {file_path}: {df.columns.tolist()}")  # ✅ This will help us debug

    df.drop_duplicates(inplace=True)

    # 🔹 Handle Missing Values
    if collection_name == "inventory":
        if "price" in df.columns:  # ✅ Avoid KeyError
            df.fillna({"price": df["price"].median()}, inplace=True)
        else:
            print(f"⚠️ Warning: 'price' column not found in {file_path}")

        if "stock" in df.columns:
            df.fillna({"stock": 0}, inplace=True)

        if "warehouse" in df.columns:
            df.fillna({"warehouse": "Unknown"}, inplace=True)

    # 🔹 Standardize Column Names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # 🔹 Convert Data Types
    if "price" in df.columns:
        df["price"] = pd.to_numeric(df["price"], errors="coerce")
    
    if "stock" in df.columns:
        df["stock"] = pd.to_numeric(df["stock"], errors="coerce")

    # 🔹 Normalize Prices (Min-Max Scaling)
    if "price" in df.columns and df["price"].max() != df["price"].min():
        df["price"] = (df["price"] - df["price"].min()) / (df["price"].max() - df["price"].min())

    return df.to_dict(orient="records")

def load_csv_to_mongo(file_path, collection_name):
    data = preprocess_csv(file_path, collection_name)
    db[collection_name].insert_many(data)
    print(f"Inserted {len(data)} records into {collection_name}")

# Load datasets into MongoDB
load_csv_to_mongo("data/inventory_data.csv", "inventory")
load_csv_to_mongo("data/sales_data.csv", "sales")
load_csv_to_mongo("data/user_data.csv", "users")
load_csv_to_mongo("data/warehouse_data.csv", "warehouse")
load_csv_to_mongo("data/supplier_data.csv", "suppliers")

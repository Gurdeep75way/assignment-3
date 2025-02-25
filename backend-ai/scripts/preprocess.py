import pandas as pd
import numpy as np
import json
from pymongo import MongoClient

# ✅ MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")  # Change this if using MongoDB Atlas
db = client["InventoryDB"]  # Database name

# ✅ Load CSV Data
users = pd.read_csv("./data/users.csv")
suppliers = pd.read_csv("./data/suppliers.csv")
warehouses = pd.read_csv("./data/warehouses.csv")
products = pd.read_csv("./data/products.csv")
transactions = pd.read_csv("./data/transactions.csv")

# ✅ Handle Missing Values
users.fillna("Unknown", inplace=True)
suppliers.fillna({"reliability_score": suppliers["reliability_score"].mean()}, inplace=True)
warehouses.fillna({"capacity": warehouses["capacity"].median()}, inplace=True)
products.fillna({"stock_level": 0}, inplace=True)
transactions.fillna({"total_price": transactions["total_price"].median()}, inplace=True)

# ✅ Convert Data Types
transactions["transaction_date"] = pd.to_datetime(transactions["transaction_date"])

# ✅ Normalize Price Fields
products["cost_per_unit"] = (products["cost_per_unit"] - products["cost_per_unit"].min()) / (products["cost_per_unit"].max() - products["cost_per_unit"].min())
products["price_per_unit"] = (products["price_per_unit"] - products["price_per_unit"].min()) / (products["price_per_unit"].max() - products["price_per_unit"].min())

# ✅ Convert to JSON Format for MongoDB
def df_to_json(df):
    return json.loads(df.to_json(orient="records"))

# ✅ Upload to MongoDB
collections = {
    "users": users,
    "suppliers": suppliers,
    "warehouses": warehouses,
    "products": products,
    "transactions": transactions
}

for collection_name, df in collections.items():
    db[collection_name].delete_many({})  # Clear existing data
    db[collection_name].insert_many(df_to_json(df))
    print(f"✅ Uploaded {collection_name} to MongoDB!")

print("🎉 Data preprocessing and upload completed successfully!")

import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
from random import randint, choice

fake = Faker()
np.random.seed(42)

# ✅ Number of records
num_users = 50_000
num_products = 10_000
num_suppliers = 500
num_warehouses = 200
num_transactions = 1_000_000

# ✅ Generate Users
users = pd.DataFrame({
    "user_id": range(1, num_users + 1),
    "user_name": [fake.name() for _ in range(num_users)],
    "email": [fake.email() for _ in range(num_users)],
    "location": [fake.city() for _ in range(num_users)],
})

# ✅ Generate Suppliers
suppliers = pd.DataFrame({
    "supplier_id": range(1, num_suppliers + 1),
    "supplier_name": [fake.company() for _ in range(num_suppliers)],
    "contact_email": [fake.company_email() for _ in range(num_suppliers)],
    "reliability_score": np.random.uniform(50, 100, num_suppliers),
})

# ✅ Generate Warehouses (Linked to Suppliers)
warehouses = pd.DataFrame({
    "warehouse_id": range(1, num_warehouses + 1),
    "warehouse_name": [f"WH-{i}" for i in range(1, num_warehouses + 1)],
    "location": [fake.city() for _ in range(num_warehouses)],
    "capacity": np.random.randint(1000, 10000, num_warehouses),
    "supplier_id": np.random.randint(1, num_suppliers + 1, num_warehouses),  # 🔗 Linked to suppliers
})

# ✅ Generate Products (Linked to Suppliers & Warehouses)
products = pd.DataFrame({
    "product_id": range(1, num_products + 1),
    "product_name": [fake.word() for _ in range(num_products)],
    "category": np.random.choice(["Electronics", "Clothing", "Food", "Furniture", "Books"], num_products),
    "cost_per_unit": np.random.uniform(10, 1000, num_products),
    "price_per_unit": np.random.uniform(50, 2000, num_products),
    "stock_level": np.random.randint(1, 500, num_products),
    "supplier_id": np.random.randint(1, num_suppliers + 1, num_products),  # 🔗 Linked to suppliers
    "warehouse_id": np.random.randint(1, num_warehouses + 1, num_products),  # 🔗 Linked to warehouses
})

# ✅ Generate Transactions (Linked to Users & Products)
transactions = pd.DataFrame({
    "transaction_id": [f"T{fake.random_int(10000, 99999)}" for _ in range(num_transactions)],
    "user_id": np.random.randint(1, num_users + 1, num_transactions),  # 🔗 Linked to users
    "product_id": np.random.randint(1, num_products + 1, num_transactions),  # 🔗 Linked to products
    "quantity": np.random.randint(1, 10, num_transactions),
    "total_price": np.random.uniform(100, 5000, num_transactions),
    "payment_method": np.random.choice(["Credit Card", "PayPal", "Cash", "UPI"], num_transactions),
    "transaction_date": [datetime.now() - timedelta(days=randint(1, 365)) for _ in range(num_transactions)],
})

# ✅ Save as CSV
users.to_csv("./data/users.csv", index=False)
suppliers.to_csv("./data/suppliers.csv", index=False)
warehouses.to_csv("./data/warehouses.csv", index=False)
products.to_csv("./data/products.csv", index=False)
transactions.to_csv("./data/transactions.csv", index=False)

print("✅ Interlinked datasets with warehouses created successfully! 🎉")

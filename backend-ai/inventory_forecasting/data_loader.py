import pandas as pd

def load_data():
    users = pd.read_csv("/Users/loveprLovepreeteet/assignment/backend-ai/data/users.csv")
    suppliers = pd.read_csv("/Users/loveprLovepreeteet/assignment/backend-ai/data/suppliers.csv")
    warehouses = pd.read_csv("/Users/loveprLovepreeteet/assignment/backend-ai/data/warehouses.csv")
    products = pd.read_csv("/Users/loveprLovepreeteet/assignment/backend-ai/data/products.csv")
    transactions = pd.read_csv("/Users/loveprLovepreeteet/assignment/backend-ai/data/transactions.csv").head(10000)

    transactions["transaction_date"] = pd.to_datetime(transactions["transaction_date"]).head(10000)
    return users, suppliers, warehouses, products, transactions

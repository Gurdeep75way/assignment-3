from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pandas as pd

def preprocess_transactions(transactions):
    # Drop non-numeric columns that are not needed for training
    transactions = transactions.drop(columns=["transaction_id", "user_id", "transaction_date"], errors="ignore")

    # Encode categorical columns
    categorical_columns = ["product_id", "payment_method"]
    for col in categorical_columns:
        if col in transactions.columns:
            transactions[col] = LabelEncoder().fit_transform(transactions[col].astype(str))

    # Handle missing values by filling with median
    transactions = transactions.fillna(transactions.median(numeric_only=True))

    return transactions

def train_anomaly_model(transactions):
    # Mark transactions with extremely high quantity as anomalies
    transactions["is_fraud"] = (transactions["quantity"] > transactions["quantity"].quantile(0.99)).astype(int)

    # Preprocess transactions to remove non-numeric columns
    transactions = preprocess_transactions(transactions)

    # Define features and labels
    X = transactions.drop(columns=["is_fraud"])
    y = transactions["is_fraud"]

    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    return model

# Example usage
# transactions = pd.read_csv("path_to_transactions.csv")
# anomaly_model = train_anomaly_model(transactions)

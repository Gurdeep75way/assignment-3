from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from imblearn.over_sampling import SMOTE
import pandas as pd
import numpy as np

def preprocess_transactions(transactions, users, products):
    """
    Preprocess transactions by merging with users and products data,
    encoding categorical columns, handling missing values, and feature engineering.
    """

    # ✅ Merge transactions with users and products
    transactions = transactions.merge(users, on="user_id", how="left")
    transactions = transactions.merge(products, on="product_id", how="left")

    # ✅ Feature Engineering: Creating useful new features
    transactions["user_total_transactions"] = transactions.groupby("user_id")["transaction_id"].transform("count")
    transactions["user_total_spent"] = transactions.groupby("user_id")["amount"].transform("sum")
    transactions["avg_spent_per_transaction"] = transactions["user_total_spent"] / transactions["user_total_transactions"]
    
    # ✅ Creating a user credibility score (basic formula)
    transactions["user_credibility"] = (transactions["user_total_transactions"] / transactions["user_total_spent"]).fillna(0)

    # ✅ Drop unnecessary columns
    drop_columns = ["transaction_id", "transaction_date", "user_name", "product_name"]
    transactions = transactions.drop(columns=[col for col in drop_columns if col in transactions.columns], errors="ignore")

    # ✅ Encode categorical columns
    categorical_columns = ["user_id", "product_id", "payment_method", "category"]
    for col in categorical_columns:
        if col in transactions.columns:
            transactions[col] = LabelEncoder().fit_transform(transactions[col].astype(str))

    # ✅ Handle missing values separately for numeric and categorical columns
    for col in transactions.select_dtypes(include=["number"]).columns:
        transactions[col] = transactions[col].fillna(transactions[col].median())

    for col in transactions.select_dtypes(include=["object"]).columns:
        transactions[col] = transactions[col].fillna(transactions[col].mode()[0])

    return transactions

def train_anomaly_model(transactions, users, products):
    """
    Train an optimized RandomForest model to detect fraudulent transactions.
    Uses transactions merged with users and products, handles class imbalance,
    and applies feature selection and tuning.
    """
    print("✅ 1")
    # ✅ Mark transactions with extremely high quantity as anomalies (Top 1%)
    transactions["is_fraud"] = (transactions["quantity"] > transactions["quantity"].quantile(0.99)).astype(int)
    print("✅ 2")
    # ✅ Preprocess transactions
    transactions = preprocess_transactions(transactions, users, products)
    print("✅ 3")
    # ✅ Define features and labels
    X = transactions.drop(columns=["is_fraud"])
    y = transactions["is_fraud"]
    print("✅ 4")
    # ✅ Handle Class Imbalance using SMOTE
    smote = SMOTE(sampling_strategy=0.5, random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)
    print("✅ 5")
    # ✅ Feature Scaling
    scaler = StandardScaler()
    X_resampled = scaler.fit_transform(X_resampled)
    print("✅ 6")
    # ✅ Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled)
    print("✅ 7")
    # ✅ Hyperparameter tuning using GridSearchCV
    param_grid = {
        "n_estimators": [100, 200, 300],
        "max_depth": [None, 10, 20, 30],
        "min_samples_split": [2, 5, 10],
        "min_samples_leaf": [1, 2, 4]
    }
    print("✅ 8")
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=StratifiedKFold(n_splits=5), scoring="accuracy", n_jobs=-1)
    grid_search.fit(X_train, y_train)
    print("✅ 9")
    # ✅ Train best model
    best_model = grid_search.best_estimator_
    best_model.fit(X_train, y_train)

    print(f"Best Model Parameters: {grid_search.best_params_}")
    print(f"Training Accuracy: {best_model.score(X_train, y_train):.4f}")
    print(f"Test Accuracy: {best_model.score(X_test, y_test):.4f}")

    return best_model, scaler  # Returning scaler for consistent transformation in future

# Example usage
# transactions = pd.read_csv("transactions.csv")
# users = pd.read_csv("users.csv")
# products = pd.read_csv("products.csv")
# anomaly_model, scaler = train_anomaly_model(transactions, users, products)

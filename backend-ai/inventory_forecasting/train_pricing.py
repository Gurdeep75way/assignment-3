import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
from sklearn.model_selection import RandomizedSearchCV, train_test_split, cross_val_score
from sklearn.preprocessing import RobustScaler
from sklearn.metrics import mean_absolute_error

def train_pricing_model(transactions, products, suppliers, warehouses):
    print("✅ Starting Pricing Model Training...")

    # Convert IDs to numeric
    transactions["product_id"] = pd.to_numeric(transactions["product_id"], errors="coerce")
    products["product_id"] = pd.to_numeric(products["product_id"], errors="coerce")
    suppliers["supplier_id"] = pd.to_numeric(suppliers["supplier_id"], errors="coerce")
    warehouses["warehouse_id"] = pd.to_numeric(warehouses["warehouse_id"], errors="coerce")

    # Merge transactions with products, suppliers, and warehouses
    transactions = transactions.merge(
        products[["product_id", "supplier_id", "cost_per_unit", "price_per_unit", "stock_level", "warehouse_id"]],
        on="product_id", how="left"
    ).merge(
        suppliers[["supplier_id", "reliability_score"]],
        on="supplier_id", how="left"
    ).merge(
        warehouses[["warehouse_id", "capacity"]],
        on="warehouse_id", how="left"
    )

    print("✅ 1 - Data Merged")

    # Handle missing values
    transactions.fillna(transactions.select_dtypes(include=['number']).median(), inplace=True)
    for col in transactions.select_dtypes(include=['object']).columns:
        transactions[col] = transactions[col].fillna(transactions[col].mode()[0])
    print("✅ 2 - Missing Value Handling Done")

    # Feature Engineering
    transactions["cost_reliability"] = transactions["cost_per_unit"] * transactions["reliability_score"]
    transactions["price_stock_ratio"] = transactions["price_per_unit"] / (transactions["stock_level"] + 1)
    transactions["warehouse_utilization"] = transactions["quantity"] / (transactions["capacity"] + 1)
    transactions["log_total_price"] = np.log1p(transactions["total_price"])  # Log transform for skewness

    # Feature selection
    features = ["quantity", "product_id", "cost_per_unit", "price_per_unit", "stock_level", 
                "reliability_score", "capacity", "cost_reliability", "price_stock_ratio", "warehouse_utilization"]
    target = "log_total_price"

    X = transactions[features]
    y = transactions[target]

    # Normalize features using RobustScaler
    scaler = RobustScaler()
    X_scaled = scaler.fit_transform(X)
    print("✅ 3 - Feature Scaling Done")

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Expanded hyperparameter tuning space
    param_grid = {
        "n_estimators": [100, 300, 500, 700],  # Increased upper range
        "max_depth": [10, 20, 30, 40, None],  # Added deeper trees
        "min_samples_split": [2, 5, 10, 20],  # More granularity
        "min_samples_leaf": [1, 2, 4, 8],  # More variations
        "max_features": ["sqrt", "log2", None],
        "bootstrap": [True, False],
        "criterion": ["squared_error", "absolute_error", "poisson"],  # Different loss functions
    }
    print("✅ 4 - Hyperparameter Grid Defined")

    model = RandomForestRegressor(random_state=42)

    # Increased `n_iter` for a better search
    search = RandomizedSearchCV(
        model, param_distributions=param_grid, n_iter=5, cv=3, n_jobs=-1, 
        scoring="neg_mean_absolute_error", random_state=42
    )
    print("✅ 5 - Hyperparameter Tuning Started")
    
    search.fit(X_train, y_train)
    print("✅ 6 - Hyperparameter Tuning Completed")

    # Best model
    best_model = search.best_estimator_
    print(f"🔥 Best Model: {best_model}")

    # Cross-validation score
    cv_score = cross_val_score(best_model, X_train, y_train, cv=5, scoring="neg_mean_absolute_error").mean()
    print(f"📊 Cross-Validation MAE: {-cv_score:.4f}")

    # Evaluate on test set
    y_pred = best_model.predict(X_test)
    test_mae = mean_absolute_error(y_test, y_pred)
    print(f"📈 Test MAE: {test_mae:.4f}")

    # Try ExtraTreesRegressor for comparison
    extra_trees = ExtraTreesRegressor(n_estimators=500, random_state=42)
    extra_trees.fit(X_train, y_train)
    y_pred_extra = extra_trees.predict(X_test)
    extra_mae = mean_absolute_error(y_test, y_pred_extra)
    print(f"⚡ Extra Trees Regressor MAE: {extra_mae:.4f}")

    print("✅ Pricing Model Training Completed Successfully! 🚀")

    return best_model, scaler, extra_trees

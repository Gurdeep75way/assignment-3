from sklearn.preprocessing import MinMaxScaler
import pandas as pd

def preprocess_data(transactions):
    # Ensure all column names are stripped of extra spaces
    transactions.columns = transactions.columns.str.strip()

    # ✅ Check required columns
    required_columns = {"transaction_date", "product_id", "quantity"}
    missing_columns = required_columns - set(transactions.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    # ✅ Convert transaction_date to datetime
    transactions["transaction_date"] = pd.to_datetime(transactions["transaction_date"], errors='coerce')
    if transactions["transaction_date"].isna().any():
        raise ValueError("Some transaction_date values could not be parsed.")

    # ✅ Ensure product_id is treated as a string
    transactions["product_id"] = transactions["product_id"].astype(str)

    # ✅ Assign a numerical time index (important for TFT)
    transactions = transactions.sort_values(by=["product_id", "transaction_date"])  # Ensure proper sorting
    transactions["time_idx"] = (transactions["transaction_date"] - transactions["transaction_date"].min()).dt.days

    # ✅ Ensure continuous time_idx sequence (prevents TFT errors)
    full_time_idx = pd.DataFrame({"time_idx": range(transactions["time_idx"].min(), transactions["time_idx"].max() + 1)})
    transactions = full_time_idx.merge(transactions, on="time_idx", how="left")

    # ✅ Fill missing values using forward fill and backfill
    transactions["product_id"] = transactions["product_id"].ffill().bfill()
    transactions["quantity"] = transactions["quantity"].ffill().bfill()

    # ✅ Keep necessary columns
    time_series_data = transactions[["time_idx", "transaction_date", "product_id", "quantity"]]

    # ✅ Normalize `quantity` using MinMaxScaler
    scaler = MinMaxScaler()
    time_series_scaled = time_series_data.copy()
    time_series_scaled["quantity"] = scaler.fit_transform(time_series_data[["quantity"]])

    # ✅ Return three values
    return time_series_data, time_series_scaled, scaler

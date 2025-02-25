import matplotlib.pyplot as plt
import pandas as pd

def plot_predictions(predicted_demand, transactions):
    product_id = 5  # Ensure this is valid
    future_dates = pd.date_range(start=transactions["transaction_date"].max(), periods=8)[1:]

    # ✅ Fix: Handle single-product case
    if predicted_demand.shape[1] == 1:
        plt.plot(future_dates, predicted_demand[:, 0], marker="o", label="Predicted Demand")
    else:
        plt.plot(future_dates, predicted_demand[:, product_id], marker="o", label=f"Predicted Demand (Product {product_id})")

    plt.legend()
    plt.title(f"Future Demand Prediction for Product {product_id}")
    plt.xlabel("Date")
    plt.ylabel("Quantity Sold")
    plt.show()

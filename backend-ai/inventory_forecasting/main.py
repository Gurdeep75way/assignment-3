from predict import predicted_demand
from visualize import plot_predictions
from data_loader import load_data

users, suppliers, warehouses, products, transactions = load_data()
plot_predictions(predicted_demand, transactions)

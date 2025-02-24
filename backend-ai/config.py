import os

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "InventoryDB"

# API Configuration
HOST = "0.0.0.0"
PORT = 8000

# Model Path
MODEL_PATH = "models/demand_forecast.pkl"
ENCODER_PATH = "models/label_encoder.pkl" 
SCALER_PATH = "models/scaler_file.pkl"
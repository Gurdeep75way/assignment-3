import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.layers import Embedding, Flatten, Dense, Input, Concatenate
from sklearn.model_selection import train_test_split
from pymongo import MongoClient

# ✅ Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["InventoryDB"]

# ✅ Load Transactions Data from MongoDB
transactions = pd.DataFrame(list(db.transactions.find({}, {"_id": 0})))
products = pd.DataFrame(list(db.products.find({}, {"_id": 0})))

# ✅ Merge with Product Data
transactions = transactions.merge(products[["product_id", "category"]], on="product_id", how="left")

# ✅ Encode Users & Products
transactions["user_id"] = transactions["user_id"].astype("category").cat.codes
transactions["product_id"] = transactions["product_id"].astype("category").cat.codes

# ✅ Split Data
train, test = train_test_split(transactions, test_size=0.2, random_state=42)

# ✅ Model Architecture
embedding_size = 50  # Size of embeddings

user_input = Input(shape=(1,))
product_input = Input(shape=(1,))

user_embedding = Embedding(input_dim=transactions["user_id"].nunique(), output_dim=embedding_size)(user_input)
product_embedding = Embedding(input_dim=transactions["product_id"].nunique(), output_dim=embedding_size)(product_input)

user_vec = Flatten()(user_embedding)
product_vec = Flatten()(product_embedding)

concat = Concatenate()([user_vec, product_vec])
dense1 = Dense(128, activation="relu")(concat)
dense2 = Dense(64, activation="relu")(dense1)
output = Dense(1, activation="sigmoid")(dense2)

model = keras.Model([user_input, product_input], output)

# ✅ Compile Model
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

# ✅ Train Model
model.fit([train["user_id"], train["product_id"]], np.ones(len(train)), epochs=5, batch_size=32, validation_split=0.1)

# ✅ Save Model
model.save("recommendation_model.h5")
print("🎉 Model trained and saved successfully!")

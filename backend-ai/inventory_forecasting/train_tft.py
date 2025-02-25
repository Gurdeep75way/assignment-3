import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def train_tft(time_series_data):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(1, 2)),
        LSTM(32, return_sequences=False),
        Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    return model

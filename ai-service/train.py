"""
Train a simple DNN for crop price prediction.
Run: python train.py
Outputs: model/crop_price_model.h5, model/scaler.pkl
"""
import numpy as np
import os
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

os.makedirs("model", exist_ok=True)

CROPS = ["Wheat", "Rice", "Tomato", "Onion", "Potato", "Maize", "Soybean", "Cotton"]
BASE_PRICES = [2200, 3400, 1800, 1500, 1200, 1900, 4500, 6500]
MONTH_FACTORS = [0.95, 0.97, 1.02, 1.05, 1.03, 0.98, 0.96, 0.99, 1.01, 1.04, 1.02, 0.97]

np.random.seed(42)
X, y = [], []
for crop_idx, base in enumerate(BASE_PRICES):
    for month in range(1, 13):
        for horizon in range(1, 7):
            factor = MONTH_FACTORS[(month + horizon - 1) % 12]
            price = base * factor * (1 + np.random.normal(0, 0.03))
            X.append([crop_idx, month, horizon, base])
            y.append(price)

X, y = np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, "model/scaler.pkl")

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

import tensorflow as tf
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(4,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.1),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1),
])
model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.1, verbose=1)

loss, mae = model.evaluate(X_test, y_test, verbose=0)
print(f"Test MAE: {mae:.2f}, RMSE: {loss**0.5:.2f}")
model.save("model/crop_price_model.h5")
print("Model saved to model/crop_price_model.h5")

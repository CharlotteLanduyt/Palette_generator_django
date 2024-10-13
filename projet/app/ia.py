from .models import *
import random

import numpy as np
from sklearn.model_selection import train_test_split

import tensorflow as tf
from tensorflow import keras

from sklearn.preprocessing import OneHotEncoder


themes_all = Theme_train.objects.all()
themes = []
colors_per_theme = []

for theme in themes_all:
    themes.append([theme.theme])
    palette = []

    for color in theme.theme_color.all():
        palette.append([color.r, color.g, color.b])

    colors_per_theme.append(palette)

seuil_minimal = 2000
X = themes
y = colors_per_theme

encoder = OneHotEncoder()

if X:
    X = encoder.fit_transform(X)
else:
    print("Les données X sont vides.")


X = np.array(X)
y = np.array(y)


def create_colors(theme_test):
    if len(themes) < seuil_minimal:
        num_colors = 5
        predicted_palette = [
            [random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)]
            for _ in range(num_colors)
        ]
        random.shuffle(predicted_palette)
        result = {
            'predicted_palette': predicted_palette,
            'message': 'random'
        }
        return result
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = keras.Sequential([
            keras.layers.Embedding(input_dim=len(X), output_dim=32, input_length=1),
            keras.layers.Flatten(),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(15, activation='relu'),
            keras.layers.Reshape((5, 3))
        ])

        model.compile(optimizer='adam', loss='mse', metrics=['mae'])

 
        model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_test, y_test))
        

        themes_new = [theme_test] 

        X_new = np.array(themes_new)
        predicted_colors = model.predict(X_new)

        print(predicted_colors)



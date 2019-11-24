import sys
import json
import math

inp = sys.argv[1]

arg_json = json.loads(inp)

dataset = arg_json['dataset']
train_ratio = arg_json['train_ratio']
convolution_layers = arg_json['convolution_layers']
fully_connected_layers = arg_json['fully_connected_layers']
epoch_count = arg_json['epoch_count']

import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics
import os
import sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
from keras.utils.np_utils import to_categorical
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPool2D
from keras.optimizers import RMSprop
sys.stderr = stderr

data = pd.read_csv("../datasets/" + dataset + ".csv")

Y_train = data["label"]

num_classes = len(list(Y_train.unique()))

# Drop 'label' column
X_train = data.drop(labels = ["label"], axis = 1)

img_size = int(math.sqrt(X_train.shape[1]))

# free some space
del data 

# Normalize the data
X_train = X_train / 255.0

X_train = X_train.values.reshape(-1, img_size, img_size, 1)
Y_train = to_categorical(Y_train, num_classes = num_classes)

random_seed = 2
test_ratio = 0.1

X_train, X_test, Y_train, Y_test = train_test_split(X_train, Y_train, test_size = test_ratio, train_size = train_ratio, random_state=random_seed)

model = Sequential()

model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'Same', activation = convolution_layers[0]["activation"], input_shape = (img_size,img_size,1)))
model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'Same', activation = convolution_layers[0]["activation"]))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))

if len(convolution_layers) > 1:
    for layer in convolution_layers[1:]:
        model.add(Conv2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation = layer["activation"]))
        model.add(Conv2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation = layer["activation"]))
        model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))
        model.add(Dropout(0.25))

model.add(Flatten())

for layer in fully_connected_layers:
    model.add(Dense(256, activation = layer["activation"]))
    model.add(Dropout(0.5))

model.add(Dense(num_classes, activation = "softmax"))

optimizer = RMSprop(lr=0.001, rho=0.9, epsilon=1e-08, decay=0.0)
model.compile(optimizer = optimizer , loss = "categorical_crossentropy", metrics=["accuracy"])

model.fit(X_train, Y_train, batch_size = 86, epochs = epoch_count, validation_data = (X_test, Y_test), verbose = 2)

Y_pred = model.predict(X_test)

Y_test = np.argmax(Y_test, axis=1)
Y_pred = np.argmax(Y_pred, axis=1)

print("Accuracy: {0}".format(metrics.accuracy_score(y_true=Y_test, y_pred=Y_pred) * 100))

#Terminal command: python scripts/CNN.py '{ \"algo\": \"CNN\", \"dataset\": \"MNIST - Digits\", \"train_ratio\": 0.05, \"convolution_layers\": [{ \"activation\": \"relu\"}, { \"activation\": \"relu\"}], \"fully_connected_layers\": [{ \"activation\": \"relu\"}, { \"activation\": \"relu\"}], \"epoch_count\": 1 }'

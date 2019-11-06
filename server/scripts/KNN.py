import sys
import json

inp = sys.argv[1]

arg_json = json.loads(inp)

dataset = arg_json['dataset']
train_ratio = arg_json['train_ratio']
n_neighbors = arg_json['n_neighbors']
weight = arg_json['weight']
power_parameter = arg_json['power_parameter']

import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

train = pd.read_csv("../datasets/" + dataset + ".csv")

Y_train = train["label"]

# Drop 'label' column
X_train = train.drop(labels = ["label"], axis = 1) 

# free some space
del train 

# Normalize the data
X_train = X_train / 255.0

random_seed = 2
test_ratio = 0.1

X_train, X_test, Y_train, Y_test = train_test_split(X_train, Y_train, test_size = test_ratio, train_size = train_ratio, random_state=random_seed)
train_size = X_train.shape[0]
test_size = X_test.shape[0]

knn = KNeighborsClassifier(n_neighbors=n_neighbors, p=power_parameter, weights=weight)
knn.fit(X_train, Y_train)

Predicted = knn.predict(X_test)

l = list(Y_test)
err_count = 0

for i in range(7000):
    if (l[i] != Predicted[i]):
        err_count += 1

accuracy = (test_size - err_count) * 100 / test_size
error = err_count * 100 / test_size
print(accuracy)
#Terminal command: KNN.py '{ \"algo\": \"KNN\", \"dataset\": \"MNIST - Digits\", \"train_ratio\": 0.05, \"n_neighbors\": 1, \"weight\": \"uniform\", \"power_parameter\": 1 }'

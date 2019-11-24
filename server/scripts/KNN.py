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
from sklearn import metrics

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

knn = KNeighborsClassifier(n_neighbors=n_neighbors, p=power_parameter, weights=weight)
knn.fit(X_train, Y_train)

Y_pred = knn.predict(X_test)

print("Accuracy: {0}".format(metrics.accuracy_score(y_true=Y_test, y_pred=Y_pred) * 100))

#Terminal command: python scripts/KNN.py '{ \"algo\": \"KNN\", \"dataset\": \"MNIST - Digits\", \"train_ratio\": 0.05, \"n_neighbors\": 1, \"weight\": \"uniform\", \"power_parameter\": 1 }'

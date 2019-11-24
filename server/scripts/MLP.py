import sys
import json

inp = sys.argv[1]

arg_json = json.loads(inp)

dataset = arg_json['dataset']
train_ratio = arg_json['train_ratio']
hidden_layer_sizes = arg_json['hidden_layer_sizes']
activation = arg_json['activation']

import numpy as np
import pandas as pd
from sklearn import decomposition
from sklearn.neural_network import MLPClassifier
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

## PCA decomposition
pca = decomposition.PCA(n_components=200)
pca.fit(X_train)
X_train = pca.transform(X_train)
X_test = pca.transform(X_test)

clf = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes, activation=activation)
clf.fit(X_train, Y_train)

Y_pred = clf.predict(X_test)

print("Accuracy: {0}".format(metrics.accuracy_score(y_true=Y_test, y_pred=Y_pred) * 100))

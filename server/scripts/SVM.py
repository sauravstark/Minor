import sys
import json

inp = sys.argv[1]

arg_json = json.loads(inp)

dataset = arg_json['dataset']
train_ratio = arg_json['train_ratio']
kernel = arg_json['kernel']
gamma = arg_json['gamma']
regularization = arg_json['regularization']

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import scale
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
X_train_scaled = scale(X_train)
X_test_scaled = scale(X_test)

model = SVC(C=regularization, kernel=kernel, gamma=gamma)
model.fit(X_train_scaled, Y_train)
Y_pred = model.predict(X_test_scaled)

print(metrics.accuracy_score(y_true=Y_test, y_pred=Y_pred) * 100)

#Terminal command: python scripts/SVM.py '{ \"algo\": \"SVM\", \"dataset\": \"MNIST - Digits\", \"train_ratio\": 0.05, \"kernel\": \"linear\", \"gamma\": 1e2, \"regularization\": 1e1 }'

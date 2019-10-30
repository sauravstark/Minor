import sys
import json

inp = sys.argv[1]

arg_json = json.loads(inp)

dataset = arg_json['dataset']
train_ratio = arg_json['train_ratio']
n_neighbors = arg_json['n_neighbors']
weight = arg_json['weight']
power_parameter = arg_json['power_parameter']

#TODO - Implement KNN

#END TODO

#TODO - Remove this section after KNN is implemented

print("Test successful with KNN for parameter:")
print("Dataset - {}".format(dataset))
print("Train Ratio - {}".format(train_ratio))
print("N Neighbors - {}".format(n_neighbors))
print("Weight - {}".format(weight))
print("Power Parameter - {}".format(power_parameter))

#END TODO
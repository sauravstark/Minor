import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["test"]
mycol = mydb["dataset_info"]

myquery = { "name": "MNIST - Digitss"}

mydoc = mycol.find_one(myquery)

if (mydoc == None):
    print('Houston, we have a problem')
else:
    print(mydoc)
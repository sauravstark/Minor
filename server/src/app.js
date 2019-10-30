const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const spawn = require('child_process').spawn

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule')
mongodb_conn_module.connect()

var algorithms_arr = undefined
var dataset_arr = undefined

var KNNmodel = require("../models/knn")

algodsModel = require("../models/algorithms_and_datasets")

algodsModel.getDatasets().then(function successCallback(response) {
	dataset_arr = response
}, function errorCallback(error) {
	console.log(error)
})

algodsModel.getAlgorithms().then(function successCallback(response) {
	algorithms_arr = response
}, function errorCallback(error) {
	console.log(error)
})

app.get('/records', (req, res) => {
	KNNmodel.find({}, function (err, docs) {
		if (err) {
			console.error(err)
		}
		res.send({
			records: docs
		})
	}).sort({ accuracy: -1 })
})

function create_arg_json(req_body) {	
	if (algorithms_arr.map(el => el.name).includes(req_body.algo) && 
		dataset_arr.map(el => el.name).includes(req_body.dataset) &&
		(Math.ceil(req_body.train_ratio * 20) == req_body.train_ratio * 20) &&
		(req_body.train_ratio > 0) && (req_body.train_ratio <= 0.9)) {
		
		var ret_val = {
			algo: req_body.algo,
			dataset: req_body.dataset,
			train_ratio: req_body.train_ratio
		}
		var algo_details = algorithms_arr.find(function(el) {
			return el.name === req_body.algo
		  })
		for (var prop in algo_details.params) {
			if (algo_details.params[prop].includes(req_body[prop])) {
				ret_val[prop] = req_body[prop]
			} else {
				return undefined
			}
		}
		return ret_val
	} else {
		return undefined
	}
}

function run_script(arg_json) {
	return new Promise(function (resolve, reject) {
		script_path = __dirname + "/../scripts/"
		var child = undefined
		switch (arg_json.algo) {
			case "KNN":
				script_path += "KNN.py"
				child = spawn('python', [script_path, JSON.stringify(arg_json)])
				break

			//TODO SVM, MLP, CNN
			default:
				break
		}

		if (child !== undefined) {
			child.stdout.on('data', (data) => {
				accuracy = data.toString()
			})
			child.on('exit', code => {
				if (code === 0) {
					resolve(accuracy)
				} else {
					reject("Could not run script!")
				}
			})
		} else {
			reject("Could not find script!")
		}
	})
}

var searchinDB = function (arg_json) {
	return new Promise(function (resolve, reject) {
		var search_param = {
			algo: arg_json.algo,
			dataset: arg_json.dataset,
			train_ratio: arg_json.train_ratio
		}
		switch (arg_json.algo) {
			case "KNN":
				search_param.config = {
					n_neighbors: arg_json.n_neighbors,
					weight: arg_json.weight,
					power_parameter: arg_json.power_parameter
				}
				KNNmodel.findOne(search_param, function (err, docs) {
					if (err) {
						reject(err)
					} else if (docs === null) {
						reject("Record not found")
					} else {
						resolve(docs)
					}
					console.log("docs")
					console.log(docs)
				})
				break

			default:
				break
		}
	})
}

app.post('/run_script', (req, res) => {
	var arg_json = create_arg_json(req.body)
	searchinDB(arg_json).then(function successCallback(response) {
		res.send(response)
	}, function errorCallback(error) {
		run_script(arg_json).then(function successCallback(response) {
			res.send(response)
		}, function errorCallback(error) {
			res.send(error)
		})
	})
})

app.listen(process.env.PORT || 8081)

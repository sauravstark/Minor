const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const spawn = require('child_process').spawn
const util = require('util')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule')
mongodb_conn_module.connect()

var algorithms_arr = undefined
var dataset_arr = undefined
var running_scripts_arr = []

var RecordsModel = require("../models/records")

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
	RecordsModel.find({}, function (err, docs) {
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
			if (Array.isArray(algo_details.params[prop])) {
				if (algo_details.params[prop].includes(req_body[prop])) {
					ret_val[prop] = req_body[prop]
				} else {
					return undefined
				}
			} else {
				console.log(algo_details.params[prop])
				if (algo_details.params[prop].count.includes(req_body[prop].length)) {
					ret_val[prop] = []
					req_body[prop].forEach(element => {
						if (algo_details.params[prop].values.includes(element)) {
							ret_val[prop].push(element)
						} else {
							return undefined
						}
					})
				} else {
					return undefined
				}
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

			case "SVM":
				script_path += "SVM.py"
				child = spawn('python', [script_path, JSON.stringify(arg_json)])
				break

			case "MLP":
				script_path += "MLP.py"
				child = spawn('python', [script_path, JSON.stringify(arg_json)])
				break

			case "CNN":
				script_path += "CNN.py"
				child = spawn('python', [script_path, JSON.stringify(arg_json)])
				break

			default:
				break
		}

		if (child !== undefined) {
			var output = ''
			child.stdout.on('data', (data) => {
				output += data.toString()
			})
			child.on('exit', code => {
				if (code === 0) {
					var arr = RegExp('(?<=Accuracy: )\d+(?:\.\d+)').exec(output)
					if (arr !== null) {
						resolve(arr[0])
					} else {
						reject("Could not run script!")
					}
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
				RecordsModel.findOne(search_param, function (err, docs) {
					if (err) {
						reject(err)
					} else if (docs === null) {
						reject("Record not found")
					} else {
						resolve(docs)
					}
				})
				break
			
			case "SVM":
				search_param.config = {
					kernel: arg_json.kernel,
					regularization: arg_json.regularization,
					gamma: arg_json.gamma
				}
				RecordsModel.findOne(search_param, function (err, docs) {
					if (err) {
						reject(err)
					} else if (docs === null) {
						reject("Record not found")
					} else {
						resolve(docs)
					}
				})
				break

			case "MLP":
				search_param.config = {
					hidden_layers: arg_json.hidden_layers,
					activation: arg_json.activation
				}
				RecordsModel.findOne(search_param, function (err, docs) {
					if (err) {
						reject(err)
					} else if (docs === null) {
						reject("Record not found")
					} else {
						resolve(docs)
					}
				})
				break

			case "CNN":
				search_param.config = {
					convolution_layers: arg_json.convolution_layers,
					fully_connected_layers: arg_json.fully_connected_layers,
					epoch_count: arg_json.epoch_count
				}
				RecordsModel.findOne(search_param, function (err, docs) {
					if (err) {
						reject(err)
					} else if (docs === null) {
						reject("Record not found")
					} else {
						resolve(docs)
					}
				})
				break

			default:
				reject("Record not found")
				break
		}
	})
}

function saveRecord(response, arg_json) {
	console.log(response)
	console.log(arg_json)
	var record = {
		algo: arg_json.algo,
		dataset: arg_json.dataset,
		train_ratio: arg_json.train_ratio,
		accuracy: response
	}

	switch (arg_json.algo) {
		case "KNN":
			record.config = {
				n_neighbors: arg_json.n_neighbors,
				weight: arg_json.weight,
				power_parameter: arg_json.power_parameter
			}
			var new_doc = new RecordsModel(record)
			new_doc.save(function(err) {
				console.log(err)
			})
			break
		
		case "SVM":
			record.config = {
				kernel: arg_json.kernel,
				regularization: arg_json.regularization,
				gamma: arg_json.gamma
			}
			var new_doc = new RecordsModel(record)
			new_doc.save(function(err) {
				console.log(err)
			})
			break

		case "MLP":
			record.config = {
				hidden_layers: arg_json.hidden_layers,
				activation: arg_json.activation
			}
			var new_doc = new RecordsModel(record)
			new_doc.save(function(err) {
				console.log(err)
			})
			break

		case "CNN":
			record.config = {
				convolution_layers: arg_json.convolution_layers,
				fully_connected_layers: arg_json.fully_connected_layers,
				epoch_count: arg_json.epoch_count
			}
			var new_doc = new RecordsModel(record)
			new_doc.save(function(err) {
				console.log(err)
			})
			break
	
		default:
			break
	}
}

app.post('/run_script', (req, res) => {
	var arg_json = create_arg_json(req.body)
	if (running_scripts_arr.includes(arg_json)) {
		res.send({ status: "running" })
	} else {
		searchinDB(arg_json).then(function successCallback(response) {
			res.send({
				status: "ready",
				accuracy: response.accuracy
			})
		}, function errorCallback(error) {
			res.send({ status: "running" })
			run_script(arg_json).then(function successCallback(response) {
				let index = running_scripts_arr.indexOf(arg_json)
				if (index !== -1) {
					running_scripts_arr.splice(index, 1)
				}
				saveRecord(response, arg_json)
			}, function errorCallback(error) {
				let index = running_scripts_arr.indexOf(arg_json)
				if (index !== -1) {
					running_scripts_arr.splice(index, 1)
				}
				console.log(error)
			})
		})
	}
})

app.listen(process.env.PORT || 8081)

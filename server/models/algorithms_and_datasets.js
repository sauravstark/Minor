var mongoose = require("mongoose")
mongoose.pluralize(null)
var Schema = mongoose.Schema

var DatasetSchema = new Schema({
	name: String,
	size: Number,
	class_count: Number
})

var DatasetModel = mongoose.model("dataset_info", DatasetSchema)

module.exports.getDatasets = function () {
	return new Promise(function (resolve, reject) {
		DatasetModel.find({}, function (err, docs) {
			if (err) {
				reject(undefined)
			} else if (docs === null) {
				resolve([])
			} else {
				resolve(docs)
			}
		})
	})
}

var AlgorithmSchema = new Schema({
	name: String,
	params: {}
})

var AlgorithmModel = mongoose.model("algorithms", AlgorithmSchema)

module.exports.getAlgorithms = function () {
	return new Promise(function (resolve, reject) {
		AlgorithmModel.find({}, function(err, docs) {
			if (err) {
				reject(undefined)
			} else if (docs === null) {
				resolve([])
			} else {
				resolve(docs)
			}
		})
	})
}
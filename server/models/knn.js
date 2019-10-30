var mongoose = require("mongoose")
mongoose.pluralize(null)
var Schema = mongoose.Schema

var KNNSchema = new Schema({
	algo: { type: String, default: "KNN" },
	dataset: String,
	train_ratio: Number,
	config: {
		n_neighbors: Number,
		weight: String,
		power_parameter: Number
	},
	accuracy: Number
})

var KNNmodel = mongoose.model("accuracy_records", KNNSchema)
module.exports = KNNmodel

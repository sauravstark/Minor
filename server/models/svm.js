var mongoose = require("mongoose");
mongoose.pluralize(null);
var Schema = mongoose.Schema;

var SVMSchema = new Schema({
	algo: { type: String, default: "SVM" },
	dataset: String,
	dataset_size: Number,
	config: {
		kernel: String,
		regularization: Number,
		gamma: Number
	},
	accuracy: Schema.Types.Decimal128
});

var SVMmodel = mongoose.model("accuracy_records", SVMSchema);
module.exports = SVMmodel;

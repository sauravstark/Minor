var mongoose = require("mongoose");
mongoose.pluralize(null);
var Schema = mongoose.Schema;

var RecordsSchema = new Schema({
	algo: { type: String, default: "SVM" },
	dataset: String,
	dataset_size: Number,
	config: {},
	accuracy: Number
});

var RecordsModel = mongoose.model("accuracy_records", RecordsSchema);
module.exports = RecordsModel;

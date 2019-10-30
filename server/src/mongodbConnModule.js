var mongoose = require('mongoose')

module.exports.connect = function() {
	mongoose.connect('mongodb://localhost:27017/test')
	var db = mongoose.connection
	db.on("error", console.error.bind(console, "connection error"))
	db.once("open", function(){
	  console.log("It's alive! It's alive!")
	})
	return db
}
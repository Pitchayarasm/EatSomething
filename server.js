var express = require("express");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
var app = express();
var logger = require("morgan");
var mongo = require("mongodb").MongoClient
var dataURL = process.env.MONGOLAB_URI

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use morgan logger for logging requests
app.use(logger("dev"));

// Import routes and give the server access to them.
var routes = require("./controller/recipesController.js");
routes(app);

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://heroku_lcknsgjl:b1ia2smi79farnukuucrsnsi71@ds141633.mlab.com:41633/heroku_lcknsgjl");
var databaseURL = 'mongodb://localhost/recipesdb'
var mongod = process.env.MONGODB_URI || 'mongodb://heroku_lcknsgjl:b1ia2smi79farnukuucrsnsi71@ds141633.mlab.com:41633/heroku_lcknsgjl'
if (mongod) {
    mongoose.connect(mongod)
} else {
    mongoose.connect(databaseURL)
}
var db = mongoose.connection;

    db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
  db.once("open", function() {
    console.log("Mongoose connection successful.");
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  
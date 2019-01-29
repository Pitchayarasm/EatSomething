var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique : true
    },
    link: {
        type: String,
        required: true,
        unique : true
    },
    src : {
        type: String,
        required: true
    },
    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
  });
  
  var Menu = mongoose.model("Menu", MenuSchema);
  
  module.exports = Menu;
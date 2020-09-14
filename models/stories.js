var mongoose = require("mongoose");
 
var storiesSchema = new mongoose.Schema({
   title: String,
   content: String,
   currentViewers: Number,
   totalViews: Number
});
 
module.exports = mongoose.model("Stories", storiesSchema);
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage : {type : String , require :true}
});
// here Product is the name of the model and second is the schema
module.exports = mongoose.model("Product", productSchema);

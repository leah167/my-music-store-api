const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // trim removes unnescesary spaces
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  image: { type: String, required: true, trim: true },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

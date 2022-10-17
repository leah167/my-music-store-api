const express = require("express");
const ProductService = require("../Services/ProductService");
const productRouter = express.Router();

productRouter.post("/create-product", ProductService.createProduct);

productRouter.get("/get-products", ProductService.getProducts);

module.exports = productRouter;

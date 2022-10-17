const ProductModel = require("../models/ProductModel");
const PermissionService = require("./PermissionService");

const cleanProduct = (productDocument) => {
  return {
    id: productDocument._id,
    title: productDocument.title,
    description: productDocument.description,
    brand: productDocument.brand,
    price: productDocument.price,
    image: productDocument.image,
  };
};

const createProduct = async (req, res, next) => {
  try {
    //Grab data from network request
    console.log("body: ", req.body);
    const { productData } = req.body;

    //if there is not user Id, then the user is obvi not logged in as an admin
    PermissionService.verifyUserIsAdmin(req, res, next);

    const productDocument = new ProductModel(productData);

    //Store in Db
    await productDocument.save();

    //return it to the front end after.
    res.send({ product: cleanProduct(productDocument) });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    //Grab data from network request
    const products = await ProductModel.find();

    //return it to the front end after.
    res.send({ products: products.map(cleanProduct) });
  } catch (error) {
    next(error);
  }
};

const ProductService = {
  createProduct,
  getProducts,
};

module.exports = ProductService;

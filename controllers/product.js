const ProductCategoryModel = require("../models/productCategorySchema");
const ProductModel = require("../models/productSchema");
const ProductOrderModel = require("../models/productOrderSchema");

const mongoose = require("mongoose");

const updateProduct = async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = {
    ProductCategoryID: req.body.productCategoryId,
    supplierID: req.body.supplierID,
    description: req.body.description,
    costPerDay: req.body.costPerDay,
     imageURL:req.body.imageURL,
    quantity: req.body.quantity,
    availableQuantity: req.body.availableQuantity,
    isActive: true ? req.body.active == 'Yes' : false,
    }
  try {
    const dataToSave = await ProductModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getProductCategory = async (req, res, next) => {
  // get jobs from mongoDB
  const coll = await ProductCategoryModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductCategoryID = async (req, res, next) => {
  // get product by ID
  const category = decodeURI(req.params.category);
  const coll = await  ProductCategoryModel.find({ name: category });

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProducts = async (req, res, next) => {
  // get farmers from mongoDB
  const coll = await ProductModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductByID = async (req, res, next) => {
  // get product by ID
  const id = req.params.id;
  const coll = await ProductModel.findById(id);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductsFarmerByCategoryID = async (req, res, next) => {
  // get product by ID
  const categoryID = req.params.categoryID;
  const coll = await ProductModel.aggregate([
    {
      $match: { productCategoryID: mongoose.Types.ObjectId(categoryID), isActive: true, availableQuantity: { $gt: 0 } }
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierID',
        foreignField: '_id',
        as: 'supplier'
      }
    },
    {
      $addFields: {
        supplier: { $first: '$supplier' },
        costPerDay: { $toString: "$costPerDay" }
      }
    }
  ]);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductBySupplierID = async (req, res, next) => {
  // get product by ID
  const supplierID = req.params.supplierID;
  const coll = await ProductModel.find({supplierID: supplierID});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const addProduct = async (req, res, next) => {
  const data = new ProductModel({
    productCategoryID: req.body.productCategoryID,
    supplierID: req.body.supplierID,
    name: req.body.name,
    description: req.body.description,
    costPerDay: req.body.costPerDay,
    imageURL: req.body.imageURL,
    quantity: req.body.quantity,
    availableQuantity: req.body.quantity,
    isActive: true,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buyProductByID = async (req, res, next) => {
  // check product quantity and isactive
  const productID = req.params.productID;
  
  const product = await ProductModel.findById(productID);
  if (product.availableQuantity < req.body.quantity) {
    res.status(500).send("Enough product quantity is not available!");
  } else if (!product.isActive) {
    res.status(500).send("Product is not active anymore!");
  } else {
    // reduce product quantity
    product.availableQuantity -= req.body.quantity;
    await product.save();
    
    // add product order
    const data = new ProductOrderModel({
      productID: req.params.productID,
      farmerID: req.body.farmerID,
      duration: req.body.duration,
      quantity: req.body.quantity,
      orderDate: Date.now(),
      deliveryDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
      status: 'accepted',
    });

    try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = {
  getProductCategory,
  getProductCategoryID,
  getProducts,
  getProductByID,
  getProductsFarmerByCategoryID,
  addProduct,
  buyProductByID,
  getProductBySupplierID,
  updateProduct
};

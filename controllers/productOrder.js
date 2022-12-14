const ProductOrderModel = require("../models/productOrderSchema");

const mongoose = require("mongoose");

const getProductOrders = async (req, res, next) => {
  // get farmers from mongoDB
  const coll = await ProductOrderModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductOrderByProductIDAndStatus = async (req, res, next) => {
  const productID=req.params.productID
  const status=req.params.status

  const coll=await ProductOrderModel.aggregate([
     {
      $match: { productID: mongoose.Types.ObjectId(productID), status: status }
    },
    { $lookup:
        {
           from: "farmers",
           localField: "farmerID",
           foreignField: "_id",
           as: "farmer"
        }
    },
    {
      $addFields: {
       farmer: { $first: '$farmer' }
      }
    }
]);
    try {
      // console.log(val);
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductOrderByProductID = async (req, res, next) => {
  const productID=req.params.productID
  //const status=req.params.status
  // const coll=await ProductOrderModel.find({productID:productID});
  //  try {
  //   res.send(JSON.stringify(coll));
  // } catch (error) {
  //   res.status(500).send(error);
  // }


  const coll=await ProductOrderModel.aggregate([
     {
      $match: { productID: mongoose.Types.ObjectId(productID) }
    },
    { $lookup:
        {
           from: "farmers",
           localField: "farmerID",
           foreignField: "_id",
           as: "farmer"
        }
    },
    {
      $addFields: {
       farmer: { $first: '$farmer' }
      }
    }
]);
    try {
      // console.log(val);
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }

};
  

const getProductOrderByID = async (req, res, next) => {
  // get product by ID
  const id = req.params.id;
  //const coll = await ProductOrderModel.findById(id);

  const coll = await ProductOrderModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: 'products',
        let: { "productID": "$productID" },
        pipeline: [
          { $match: { "$expr": { "$eq": ["$_id", "$$productID"] }} },
          { $lookup: {
            from: "suppliers",
            let: { "supplierID": "$supplierID" },
            pipeline: [
              { $match: { "$expr": { "$eq": ["$_id", "$$supplierID"] }} }
            ],
            as: "supplier"
          }},
          { $lookup: {
            from: "productcategories",
            let: { "productCategoryID": "$productCategoryID" },
            pipeline: [
              { $match: { "$expr": { "$eq": ["$_id", "$$productCategoryID"] }} }
            ],
            as: "productCategory"
          }},
          {
            $addFields: {
              supplier: { $first: '$supplier' },
              productCategory: { $first: '$productCategory' },
              costPerDay: { $toString: "$costPerDay" }
            }
          },
        ],
        as: 'product'
      }
    },
    {
      $addFields: {
        product: { $first: '$product' },
        supplier: { $first: '$product.supplier' },
        productCategory: { $first: '$product.productCategory' }
      }
    },
    {
      $set:{'product.supplier': '', 'product.productCategory': ''}
    }
  ]);

  try {
    res.send(JSON.stringify(coll[0]));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductOrdersByFarmerIDAndStatus = async (req, res, next) => {
  const farmerID = req.params.farmerID;
  const status = req.params.status;
  const coll = await ProductOrderModel.aggregate([
    {
      $match: { farmerID: mongoose.Types.ObjectId(farmerID), status: status }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $addFields: {
        product: { $first: '$product' }
      }
    }
  ]);
  
   try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const putProductOrderStatus = async (req, res, next) => {
// const id=mongoose.Types.ObjectId(req.params.id.trim());
  //   const filter = { _id:id};
  // const update = { status: req.body.status }

  // try {
  //   const dataToSave = await ProductOrderModel.findOneAndUpdate(filter, update, {
  //     returnOriginal: false
  //   });
  //   res.status(200).json(dataToSave);
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  // }
  // get product by ID
  const id=mongoose.Types.ObjectId(req.params.id);
 const status = req.body.status;
  const coll = await ProductOrderModel.update({_id: id},{$set:{status:"cancelledBySupplier"}});
// //const coll = await ProductOrderModel.findandupdate({_id:id},{$set:{'status':"CFW"}});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProductOrderStatus = async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = { status: req.body.status }

  try {
    const dataToSave = await ProductOrderModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProductOrders,
  getProductOrderByID,
  getProductOrderByProductID,
  getProductOrderByProductIDAndStatus,
  getProductOrdersByFarmerIDAndStatus,
  putProductOrderStatus,
  updateProductOrderStatus
};

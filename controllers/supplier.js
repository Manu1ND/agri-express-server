const SupplierModel = require("../models/supplierSchema");
const axios = require('axios');

const login = async (req, res, next) => {
  const phoneNo = req.body.phoneNo;
  var coll = await SupplierModel.findOne({ phoneNo: phoneNo });
  const data = {userType: 'supplier', _id: coll._id}
  
  axios
  .post(req.body.callbackurl, data)
  .then(resPost => {
    res.json(resPost.data);
  })
  .catch(err => {
    console.error(err)
    res.status(500).send(err);
  });
};

const getSuppliers = async (req, res, next) => {
  const coll = await SupplierModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSupplierByID = async (req, res, next) => {
  // get farmer by ID
  const id = req.params.id;
  const coll = await SupplierModel.findById(id);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSupplierByPhoneNo = async (req, res, next) => {
  // get farmer by ID
  const phoneNo = req.params.phoneNo;
  const coll = await SupplierModel.findOne({ phoneNo: phoneNo });

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const addSupplier = async (req, res, next) => {
  console.log(req.body);

  const data = new SupplierModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    imageURL: req.body.imageURL
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSupplier = async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    imageURL: req.body.imageURL,
  }

  try {
    const dataToSave = await SupplierModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  getSuppliers,
  getSupplierByID,
  getSupplierByPhoneNo,
  addSupplier,
  updateSupplier
};

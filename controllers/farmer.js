const FarmerModel = require("../models/farmerSchema");
const axios = require('axios');

const login = async (req, res, next) => {
  const phoneNo = req.body.phoneNo;
  var coll = await FarmerModel.findOne({ phoneNo: phoneNo });
  const data = {userType: 'farmer', _id: coll._id}
  
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

const getFarmers = async (req, res, next) => {
  // get farmers from mongoDB
  const coll = await FarmerModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFarmerByID = async (req, res, next) => {
  // get farmer by ID
  const id = req.params.id;
  const coll = await FarmerModel.findById(id);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFarmerByPhoneNo = async (req, res, next) => {
  // get farmer by ID
  const phoneNo = req.params.phoneNo;
  const coll = await FarmerModel.findOne({ phoneNo: phoneNo });

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const addFarmer = async (req, res, next) => {
  const data = new FarmerModel({
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

const updateFarmer = async (req, res, next) => {
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
    const dataToSave = await FarmerModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  getFarmers,
  getFarmerByID,
  getFarmerByPhoneNo,
  addFarmer,
  updateFarmer
};

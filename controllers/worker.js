const WorkerModel = require("../models/workersSchema");
const axios = require('axios');

const login = async (req, res, next) => {
  const phoneNo = req.body.phoneNo;
  var coll = await WorkerModel.findOne({ phoneNo: phoneNo });
  const data = {userType: 'worker', _id: coll._id}
  
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

const getWorkers = async (req, res, next) => {
  const coll = await WorkerModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getWorkerByID = async (req, res, next) => {
  // get worker by ID
  const id = req.params.id;
  const coll = await WorkerModel.findById(id);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getWorkerByPhoneNo = async (req, res, next) => {
  // get farmer by ID
  const phoneNo = req.params.phoneNo;
  const coll = await WorkerModel.findOne({ phoneNo: phoneNo });

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const addWorker = async (req, res, next) => {

  const data = new WorkerModel({
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

const updateWorker = async (req, res, next) => {
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
    const dataToSave = await WorkerModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  getWorkers,
  getWorkerByID,
  getWorkerByPhoneNo,
  addWorker,
  updateWorker
};

const JobModel = require("../models/jobSchema");
const JobOfferModel = require("../models/jobOfferSchema");
const JobCategoryModel = require("../models/jobCategorySchema");

const mongoose = require("mongoose");

const getJobCategory = async (req, res, next) => {
  // get jobs from mongoDB
  const coll = await JobCategoryModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobCategoryID = async (req, res, next) => {
  // get jobs from mongoDB
  const category = decodeURI(req.params.category);
  const coll = await JobCategoryModel.find({name: category});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobs = async (req, res, next) => {
  // get jobs from mongoDB
  const coll = await JobModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobByID = async (req, res, next) => {
  // get Job by ID
  const id = req.params.id;
  const coll = await JobModel.findById(id);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobsWorkerByCategoryID = async (req, res, next) => {
  // get product by ID
  const categoryID = req.params.categoryID;
  const coll = await JobModel.aggregate([
    {
      $match: {
        jobCategoryID: mongoose.Types.ObjectId(categoryID),
        isActive: true,
        availableQuantity: { $gt: 0 },
      }
    },
    {
      $lookup: {
        from: 'jobcategories',
        localField: 'jobCategoryID',
        foreignField: '_id',
        as: 'jobCategory'
      }
    },
    {
      $lookup: {
        from: 'farmers',
        localField: 'farmerID',
        foreignField: '_id',
        as: 'farmer'
      }
    },
    {
      $addFields: {
        farmer: { $first: '$farmer' },
        jobCategory: { $first: "$jobCategory" },
        wagePerDay: { $toString: "$wagePerDay" }
      }
    }
  ]);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobsFarmer = async (req, res, next) => {
  // get Job by ID
  const farmerID = req.params.farmerID;
  const coll = await JobModel.find({ farmerID: farmerID});
  var collMerged = [];

  // get job category name by id
  for (let i = 0; i < coll.length; i++) {
    let jobCategoryID = coll[i].jobCategoryID;
    let jobCategory = await JobCategoryModel.findById(jobCategoryID);
    jobCategory = {...jobCategory["_doc"]};
    collMerged.push({ ...coll[i]["_doc"], jobCategory });
  };

  try {
    res.send(JSON.stringify(collMerged));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobsFarmerByisActive = async (req, res, next) => {
  // get Job by ID
  const farmerID = req.params.farmerID;
  const isActive = req.params.isActive;
  const coll = await JobModel.find({ farmerID: farmerID, isActive: isActive });
  var collMerged = [];

  // get job category name by id
  for (let i = 0; i < coll.length; i++) {
    let jobCategoryID = coll[i].jobCategoryID;
    let jobCategory = await JobCategoryModel.findById(jobCategoryID);
    jobCategory = {...jobCategory["_doc"]};
    collMerged.push({ ...coll[i]["_doc"], jobCategory });
  };

  try {
    res.send(JSON.stringify(collMerged));
  } catch (error) {
    res.status(500).send(error);
  }
};

const addJob = async (req, res, next) => {
  const data = new JobModel({
    jobCategoryID: req.body.jobCategoryID,
    farmerID: req.body.farmerID,
    description: req.body.description,
    wagePerDay: req.body.wagePerDay,
    duration: req.body.duration,
    quantity: req.body.quantity,
    availableQuantity: req.body.quantity,
    date: req.body.date,
    isActive: true,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJob = async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = {
    jobCategoryID: req.body.jobCategoryID,
    farmerID: req.body.farmerID,
    description: req.body.description,
    wagePerDay: req.body.wagePerDay,
    duration: req.body.duration,
    quantity: req.body.quantity,
    date: req.body.date,
    isActive: true ? req.body.active == 'Yes' : false,
  }

  try {
    const dataToSave = await JobModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buyJobByID = async (req, res, next) => {
  // check job available quantity and isactive
  const jobID = req.params.jobID;
  const job = await JobModel.findById(jobID);
  
  if (job.availableQuantity < 1) {
    res.status(500).send("Job not available");
  } else if (!job.isActive) {
    res.status(500).send("Job is not active");
  } else {
    // reduce job quantity
    job.availableQuantity--;
    await job.save();

    // apply job offer
    const data = new JobOfferModel({
      jobID: req.params.jobID,
      workerID: req.body.workerID,
      status: 'pending',
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
  getJobCategory,
  getJobCategoryID,
  getJobsWorkerByCategoryID,
  getJobs,
  getJobByID,
  getJobsFarmer,
  getJobsFarmerByisActive,
  addJob,
  buyJobByID,
  updateJob
};
const JobOfferModel = require("../models/jobOfferSchema");
const JobModel = require("../models/jobSchema");
const JobCategoryModel = require("../models/jobCategorySchema");
const WorkerModel = require("../models/workersSchema");

const mongoose = require("mongoose");

const getJobOffers = async (req, res, next) => {
  // get Job by ID
  const coll = await JobOfferModel.find({});

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
}

const getJobOfferById = async (req, res, next) => {
  // get Job by ID
  const id = req.params.id;
  //const coll = await JobOfferModel.findById(id);

  const coll = await JobOfferModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: 'jobs',
        let: { "jobID": "$jobID" },
        pipeline: [
          { $match: { "$expr": { "$eq": ["$_id", "$$jobID"] }} },
          { $lookup: {
            from: "farmers",
            let: { "farmerID": "$farmerID" },
            pipeline: [
              { $match: { "$expr": { "$eq": ["$_id", "$$farmerID"] }} }
            ],
            as: "farmer"
          }},
          { $lookup: {
            from: "jobcategories",
            let: { "jobCategoryID": "$jobCategoryID" },
            pipeline: [
              { $match: { "$expr": { "$eq": ["$_id", "$$jobCategoryID"] }} }
            ],
            as: "jobCategory"
          }},
          {
            $addFields: {
              farmer: { $first: '$farmer' },
              jobCategory: { $first: '$jobCategory' }
            }
          },
        ],
        as: 'job'
      }
    },
    {
      $addFields: {
        job: { $first: '$job' },
        farmer: { $first: '$job.farmer' },
        jobCategory: { $first: '$job.jobCategory' }
      }
    },
    {
      $set:{'job.farmer': '', 'job.jobCategory': ''}
    }
  ]);

  try {
    res.send(JSON.stringify(coll[0]));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobOffersByJobId = async (req, res, next) => {
  // get Job by ID
  const jobID = req.params.jobID;
  const jobOffers = await JobOfferModel.aggregate([
    {
      $match: { jobID: mongoose.Types.ObjectId(jobID) }
    },
    {
      $lookup: {
        from: 'workers',
        localField: 'workerID',
        foreignField: '_id',
        as: 'worker'
      }
    },
    {
      $addFields: {
        worker: { $first: '$worker' }
      }
    }
  ]);
  
  let job = await JobModel.findById(jobID);
  let jobCategoryID = job.jobCategoryID;
  const jobColl = await JobModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(jobID) }
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
      $addFields: {
        jobCategory: { $first: '$jobCategory' }
      }
    }
  ]);

  try {
    res.send(JSON.stringify({jobOffers, job: jobColl[0]}));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobOffersByJobIdAndStatus = async (req, res, next) => {
  // get Job by ID
  const jobID = req.params.jobID;
  const status = req.params.status;
  const jobOffers = await JobOfferModel.aggregate([
    {
      $match: { jobID: mongoose.Types.ObjectId(jobID), status: status }
    },
    {
      $lookup: {
        from: 'workers',
        localField: 'workerID',
        foreignField: '_id',
        as: 'worker'
      }
    },
    {
      $addFields: {
        worker: { $first: '$worker' }
      }
    }
  ]);
  
  let job = await JobModel.findById(jobID);
  let jobCategoryID = job.jobCategoryID;
  const jobColl = await JobModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(jobID) }
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
      $addFields: {
        jobCategory: { $first: '$jobCategory' }
      }
    }
  ]);

  try {
    res.send(JSON.stringify({jobOffers, job: jobColl[0]}));
  } catch (error) {
    res.status(500).send(error);
  }
};

const getJobOffersByWorkerIDAndStatus = async (req, res, next) => {
  const workerID = req.params.workerID;
  const status = req.params.status;

  const coll = await JobOfferModel.aggregate([
    {
      $match: { workerID: mongoose.Types.ObjectId(workerID), status: status }
    },
    {
      $lookup: {
        from: 'jobs',
        let: { "jobID": "$jobID" },
        pipeline: [
          { $match: { "$expr": { "$eq": ["$_id", "$$jobID"] }} },
          { $lookup: {
            from: "jobcategories",
            let: { "jobCategoryID": "$jobCategoryID" },
            pipeline: [
              { $match: { "$expr": { "$eq": ["$_id", "$$jobCategoryID"] }} }
            ],
            as: "jobCategory"
          }},
          {
            $addFields: {
              jobCategory: { $first: '$jobCategory' }
            }
          },
        ],
        as: 'job'
      }
    },
    {
      $addFields: {
        job: { $first: '$job' },
        jobCategory: { $first: '$job.jobCategory' }
      }
    },
    {
      $set:{'job.jobCategory': ''}
    }
  ]);

  try {
    res.send(JSON.stringify(coll));
  } catch (error) {
    res.status(500).send(error);
  }
};

const updatejobOfferStatus = async (req, res, next) => {
  const filter = { _id: req.params.id };
  const update = { status: req.body.status }

  try {
    const dataToSave = await JobOfferModel.findOneAndUpdate(filter, update, {
      returnOriginal: false
    });
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getJobOffers,
  getJobOfferById,
  getJobOffersByJobId,
  getJobOffersByJobIdAndStatus,
  getJobOffersByWorkerIDAndStatus,
  updatejobOfferStatus
};
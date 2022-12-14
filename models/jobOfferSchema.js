const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);

const Schema = mongoose.Schema;

const JobOfferSchema = new Schema({
  jobID: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  workerID: {
    type: Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  appliedDate: { type: Date, default: Date.now, required: true },
  acceptedDate: { type: Date, default: Date.now, required: true },
  status: { type: String, required: true }
});

// Export model
module.exports = mongoose.model("JobOffer", JobOfferSchema);

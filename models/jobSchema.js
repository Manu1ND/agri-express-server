const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);

const Schema = mongoose.Schema;

function getCost(value) {
  if (typeof value !== 'undefined') {
    return parseFloat(value.toString());
  }
  return value;
};

const JobSchema = new Schema({
  jobCategoryID: {
    type: Schema.Types.ObjectId,
    ref: "JobCategory",
    required: true
  },
  farmerID: {
    type: Schema.Types.ObjectId,
    ref: "Farmer",
    required: true
  },
  description: { type: String },
  wagePerDay: { type: Schema.Types.Decimal128, required: true, get: getCost },
  duration: { type: Int32, required: true },
  imageURL: { type: String },
  quantity: { type: Int32, required: true },
  availableQuantity: { type: Int32, required: true },
  date: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, required: true }
}, {toJSON: {getters: true}});

// Export model
module.exports = mongoose.model("Job", JobSchema);
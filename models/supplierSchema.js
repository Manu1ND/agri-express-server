const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  bio: { type: String },
  location: { type: String, required: true },
  imageURL: { type: String, required: false }
});

// Export model
module.exports = mongoose.model("Supplier", SupplierSchema);

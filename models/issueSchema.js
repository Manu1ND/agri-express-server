const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  userType: { type: String, required: true },
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  userID: { type: String, required: true },
  issueType: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

// Export model
module.exports = mongoose.model("Issue", IssueSchema);

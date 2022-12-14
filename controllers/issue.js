const IssueModel = require("../models/issueSchema");

const addIssue = async (req, res, next) => {
  const data = new IssueModel({
    userType: req.body.userType,
    userID: req.body.userID,
    issueType: req.body.issueType,
    description: req.body.description
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addIssue
};

const express = require("express");
const router = express.Router();
const issueRoute = require("../controllers/issue");

router.post("/", issueRoute.addIssue);

module.exports = router;

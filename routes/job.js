const express = require("express");
const router = express.Router();
const jobRoute = require("../controllers/job");

router.get("/category", jobRoute.getJobCategory);
router.get("/category/:category", jobRoute.getJobCategoryID);
router.get("/", jobRoute.getJobs);
router.get("/:id", jobRoute.getJobByID);
router.get("/worker/categoryID/:categoryID", jobRoute.getJobsWorkerByCategoryID);
router.get("/farmer/:farmerID", jobRoute.getJobsFarmer);
router.get("/farmer/:farmerID/:isActive", jobRoute.getJobsFarmerByisActive);

router.post("/", jobRoute.addJob);
router.post("/apply/:jobID", jobRoute.buyJobByID);

router.put("/:id", jobRoute.updateJob);

module.exports = router;

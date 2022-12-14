const express = require("express");
const router = express.Router();
const jobOfferRoute = require("../controllers/jobOffer");

router.get("/", jobOfferRoute.getJobOffers);
router.get("/:id", jobOfferRoute.getJobOfferById);
router.get("/job/:jobID/", jobOfferRoute.getJobOffersByJobId);
router.get("/job/:jobID/:status", jobOfferRoute.getJobOffersByJobIdAndStatus);
router.get("/worker/:workerID/:status", jobOfferRoute.getJobOffersByWorkerIDAndStatus);

router.put("/:id", jobOfferRoute.updatejobOfferStatus);

module.exports = router;

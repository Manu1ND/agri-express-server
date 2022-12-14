const express = require("express");
const router = express.Router();
const workerRoute = require("../controllers/worker");

router.get("/:id", workerRoute.getWorkerByID);
router.get("/phoneNo/:phoneNo", workerRoute.getWorkerByPhoneNo);
router.get("/", workerRoute.getWorkers);

router.post("/", workerRoute.addWorker);
router.post("/login/", workerRoute.login);

router.put("/:id", workerRoute.updateWorker);

module.exports = router;

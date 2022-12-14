const express = require("express");
const router = express.Router();
const farmerRoute = require("../controllers/farmer");

router.get("/", farmerRoute.getFarmers);
router.get("/:id", farmerRoute.getFarmerByID);
router.get("/phoneNo/:phoneNo", farmerRoute.getFarmerByPhoneNo);

router.post("/", farmerRoute.addFarmer);
router.post("/login/", farmerRoute.login);

router.put("/:id", farmerRoute.updateFarmer);

module.exports = router;

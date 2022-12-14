const express = require("express");
const router = express.Router();
const supplierRoute = require("../controllers/supplier");

router.get("/:id", supplierRoute.getSupplierByID);
router.get("/phoneNo/:phoneNo", supplierRoute.getSupplierByPhoneNo);
router.get("/", supplierRoute.getSuppliers);

router.post("/", supplierRoute.addSupplier);
router.post("/login/", supplierRoute.login);

router.put("/:id", supplierRoute.updateSupplier);

module.exports = router;

const express = require("express");
const router = express.Router();
const productOrderRoute = require("../controllers/productOrder");

router.get("/", productOrderRoute.getProductOrders);
router.get("/:id", productOrderRoute.getProductOrderByID);
router.get("/product/:productID/:status",productOrderRoute.getProductOrderByProductIDAndStatus);
router.get("/farmer/:farmerID/:status", productOrderRoute.getProductOrdersByFarmerIDAndStatus);
router.get("/product/:productID",productOrderRoute.getProductOrderByProductID);

router.put("/:id", productOrderRoute.updateProductOrderStatus);
//router.put("/:id/:status",productOrderRoute.putProductOrderStatus);
//router.put("/supplier/:id/:status",productOrderRoute.putProductOrderStatus);
router.put("/supplier/:id",productOrderRoute.putProductOrderStatus);

module.exports = router;

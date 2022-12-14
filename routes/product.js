const express = require("express");
const router = express.Router();
const productRoute = require("../controllers/product");

router.get("/category", productRoute.getProductCategory);
router.get("/category/:category",productRoute.getProductCategoryID);
router.get("/", productRoute.getProducts);
router.get("/:id", productRoute.getProductByID);
router.get("/farmer/categoryID/:categoryID", productRoute.getProductsFarmerByCategoryID);
router.get("/supplier/:supplierID", productRoute.getProductBySupplierID);


router.post("/", productRoute.addProduct);

router.post("/buy/:productID", productRoute.buyProductByID);
router.put("/:id",productRoute.updateProduct);


module.exports = router;

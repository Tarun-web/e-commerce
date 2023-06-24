const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controller/productController");
const { isAuthenticatedUser, authorisedRole } = require("../middleware/auth");
  const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products/new").post(isAuthenticatedUser, createProduct);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorisedRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorisedRole("admin"), deleteProduct)
  .get(getProductDetails);

router.route("/product/:id").get(getProductDetails);

// //reviews
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser, deleteReview)




module.exports = router;

const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  deleteOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controller/orderController");
const { isAuthenticatedUser, authorisedRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/order")
  .get(isAuthenticatedUser, authorisedRole("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorisedRole("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorisedRole("admin"), deleteOrder);

module.exports = router;

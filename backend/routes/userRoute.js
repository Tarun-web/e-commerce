const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  userDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorisedRole } = require("../middleware/auth");
const router = express.Router();

//login
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

//password
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

//user details and updations
router.route("/me").get(isAuthenticatedUser, userDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//user details and modifications by Admin
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorisedRole("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorisedRole("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorisedRole("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorisedRole("admin"), deleteUser);

module.exports = router;

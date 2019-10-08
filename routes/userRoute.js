const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.isLoggedIn);
router.route("/signup").post(authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router
  .route("/")
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);

module.exports = router;

const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express();

router.use(authController.isLoggedIn);
router.route("/login").get(viewController.login);
router.get("/", viewController.getHomePage);
router.get("/signup", viewController.signup);
router.get("/test", authController.protect, viewController.getTests);

module.exports = router;

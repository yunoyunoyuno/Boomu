const express = require("express");
const testController = require("../controllers/testController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/top-3-popularTests").get(testController.aliasTopTests, testController.getAllTests);
router.route("/testStats").get(testController.getTestStats);

router
  .route("/")
  .post(testController.createTest)
  .get(authController.protect, testController.getAllTests);

router
  .route("/:testId/")
  .get(testController.getTest)
  .patch(testController.updateTest)
  .delete(testController.deleteTest);
module.exports = router;

const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
});

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany();
  res.send("Delete all");
});

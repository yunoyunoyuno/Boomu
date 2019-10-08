const Test = require("./../models/testModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.aliasTopTests = (req, res, next) => {
  req.query.limit = 3;
  req.query.sort = "-examinerAmount";
  req.query.fields = "name,price,examinerAmount";
  next();
};

exports.createTest = catchAsync(async (req, res) => {
  const newTest = await Test.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      test: newTest
    }
  });
});

exports.getAllTests = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Test.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const tests = await features.modelQuery;
  //Advance Filtering

  res.status(201).json({
    status: "success",
    data: {
      test: tests
    }
  });
});

exports.getTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.testId);
  if (!test) {
    return next(new AppError("Can't find Test with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      test
    }
  });
});

exports.updateTest = catchAsync(async (req, res, next) => {
  const updateTest = await Test.findByIdAndUpdate(req.params.testId, req.body, {
    runValidators: true,
    new: true
  });

  if (!updateTest) {
    return next(new AppError("Can't find Test with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      updateTest
    }
  });
});

exports.deleteTest = catchAsync(async (req, res, next) => {
  await Test.findByIdAndDelete(req.params.testId);
  res.status(204).json({
    status: "success",
    data: null
  });

  return next(new AppError("Can't find Test with that ID", 404));
});

exports.getTestStats = catchAsync(async (req, res, next) => {
  const stats = await Test.aggregate([
    {
      $match: { price: { $lte: 1000 } }
    },
    {
      $group: {
        _id: { $toUpper: "$level" },
        numTests: { $sum: 1 }, //add all parse documents.
        numExaminerAmount: { $sum: "$examinerAmount" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

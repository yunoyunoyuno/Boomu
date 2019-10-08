const AppError = require("../utils/AppError");

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/playground")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.log("Error ***", err);
    return res.send("Something went very wrong, please try again later");
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      status: err.status,
      msg: err.message
    });
  }
  console.log("Error ***", err);
  return res.status(err.statusCode).render("error", {
    status: err.status,
    msg: "Something went very wrong, please try again later"
  });
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/playground")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message
    });
  }
};

const handleCastError = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const start = err.errmsg.indexOf('"');
  const end = err.errmsg.indexOf("}");
  const value = err.errmsg.slice(start, end).trim();

  const message = `Duplicate fields value : ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = err => {
  return new AppError("Invalid Token. Please login again", 401);
};

const handleJWTExpiredError = err => {
  return new AppError("Your token has expired! Please login again", 401);
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.startsWith("p")) {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    sendErrorProd(error, req, res);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiresError") error = handleJWTExpiredError(error);
  }
};

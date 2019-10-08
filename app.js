const mongoose = require("mongoose");
const express = require("express");
const testRouter = require("./routes/testRoute");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/errorController.js");
const AppError = require("./utils/AppError");
const userRouter = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const viewRouter = require("./routes/viewRoutes");

//Vital requirement
const app = express();
app.set("view engine", "ejs");
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
dotenv.config({ path: "./config.env" });
app.use(express.static("public"));

//Using middleWare function.
//3)Routes
app.use((req, res, next) => {
  currentUser = res.locals.user;
  next();
});
app.use("/playground/users/", userRouter);
app.use("/playground/tests/", testRouter);
// app.use("/", (req, res) => {
//   res.status(200).render("homepage.ejs");
// });
app.use("/", viewRouter);

//Test moddlewate
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
const DBLocal = process.env.DATABASE_LOCAL;

mongoose
  .connect(DBLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully Connect to Atlas Database...");
  })
  .catch(err => {
    console.log(err.stack);
  });

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLE REJECTION Server is going to shutdown...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION Server is going to shutdown...");
  process.exit(0);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is connected to port: ${port}`);
});

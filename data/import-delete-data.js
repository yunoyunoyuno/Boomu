const fs = require("fs");
const Test = require("../models/testModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
DBLocal = process.env.DATABASE_LOCAL;
console.log(DBLocal);

mongoose
  .connect(DBLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connect to database");
  });

//Read json data and parse into JSON object

const data = JSON.parse(fs.readFileSync(`${__dirname}/test-data.json`, "utf-8"));

const importData = async () => {
  try {
    //Create Test data from json object
    await Test.create(data);
    console.log("Data successfully loaded");
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    //Delete all the documents
    await Test.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

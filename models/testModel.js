const mongoose = require("mongoose");
const slugify = require("slugify");
const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Test required the name"],
      maxlength: [20, "The name of the test requied maximum 20 letter"],
      minlength: [1, "Test name must requied at least 1 charactor"],
      unique: true
    },
    level: {
      type: String,
      default: "easy",
      enum: {
        values: ["easy", "normal", "difficult"],
        message: "The level choices have only easy, normal and difficult"
      },
      required: [true, "This field is required"]
    },
    price: {
      type: Number,
      required: [true, "The price of the tests is required"],
      min: [0, "Price must be at least free Test"],
      max: [99999999999999, "This is the most expensive test"]
    },
    examinerAmount: {
      type: Number,
      required: [true, "The amount of examiner is required"]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    slug: String,
    secretTest: {
      type: Boolean,
      default: false
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

testSchema.virtual("in US").get(function() {
  return (this.price / 33).toFixed(2) + " $";
});

//Document middleware : runs before .save() and .create()
testSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// testSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

testSchema.pre(/^find/, function(next) {
  this.find({ secretTest: { $ne: true } });
  this.start = Date.now();
  next();
});

testSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

testSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTest: { $ne: true } } });
  next();
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;

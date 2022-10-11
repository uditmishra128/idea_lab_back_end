const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to mongoDB...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

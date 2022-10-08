const mongoose = require("mongoose");

module.exports = {
    mongoose : async (req,res,next) => {
        const mongoURI = "mongodb://localhost:27017/ripeify";
mongoose
  .connect(mongoURI)
  .then((res) => {
    console.log("mongoose runnig on port 7000");
  })
  .catch((err) => {
    console.log("not connected");
  });
    }
}
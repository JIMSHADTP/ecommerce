const mongoose = require("mongoose");

module.exports = {
    mongoose : async (req,res,next) => {
        const mongoURI = process.env.MONGO_URI;
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
const { query } = require("express");
const mongoose = require("mongoose");
const passportLocalMongoos = require("passport-local-mongoose");

const AddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  house: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  }


})
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  isVerified : {
    type: Boolean,
    required : true,
    default : false
  },
  Address : {
    type : [AddressSchema]
  },
  otp : {
    type:Number
  },
  redeemedCoupons : [{
    type : mongoose.Schema.Types.ObjectId,
    ref:'Coupon'
  }]

},{timestamps : true});

//password hash and salt 
UserSchema.plugin(passportLocalMongoos, {
  usernameField: "email",
  findByUsername: function (model, queryParameters) {
    queryParameters.isActive = true;
    return model.findOne(queryParameters);
  }
});

module.exports = mongoose.model("User", UserSchema);

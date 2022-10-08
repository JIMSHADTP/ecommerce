const userModel = require("../models/userModel");
const productModel = require('../models/ProductModel')
const passport = require("passport");
const { json } = require("express");
const { sendOtp , getOtpForm } = require ("../middlewares/otp")


module.exports = {
  userRegister: (req, res) => {
    if (req.body.password === req.body.password2) {
      userModel.register(
        {
          name: req.body.name,
          email: req.body.email,
        },
        req.body.password,
        (err, user) => {
          if (err) {
            console.log(err);
            req.flash("message", "User Already registered")
            res.redirect("/signup");
          } else {
            passport.authenticate("local")(req, res, () => {
              process.nextTick(async () => {
                await sendOtp(req, res)
              }) 
              res.redirect("/");
            });
          }
        }
      );
    } else {
  
      console.log("password not match");
      res.redirect("/signup");
    }
  },

  userLogin: passport.authenticate("local", {
    
    failureRedirect: "/login",
  }),

  userLogout: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
      } else {

        res.redirect("/");
      }
    });
  },


  checkLogout: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/home");
    } else {
      res.render('user/user-login');
    }
  },
  checkSignup: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/home");
    } else {
      res.render('user/user-signup');
    }
  },
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id
      const user = await userModel.findById(userId)
      res.render("user/profile", { user: user })

    } catch (error) {
      return res.status(500).json({error})
    }
  },
  addAddress: async (req, res) => {

    try {
      const userId = req.user.id
      const userData = await userModel.findById(userId)
      userData.Address.unshift({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        house: req.body.house,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        phone: req.body.phone
      })
      await userData.save()
      res.redirect('back');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error })
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const userId = req.user.id
      const addressId = Number(req.params.id)
      const user = await userModel.findById(userId)
      user.Address.splice(addressId, 1)
      await user.save()
      return res.status(201).json({ message: "address deleted" })
    } catch (error) {
      return res.status(500).json({error})
    }
  },
  editAddress: async (req, res) => {
    try {
      const userId = req.user.id
      const addressId = req.params.id
      let add = await userModel.updateOne({ userId, Address: { $elemMatch: { _id: addressId } } },
        {
          $set: {
            "Address.$.firstName": req.body.firstName,
            "Address.$.lastName": req.body.lastName,
            "Address.$.house": req.body.house,
            "Address.$.address": req.body.address,
            "Address.$.city": req.body.city,
            "Address.$.state": req.body.state,
            "Address.$.pincode": req.body.pincode,
            "Address.$.phone": req.body.phone
          }
        })
      res.redirect('back')
    } catch (error) {
      return res.status(500).json({error})
    }
  }
};
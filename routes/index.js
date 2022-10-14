var express = require('express');
const { render } = require('../app');
const productControl = require('../controller/productControl');
var router = express.Router();
const userControl = require('../controller/userControl')
const ProductModel = require('../models/ProductModel');
const orderControl = require("../controller/orderControl")
const authentication = require('../middlewares/authentication')
const {sendOtp,getOtpForm,otpVerification} = require ('../middlewares/otp')
const paymentControl= require('../controller/paymentControl')

/* GET home page. */

router.get('/',authentication.checkAccountVerifiedInIndex,productControl.showProduct)
// router.get("/", userControl.userLogin, userControl.checkLogout),
  router.get('/home', productControl.showProduct);
router.get('/login', userControl.checkLogout)

router.get('/signup', userControl.checkSignup, function (req, res, next) {
  const errorMessage = req.flash("message")
  res.render('user/user-signup', { errorMessage: errorMessage,});
});



router.post('/signup', userControl.userRegister)




router.post("/login", userControl.userLogin, (req, res) => {
  if (req.user.isAdmin === true) {
    res.redirect("/admin")
  }
  else {
    res.redirect("/")
  }
})

router.post('/resendOtp',async (req,res) => {
  getOtpForm(req,res)
  await sendOtp(req,res)
})

// router.post("/validateOtp", otpVerification)
router.post("/logout", userControl.userLogout)
router.get('/productPage', productControl.pageProduct)
router.get('/viewProduct/:id', productControl.viewProduct)
router.post('/addtocart/:id', productControl.addTocart)
router.get('/getcart', productControl.getcart)
router.get('/cartItemCount', productControl.cartItemCount)
router.delete('/deleteCartItem/:id', productControl.deleteItem)
router.get("/profile", userControl.getProfile)
router.post("/addAddress", userControl.addAddress)
router.delete('/deleteAddress/:index', userControl.deleteAddress)
router.post('/editAddress/:id', userControl.editAddress)
router.get('/checkout', orderControl.getCheckout)
router.post('/addtowishlist/:id', productControl.addTowishlist)
router.get('/getwishlist', productControl.getWishlist)
router.get('/wishlistItemCount', productControl.wishlistItemCount)
router.post('/redeem/:id',productControl.redeem)
router.post('/placeOrder',orderControl.placeOrder)
router.get('/getorder',orderControl.getorder)

router.post("/payment/orderId",paymentControl.generateOrder)
router.post("/payment/verify/:orderId",paymentControl.verifyPayment)
router.post("/payment/:id/refund",paymentControl.refund)
router.get('/showcategorywise',productControl.showCatogorywise)


router.put("/cancelOrder/:id", orderControl.cancelOrder)



module.exports = router;

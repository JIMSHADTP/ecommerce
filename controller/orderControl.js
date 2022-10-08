
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")

module.exports = {
  placeOrder: async (req, res, next) => {


    try {
      const userId = req.user.id
      const addressIndex = req.body.addressIndex
      const user = await userModel.findById(userId)
      const couponDiscount = req.session.coupon?.discount
      const couponCode = req.session.coupon?.code
      const couponId = req.session.coupon?.id
      if (!addressIndex) {
          console.log(req.body);
          user.Address.unshift({
            
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              house: req.body.house,
              address: req.body.address,
              city: req.body.city,
              state: req.body.state,
              pincode: req.body.pincode,
              phone: req.body.phone
          })
          await user.save()
      }
      const cart = await cartModel.findOne({ userId: userId })
      const paymentType = req.body.paymentType
      const deliveryAddress = addressIndex ? user.Address[addressIndex] : user.Address[0]

      const newOrder = new orderModel({
          userId: userId,
          deliveryAddress: deliveryAddress,
          products: cart.products,
          quantity: cart.quantity,
          subTotal: cart.subTotal,
          total: cart.total,
          paymentType: paymentType
      })
     
      if (paymentType == "razorpay") {
          newOrder.razorpayOrderId = req.body.orderId
          newOrder.razorpayPaymentId = req.body.paymentId
      }

      //adding coupon details if applied
      if (req.session.coupon) {
          newOrder.total = cart.total - couponDiscount
          newOrder.coupon.code = couponCode
          newOrder.coupon.discount = couponDiscount

          //adding coupon to  user coupon list
          user.redeemedCoupons.push(couponId)
          await user.save()
      }

      await cart.remove()
      await newOrder.save()
      res.sendStatus(201)

  } catch (err) {
      console.log(err)
      res.sendStatus(500)

  }
  },
  getCheckout: async (req, res) => {
    try {
      const userId = req.user.id
      const user = await userModel.findById(userId, { email: 1, Address: 1 })
      const findCart = await cartModel.findOne({ userId: userId }).populate("products", "productId")

      const couponCode = req.session.coupon?.code;
      const couponDiscount = req.session.coupon?.discount

      if(findCart.products.length>0){
        res.render('user/checkout', { findCart, user,couponCode,couponDiscount })
      }else{
        res.render("user/shoping-cart")
      }

    } catch (error) {
   
    }
  },
  getorder : async (req,res) => {
    try {
      // const userId = req.user.id
      // const findOrder = await orderModel.find(userId).populate([
      //   {
      //     path : "userId",
      //     model :"User"
      //   },
      //   {
      //     path:"products.productId",
      //     model : "Product"
      //   }
      // ]).exec()
// console.log(findOrder);
res.render('user/orders')

    } catch (error) {
      console.log(error);
      
    }
  }
}
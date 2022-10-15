
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel");
const ProductModel = require("../models/ProductModel");

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
      const userId = req.user.id
      const myOrders = await orderModel.find({userId}).populate([
        {
          path : "userId",
          model :"User"
        },
        {
          path:"products.productId",
          model : "Product"
        }
      ]).exec()

res.render('user/orders',{myOrders:myOrders})

    } catch (error) {
      console.log(error);
      
    }
  },
  packOrder: async (req, res) => {

      try {
          const orderId = req.params.id
         
          const myOrder = await orderModel.findById(orderId)
          if (myOrder.status != "Cancelled") {
              myOrder.status = "Packed"
              await myOrder.save()
              return res.status(201).json({ message: "order Packed" })
          } else {
              return res.status(400).json({ message: "cant update status, Item is cancelled" })
          }

      } catch (err) {
          return res.status(500).json(err)
      }
  },
  shipOrder: async (req, res) => {
    try {
        const orderId = req.params.id
        const myOrder = await orderModel.findById(orderId)
        if (myOrder.status != "Cancelled") {
            myOrder.status = "Shipped"
            await myOrder.save()
            return res.status(201).json({ message: "order shipped" })
        } else {
            return res.status(400).json({ message: "cant update status, Item is cancelled" })
        }

    } catch (err) {
        return res.status(500).json(err)
    }

},
outForDelivery: async (req, res) => {
  try {
      const orderId = req.params.id
      const myOrder = await orderModel.findById(orderId)
      if (myOrder.status != "Cancelled") {
          myOrder.status = "Out for delivery"
          await myOrder.save()
          return res.status(201).json({ message: "out for delivery" })
      } else {
          return res.status(400).json({ message: "cant update status, Item is cancelled" })
      }

  } catch (err) {
      return res.status(500).json(err)
  }

},


deliverPackage: async (req, res) => {
  try {
      const orderId = req.params.id
      const myOrder = await orderModel.findById(orderId)
      if (myOrder.status != "Cancelled") {
          myOrder.status = "Delivered"
          await myOrder.save()
          return res.status(201).json({ message: "order delivered" })
      } else {
          return res.status(400).json({ message: "cant update status, Item is cancelled" })
      }
  } catch (err) {
      return res.status(500).json(err)
  }

},

cancelOrder: async (req, res) => {
  try {

      const orderId = req.params.id
      const myOrder = await orderModel.findById(orderId)

      if (myOrder.status != "Cancelled" && myOrder.status != "Delivered") {
          //updating stock for each items in order before cancelling 
          myOrder.products.forEach(async product => {
              let myProduct = await ProductModel.findById(product.productId)
              myProduct.quantity += product.quantity
              await myProduct.save()
          })
          myOrder.status = "Cancelled"
          await myOrder.save()
          return res.status(201).json({ message: "order cancelled and stock updated" })
      } else {
          return res.status(400).json({ message: "cant update status, Item already cancelled" })
      }

  } catch (err) {
      console.log(err)
      return res.status(500).json(err)
  }
},

}
const productModel = require('../models/ProductModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const ProductModel = require('../models/ProductModel');
const categoryModel = require('../models/categoryModel')
const wishlistModel = require('../models/wishlistModel')
const couponModel = require('../models/couponModel')
const bannerModel = require('../models/bannerModel')
var mongoose = require('mongoose');
const { find } = require('../models/userModel');
const { response } = require('../app');



module.exports = {
  showProduct: async (req, res) => {
    try {
      const viewBanner = await bannerModel.find()
      const allCategory = await categoryModel.find()
      const Allproduct = await productModel.find()
        .limit(12).exec();

      res.render('home', { Allproduct, allCategory, viewBanner });
    } catch (error) {
      res.redirect('/home')
      return res.status(500).json({ error })
    }
  },
  pageProduct: async (req, res) => {
    try {
      const allCategory = await categoryModel.find()
      const allProduct = await productModel.find()
        .limit(12).exec();
      res.render('user/product', { allProduct, allCategory });
    } catch (error) {
      res.redirect('/home')
      return res.status(500).json({ error })
    }
  },
  viewProduct: async (req, res) => {
    try {
      const relateProduct = await productModel.find().limit(4)
      const oneProduct = await productModel.findById(req.params.id)
      res.render('user/view-product', { oneProduct, relateProduct })
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  },

  addTocart: async (req, res) => {

    const productId = req.params.id
    const price = Number(req.body.price);
    const quantity = (req.body.quantity)
    const { name, offerPrice } = req.body;
    try {

      const findProduct = await productModel.findById(productId)
      if (findProduct.stock >= quantity) {
        findProduct.stock -= quantity
        const userId = req.user.id
        let cart = await cartModel.findOne({ userId });
        if (cart) {
          //cart exists for user
          let itemIndex = cart.products.findIndex(p => p.productId == productId);
          if (itemIndex > -1) {
            //product exists in the cart, update the quantity
            let productItem = cart.products[itemIndex];
            productItem.quantity += quantity;
          } else {
            //product does not exists in cart, add new item
            cart.products.push({ productId, price, quantity, name, offerPrice });
          }
          cart.subTotal = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0)
          cart.total = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * (curr.offerPrice || curr.price);
          }, 0)
          await cart.save()
        } else {
          //no cart for user, create new cart
          const subTotal = quantity * price
          const total = offerPrice ? quantity * offerPrice : subTotal
          cart = new cartModel({
            userId: userId,
            products: [{ productId, quantity, price, name, offerPrice }],
            subTotal: subTotal,
            total: total
          });
          await cart.save()
        }
        res.status(201).json({ message: "cart item updated" })
      } else {
        return res.status(200).json({ message: "item not available" })
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ err });
    }
  },
  getcart: async (req, res) => {
    try {
      const userId = req.user.id
      const viewcart = await cartModel.findOne({ userId: userId }).populate("products.productId").exec()
      const coupon = await couponModel.find()

      const couponCode = req.session.coupon?.code
      const couponDiscount = req.session.coupon?.discount

     

      res.render('user/shoping-cart', { viewcart, coupon,couponCode,couponDiscount })
    } catch (error) {
      // console.log(error);
      res.redirect('/')
    }
  },
  cartItemCount: async (req, res, next) => {
    try {
      const userId = req.user.id
      let itemCount = 0
      const cart = await cartModel.findOne({ userId })
      if (cart) {
        cart.products.forEach(productModel => {
          itemCount += productModel.quantity
        })
      }
      res.locals.cartItemCount = itemCount
      return res.status(200).json({ itemCount: itemCount })
    } catch (error) {
      return res.status(500).json({ error })
    }
  },

  deleteItem: async (req, res, next) => {
    const userId = req.user.id
    const productId = req.params.id
    const cartCount = req.body.cartCount
    try {
      const findProduct = await ProductModel.findById(productId)
      findProduct.quantity += cartCount
      const cart = await cartModel.findOne({ userId })
      const itemIndex = cart.products.findIndex(product => product.productId == productId);
      cart.products.splice(itemIndex, 1)
      cart.subTotal = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0)
      cart.total = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * (curr.offerPrice || curr.price);
      }, 0)
      await cart.save()
      await findProduct.save()
      return res.status(200).json({
        message: "successfully deleted",
        cartSubTotal: (cart.subTotal).toFixed(2),
        cartDiscount: (cart.subTotal - cart.total).toFixed(2),
        cartTotal: (cart.total).toFixed(2)
      })
    } catch (err) {
      return res.status(400).json({ err })
    }
  },

  addTowishlist: async (req, res) => {
    const productId = req.params.id
    const name = req.body.name;
    try {
      const userId = req.user.id
      let list = await wishlistModel.findOne({ userId: userId });
      if (list) {
        let itemIndex = list.myWish.findIndex(p => p.productId == productId);
        if (itemIndex > -1) {
          list.myWish.splice(itemIndex, 1)
          await list.save()
          return res.status(204).json({ message: "removed from wishlist" })
        } else {
          list.myWish.push({ productId, name });
        }
        await list.save()
        return res.status(201).json({ message: "added to wishlist" })
      } else {
        list = new wishlistModel({
          userId: userId,
          myWish: [{ productId, name }],
        });
        await list.save()
        return res.status(201).json({ message: "added to wishlist" })
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err })
    }
  },
  getWishlist: async (req, res) => {
    try {
      const userId = req.user.id
      const findwish = await wishlistModel.findOne({ userId: userId }).populate("myWish.productId").exec()
      res.render('user/wishlist', { findwish: findwish })
    } catch (error) {
      // console.log(error);

    }
  },

  wishlistItemCount: async (req, res, next) => {
    try {
      const userId = req.user.id
      const wishlist = await wishlistModel.findOne({ userId })
      let indexCount = (wishlist?.myWish) ? (wishlist.myWish.length) : 0
      res.locals.wishlistItemCount = indexCount
      return res.status(200).json({ indexCount: indexCount })
    } catch (err) {
      return res.status(500).json({ err })
    }
  },
  redeem: async (req, res,next) => {

    const userId = req.user.id
    const couponCode = req.params.id
    
    try {

      const user = await userModel.findById(userId).exec()
      const findCart = await cartModel.findOne({ userId })
      const findCoupon = await couponModel.findOne({couponCode})
      const totalPrice = findCart?.total
      const expDate = findCoupon?.expDate


      //checking coupon expiry date
      const isNotExpired = expDate ? new Date() <= expDate : true

      if (findCoupon?.isActive && isNotExpired) {
        const isRedeemed = user.redeemedCoupons.includes(findCoupon.id)
        if(!isRedeemed){
          if(totalPrice >= findCoupon.minPurchase){
            const discount = ((totalPrice * findCoupon.discount) / 100)
            const couponDiscount = discount <= findCoupon?.maxLimit ? Number (discount) : Number(findCoupon.maxLimit)
          //saving coupon details in session
            req.session.coupon = {
              id : findCoupon.id,
              code : findCoupon.couponCode,
              discount: couponDiscount
            }         
            return res.status(200).json({couponDiscount :couponDiscount,totalPrice:totalPrice ,message : "coupon is valid"});

          }
          req.session.coupon == null
          return res.status(401).json({message : "min purchase amount"})
        }
      }
    } catch (error) {
      console.log(error);

    }
  }
}
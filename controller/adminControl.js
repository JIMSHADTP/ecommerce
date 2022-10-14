const { isObjectIdOrHexString } = require("mongoose")
const { updateOne } = require("../models/userModel")
const ObjectId = require('mongodb').ObjectId;
const userModel = require('../models/userModel')
const productModel = require('../models/ProductModel')
const categoryModel = require('../models/categoryModel');
const bannerModel = require('../models/bannerModel');
const { off } = require("../app");
const couponModel = require('../models/couponModel');
const orderModel = require("../models/orderModel");


module.exports = {
  adminLogin: (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        next()
      }
    } catch (error) {
      console.log(error);
      res.render("error")
    }
  },

  home: async (req, res) => {
    try {
      const errorMessage = req.flash("message")
      const userCount = await userModel.find({ isAdmin: false }).countDocuments()
      const orderStatusPending = await orderModel.find({ status: "pending" }).countDocuments()
      const orderStatusDelivered = await orderModel.find({ status: "Delivered" }).countDocuments()
      const totalSale = await orderModel.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" }
          }
        },
        {
          $group: {
            _id: "",
            "totalSale": { $sum: "$total" },
          },
        }, {
          $project: {
            _id: 0,
            "totalAmount": "$totalSale"
          }
        }
      ])

      const orderStatusCount = [orderStatusPending, orderStatusDelivered, totalSale[0]?.totalAmount]
      res.render("admin/admin-home", {
        errorMessage: errorMessage,
        layout: "layout/usermanage-layout",
        orderStatusCount: orderStatusCount,
        userCount: userCount,
      })
    } catch (err) {
      console.log(err.message)
      res.redirect("/")

    }
  },
  getGraphDetails: async (req, res) => {
    try {
      const totalRegister = await userModel.aggregate([
        {
          $match: {
            createdAt: { $ne: null }
          }
        },
        {
          $project:
          {
            month: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          }
        },
        {
          $group: {
            _id: { createdAt: "$month" },
            count: { $sum: 1 }
          }
        },

        {
          $addFields: {
            createdAt: "$_id.createdAt"
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $project: {
            _id: false
          }
        }
      ]).limit(7);

      const totalSale = await orderModel.aggregate([

        // First Stage
        {
          $match: { "createdAt": { $ne: null } }
        },
        {
          $match: { "status": { $ne: "Cancelled" } }
        },
        // Second Stage
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$total" },
          }
        },
        // Third Stage
        {
          $sort: { _id: -1 }
        }
      ])

      res.status(201).json({ totalRegister: totalRegister, totalSale: totalSale })

    } catch (err) {
      res.status(500).json({ err })
    }
  },
  adminLogout: (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        console.log('admin logout');
        res.redirect('/')
      }
    } catch (error) {
      res.render('error')
    }
  },
  getUserdata: async (req, res,) => {
    try {
      if (req.user?.isAdmin) {
        const users = await userModel.find({})
        res.render('admin/user-manage',
          {
            users: users,
            layout: 'layout/usermanage-layout'
          });
      }
    } catch (err) {
      console.log(err)
      res.render('error')
    }
  },
  blockUser: async (req, res) => {
    try {
      await userModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false })
      res.redirect('back')
    } catch (err) {
      console.log(err);
      res.redirect('back')
    }
  },
  activeUser: async (req, res) => {
    try {
      await userModel.findByIdAndUpdate(
        req.params.id,
        { isActive: true })
      res.redirect('/admin/getuserdata')
    } catch {
      console.log(err);
      res.redirect('/admin/getuserdata')
    }
  },
  getCategory: async (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        const categories = await categoryModel.find().sort(
          { categoryName: 1 })
        const errorMessage = req.flash("message")
        const successMessage = req.flash("success")
        res.render('admin/category-manage', {
          categories,
          errorMessage,
          successMessage,
          layout: 'layout/usermanage-layout'
        })
      }
    } catch (error) {
      console.log(error);
      res.redirect("/")
    }
  },

  addCategory: async (req, res, next) => {
    try {
      const category = new categoryModel({
        categoryName: req.body.categoryName
      })
      await category.save()
      res.redirect('/admin/getcategory')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')

    }
  },
  editCategory: async (req, res) => {
    try {

      await categoryModel.findByIdAndUpdate(
        req.params.id,
        { categoryName: req.body.categoryName })
      res.redirect('/admin/getcategory')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const findCategory = await productModel.findOne({ category: req.params.id }, { category: 1 }).lean()
      const category = (JSON.stringify(findCategory?.category))?.replace(/['"]+/g, '')
      const paramsId = req.params.id
      // const categoryId = JSON.stringify(category)
      // const Id = categoryId?.replace(/['"]+/g, '')
      if (category == paramsId) {
        req.flash("message", "Category exist in product")
        res.redirect('back')
      } else {
        await categoryModel.findByIdAndDelete(req.params.id).exec()
        req.flash("success", "Category deleted")
        res.redirect('back')
      }
    } catch (err) {
      console.log(err);
      res.redirect('back')
    }
  },
  getProduct: async (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        const category = await categoryModel.find()
        const product = await productModel.find().populate("category").exec()
        res.render('admin/product',
          {
            product: product, category: category,
            layout: 'layout/usermanage-layout'
          })
      }
    } catch (error) {
      console.log(error);
      res.render('error')
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const price = parseFloat(req.body.price)
      const discount = req.body.discount ? parseFloat(req.body.discount) : null
      const offerPrice = req.body.discount ? price - (((price / 100) * discount).toFixed(2)) : null;
      req.files.forEach(img => { })
      const productImages = req.files != null ? req.files.map((img) => img.filename) : null
      console.log(productImages)
      const product = new productModel({
        productName: req.body.productName,
        quantity: req.body.quantity,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        discount: discount,
        offerPrice: offerPrice,
        discription: req.body.discription,
        images: productImages


      })
      await product.save()
      res.redirect('/admin/product')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/product')
    }
  },
  editproduct: async (req, res) => {
    try {
      await productModel.findByIdAndUpdate(req.params.id, {
        productName: req.body.productName,
        quantity: req.body.quantity,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        discription: req.body.discription,
        images: req.body.productImages
      })
      res.redirect('back')
    } catch (error) {
      console.log(error);
      res.redirect('back')
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/product')
    } catch (error) {
      console.log(error);
      res.redirect('/admin/product')

    }
  },
  banner: async (req, res) => {
    try {
      if (req.user?.isAdmin) {
        const findBanner = await bannerModel.find()
        res.render('admin/banner-manage', { findBanner, layout: 'layout/usermanage-layout' });
      }
    } catch (err) {
      console.log(err);
    }
  },
  addBanner: async (req, res) => {
    try {
      // console.log("files: " + req.files)
      // console.log("file: " + req.file)
      console.log(req.body);
      if (req.user.isAdmin) {
        const image = req.file != null ? req.file.filename : null
        console.log(image);
        const banner = new bannerModel({
          title: req.body.title,
          image: image
        })
        await banner.save()
        console.log(banner);
      }
      res.redirect('back')
    } catch (error) {
      console.log(error);
    }
  },
  bannerDeactivate: async (req, res) => {
    try {

      await bannerModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false })
      res.redirect('back')
    } catch (error) {
      console.log(error);
      res.redirect('back')

    }
  },
  bannerActivate: async (req, res) => {
    try {
      await bannerModel.findByIdAndUpdate(
        req.params.id,
        { isActive: true })
      res.redirect('back')
    } catch (error) {
      console.log(error);
      res.redirect('back')

    }
  },
  coupon: async (req, res) => {
    try {
      const coupon = await couponModel.find()

      res.render("admin/coupon-manage", { coupon, layout: 'layout/usermanage-layout' })

    } catch (error) {
      console.log(error);

    }

  },

  addCoupon: async (req, res) => {
    const { name, couponCode, discount, maxLimit, minPurchase, expDate } = req.body
    try {
      await couponModel.create({
        name: name.toUpperCase(),
        couponCode: couponCode.toUpperCase(),
        discount,
        maxLimit,
        minPurchase,
        expDate
      })
      res.redirect('back')

    } catch (error) {
      console.log(error);

    }

  },
  deActivateCoupon: async (req, res) => {
    try {
      await couponModel.findByIdAndUpdate(req.params.id, {
        isActive: false
      })
      res.redirect('back')
    } catch (err) {
      console.log(err);
      res.redirect('back')
    }
  },
  activateCoupon: async (req, res) => {
    try {
      await couponModel.findByIdAndUpdate(req.params.id,
        { isActive: true })
      res.redirect('back')
    } catch (err) {
      console.log(err);
      res.redirect('back')
    }
  },
  orders: async (req, res) => {
    try {

      const allorders = await orderModel.find().populate([
        {
          path: "userId",
          model: "User"
        },
        {
          path: "products.productId",
          model: "Product"
        }
      ]).sort({ createdAt: -1 }).exec()
      res.render("admin/order-manage", { allorders: allorders, layout: "layout/usermanage-layout" })


    } catch (error) {
      console.log(error);
      res.redirect("/admin")

    }
  }


}

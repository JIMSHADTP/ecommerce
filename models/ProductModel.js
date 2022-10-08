const mongoose = require('mongoose')
const categoryModel = require('./categoryModel')
const subCategory = require('../models/subCategory');

const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
     },
    category: {
         type: mongoose.Schema.Types.ObjectId,
        required: true,
         ref: "Category"
     },
     subCategory: {
         type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "subCategory"
     },
    images: {
        type: [String],

    },
    price: {
        type: Number,
        required: true
    },
    discount:Number,
    offerPrice:Number,
    stock:Number,
    discription: {
        type: String,
        required: true
    }

},{timestamps:true})
module.exports = mongoose.model('Product', productSchema)
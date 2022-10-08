const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({

    title:{
        type:String,

    },
    image: {
        type:String,
        required : true
    },
    isActive : {
        type: Boolean,
        default:false
    }

},{timestamps:true})
module.exports = mongoose.model('Banner', bannerSchema)
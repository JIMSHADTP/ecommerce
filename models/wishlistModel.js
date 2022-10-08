const mongoose = require('mongoose');


const wishlistSchema =  new mongoose.Schema({

userId :{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
myWish:[
{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
       
    },
    name:{
        type:String,
        
    
    }
}
]

},{timestamps:true})

module.exports = mongoose.model('Wishlist',wishlistSchema)
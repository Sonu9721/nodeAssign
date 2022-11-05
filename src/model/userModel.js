const mongoose = require('mongoose')

const sellerSchema=new mongoose.Schema({
        fname: {type:String, required:true, trim:true},
        lname: {type:String, required:true, trim:true},
        email: {type: String, required:true,unique:true, lowercase:true,trim:true,},
        //profileImage: {type:String, required:true}, // s3 link
        phone: {type:String, unique:true, required:true,}, 
        password: {type: String, required:true,}, // encrypted password
        address: {
            street: {type:String, required:true},
            city: {type:String, required:true},
            pincode: {type:Number, required:true}
         }},{timestamps:true})

        module.exports=mongoose.model('Seller',sellerSchema)//mongose.model is wrapper for the crud operation in to the 
        //database there are two parameters first represent the collection second shows structure of collection
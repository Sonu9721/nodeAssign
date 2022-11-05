const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    phone: {type:String, unique:true, required:true,},
    email: {type: String, required:true,unique:true, lowercase:true,trim:true,},
    address:{type:String,required:true},
    city: {type:String,required:true},
    pincode:{type:String,required:true},
    // address: {
    //     street: {type:String},
    //     city: {type:String},
    //     pincode: {type:Number}
    //  },

        productImage: {
            type: String,
            required: true
            // s3 link
        },
        productTypes:{type:String,required:true},
        productName:{type:String,required:true},
        price: {
            type: Number
        },
        availableSizes: [{
            type: String,
            enum: ["S", "M", "L", "XXL", "XL"]
        }],
        quantity:{type:Number,required:true},
        features:{type:Object,required:true},
        manufacturingDetails:{type:Object,required:true},

    description: {
        type: String,
        required: true
    },
   
    // currencyId: {
    //     type: String,
    //     required: true,
    //     //INR 
    // },
    // currencyFormat: {
    //     type: String,
    //     required: true
    //     //Rupee symbol
    // },
    // isFreeShipping: {
    //     type: Boolean,
    //     default: false
    // },
  
  
    // installments: {
    //     type: Number
    // },
    merchantStatus:{
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

module.exports = mongoose.model("Product", productSchema)
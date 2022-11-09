const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    uplodBanner: {
        type: String,
        required: true
        //s3 link
    },
    brideName: {type:String, required:true,trim:true},
    groomName: {type: String, required:true,trim:true},
    cityName: {type:String,required:true,trim:true},
    eventDate:{type:Date,default:null},

    galaryImage: {
            type: String,
            required: true
            // s3 link
        },
    youtubeVideos:{type:String,required:true},
    vender:{type:String},
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

module.exports = mongoose.model("admin", adminSchema)
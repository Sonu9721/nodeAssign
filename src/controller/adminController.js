const mongoose=require('mongoose')
const adminModel=require("../model/adminModel")
const { uploadFile } = require("../awsFile/aws")

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}

const adminDocuments = async function (req,res){
    let data=req.body;


    //  let uplodImage=[]
    //  let temp;
    // let files = req.files
    // for(let key in files){
        
    //     temp=await uploadFile(files[key])
    //     uplodImage=[...uplodImage,temp]

    // }
    // console.log(uplodImage)
    let files = req.files
    if (files && files.length > 0) {
        //upload to s3 and get the uploaded link
        // res.send the link back to frontend/postman
        let uploadedFileURL = await uploadFile(files[0])
        data.uplodBanner = uploadedFileURL;
        data.galaryImage=uploadedFileURL
       
    } else {
        return res.status(400).send({ message: "profile cover image not given" })
    }

    //Object destructuring
    let {uplodBanner,brideName,groomName,cityName,eventDate,galaryImage,youtubeVideos,vender}=data;

    
    if (!isValidRequestBody(data)) {
        return res.status(400).send({ status: false, message: "please provide input credentials" });
    }

    if (!isValid(uplodBanner)) {
        console.log(uplodBanner)
        return res.status(400).send({ status: false, message: "please provide banner credentials" });
       
    }

    if (!isValid(brideName)) {
        return res.status(400).send({ status: false, message: "please provide brideName credentials" });
    }
    if (!isValid(groomName)) {
        return res.status(400).send({ status: false, message: "please provide groomName credentials" });
    }
    if (!isValid(cityName)) {
        return res.status(400).send({ status: false, message: "please provide cityName credentials" });
    }

    if (!isValid(eventDate)) {
        return res.status(400).send({ status: false, message: "please provide eventDate credentials" });
    }
    if (!isValid(galaryImage)) {
        return res.status(400).send({ status: false, message: "please provide galaryImage credentials" });
    
    }
    if (!isValid(youtubeVideos)) {
        return res.status(400).send({ status: false, message: "please provide youtubeVideos credentials" });
    }
    if (!isValid(vender)) {
        return res.status(400).send({ status: false, message: "please provide vender credentials" });
    }
    
    const newAdmin = await adminModel.create(data)
    return res.status(201).send({ status: true, message: " documents added successfully", data: newAdmin })

}




module.exports={adminDocuments}